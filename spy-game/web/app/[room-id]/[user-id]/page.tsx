'use client'

import { useParams, useRouter } from 'next/navigation'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import type { GameState } from '../../../types/game'
import type { ClientToServerEvents, GameAcknowledgementResult, ServerToClientEvents } from '../../../types/socket'
import Button from '../../components/Button'
import Dialog from '../../components/Dialog'
import { useNotification } from '../../components/NotificationProvider'
import { getToken } from '../../components/room-service'
import CurrentPlayer from './_components/CurrentPlayer'
import GameField from './_components/GameField'
import GameHeader from './_components/GameHeader'

type GameSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export default function GamePage() {
  return (
    <Suspense fallback={<main>Loading game...</main>}>
      <GameRoom />
    </Suspense>
  )
}

function GameRoom() {
  const params = useParams<{ 'room-id': string, 'user-id': string }>()
  const roomId = params['room-id']
  const userId = params['user-id']
  const router = useRouter()
  const notify = useNotification()
  const socketRef = useRef<GameSocket | null>(null)
  const revision = useRef(-1)
  const seenBriefings = useRef(new Set<string>())
  const notifiedTermination = useRef<string | null>(null)
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [game, setGame] = useState<GameState | null>(null)
  const [connected, setConnected] = useState(false)
  const [briefing, setBriefing] = useState<string | null>(null)
  const [revealDone, setRevealDone] = useState(false)

  useEffect(() => {
    const token = getToken(roomId, userId)

    if (!token) {
      router.replace(`/${encodeURIComponent(roomId)}`)
      return
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) {
      notify({ status: 'error', message: 'Could not connect to server' })
      return
    }

    let connectionErrorShown = false
    const socket: GameSocket = io(apiUrl, { auth: { roomId, userId, token } })
    socketRef.current = socket

    socket.on('connect', () => {
      connectionErrorShown = false
      setConnected(true)
    })

    socket.on('disconnect', () => setConnected(false))

    socket.on('connect_error', error => {
      setConnected(false)

      if (/Room or player not found|Player connection expired|Invalid player token/.test(error.message)) {
        notify({ status: 'error', message: 'Your room session has expired. Please join again.' })
        router.replace(`/${encodeURIComponent(roomId)}`)
      } else if (!connectionErrorShown) {
        notify({ status: 'error', message: 'Could not connect to server' })
        connectionErrorShown = true
      }
    })

    socket.on('game:error', ({ error }) => {
      notify({ status: 'error', message: error })

      if (error === 'Player connection expired') {
        router.replace(`/${encodeURIComponent(roomId)}`)
      }
    })

    socket.on('game:state', state => {
      if (state.revision < revision.current) return

      revision.current = state.revision
      setGame(state)

      const terminationKey = `${roomId}:${state.round}`

      if (state.status === 'Terminated' && notifiedTermination.current !== terminationKey) {
        notifiedTermination.current = terminationKey
        notify({ status: 'info', message: 'The round ended because a player left.' })
      }

      if (revealTimer.current) clearTimeout(revealTimer.current)

      if (state.status === 'Revealing' && state.revealEndsAt) {
        const remaining = Math.max(0, state.revealEndsAt - state.serverTime)
        setRevealDone(remaining === 0)

        if (remaining > 0) {
          revealTimer.current = setTimeout(() => setRevealDone(true), remaining)
        }
      } else {
        setRevealDone(false)
      }

      const me = state.users.find(player => player.id === userId)

      if (!me?.waiting && state.role && state.round && (state.status === 'Answering' || state.status === 'Voting')) {
        const key = state.role === 'spy' && state.status === 'Answering' ? `${state.round}:spy` : `${state.round}:question`
        const message = key.endsWith(':spy') ? 'You are the Spy' : state.question

        if (message && !seenBriefings.current.has(key)) {
          seenBriefings.current.add(key)
          setBriefing(message)
        }
      }
    })

    return () => {
      if (revealTimer.current) clearTimeout(revealTimer.current)

      socket.disconnect()
      socketRef.current = null
    }
  }, [roomId, userId, router, notify])

  const report = useCallback((error: Error | null, result?: GameAcknowledgementResult) => {
    if (error || !result?.ok) {
      notify({ status: 'error', message: error?.message || result?.error || 'Game action failed.' })
    }
  }, [notify])

  function start() {
    socketRef.current?.timeout(5000).emit('game:start', report)
  }

  function answer(value: number) {
    socketRef.current?.timeout(5000).emit('game:answer', value, report)
  }

  function vote(id: string) {
    socketRef.current?.timeout(5000).emit('game:vote', id, report)
  }

  function leave() {
    socketRef.current?.disconnect()
    router.replace('/')
  }

  const me = game?.users.find(player => player.id === userId)
  const participants = game?.users.filter(player => !player.waiting) ?? []
  const voting = game?.status === 'Voting'
  const revealing = game?.status === 'Revealing' && !revealDone
  const activeVotes = participants.filter(player => player.vote !== null)
  const percentage = (id: string) => activeVotes.length
    ? activeVotes.filter(player => player.vote === id).length * 100 / activeVotes.length
    : 0
  const question = game?.role === 'spy' ? 'You are the Spy' : game?.question

  return (
    <main className="game">
      <GameHeader roomId={roomId} question={question} waiting={me?.waiting} />
      {!connected && <div className="connection" role="status">Connecting to the game...</div>}
      <div className="h-3" />
      <GameField
        game={game}
        me={me}
        participants={participants}
        userId={userId}
        connected={connected}
        revealDone={revealDone}
        percentage={percentage}
        onStart={start}
        onVote={vote}
      />
      {me && (
        <CurrentPlayer
          player={me}
          status={game?.status}
          participantCount={participants.length}
          connected={connected}
          showVoteCard={voting || revealing}
          percentage={percentage(userId)}
          onAnswer={answer}
          onLeave={leave}
        />
      )}
      {briefing && (
        <Dialog aria-labelledby="briefing-title" onClose={() => setBriefing(null)}>
          <h2 id="briefing-title">{briefing}</h2>
          <div className="briefing-action">
            <Button onClick={() => setBriefing(null)}>Ok</Button>
          </div>
        </Dialog>
      )}
      <style jsx>{`
        .game {
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100dvh;
          overflow: hidden;
          background: radial-gradient(ellipse at center, #17304a, var(--background) 72%);
        }

        .connection {
          position: absolute;
          z-index: 5;
          top: 65px;
          left: 50%;
          transform: translateX(-50%);
          color: var(--status-info);
        }

        .briefing-action {
          display: flex;
          justify-content: center;
          margin-top: 24px;
        }
      `}</style>
    </main>
  )
}
