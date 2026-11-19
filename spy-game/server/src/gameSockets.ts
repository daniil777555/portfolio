import type { Server, Socket } from 'socket.io'
import config from './config/config.js'
import { RoomStatus } from './models/game.js'
import { _getGameState, _heartbeat, disconnectPlayer, expirePlayers, saveAnswer, saveVote, startRound } from './controllers/gameController.js'

type Acknowledgement = (result: { ok: boolean, error?: string }) => void

/** Send each connected player a snapshot with their own role and a hidden spy ID until reveal. */
const broadcastGameState = async (io: Server, roomId: string) => {
  const [state, sockets] = await Promise.all([_getGameState(roomId), io.in(roomId).fetchSockets()])
  if (!state) return

  for (const socket of sockets) {
    const user = state.users.find(player => player.id === socket.data.userId)
    if (!user) continue
    const inRound = [RoomStatus.Answering, RoomStatus.Voting, RoomStatus.Revealing].includes(state.status) && !user.waiting
    socket.emit('game:state', {
      ...state,
      serverTime: Date.now(),
      spyId: state.status === RoomStatus.Revealing ? state.spyId : null,
      question: state.status === RoomStatus.Answering && (state.spyId === user.id || user.waiting) ? null : state.question,
      users: state.users.map(player => ({
        ...player,
        answer: state.status === RoomStatus.Answering && player.id !== user.id ? null : player.answer
      })),
      role: inRound ? (state.spyId === user.id ? 'spy' : 'player') : null
    })
  }
}

/** Apply an event, broadcast its state and report success or failure to its sender. */
const handleEvent = async (
  socket: Socket,
  io: Server,
  action: () => Promise<unknown>,
  acknowledge?: Acknowledgement
) => {
  let updated = false
  try {
    await action()
    updated = true
    await broadcastGameState(io, socket.data.roomId)
    if (typeof acknowledge === 'function') acknowledge({ ok: true })
  } catch (error) {
    // A broadcast failure can occur after the mutation has already succeeded.
    const message = updated
      ? 'Game updated, but broadcasting the state failed'
      : error instanceof Error ? error.message : 'Unexpected game error'
    console.error('Game event failed:', error)
    if (typeof acknowledge === 'function') acknowledge({ ok: false, error: message })
    else socket.emit('game:error', { error: message })
  }
}

/** Register authentication, game events, presence renewal and the expiry sweep. */
export const setupGameSockets = (io: Server) => {
  if (!Number.isFinite(config.heartbeatMs) || !Number.isFinite(config.ttlMs) ||
      config.heartbeatMs <= 0 || config.ttlMs <= 0 || config.heartbeatMs >= config.ttlMs) {
    throw new Error('Heartbeat and TTL must be positive, and heartbeat must be shorter than the TTL')
  }

  // Authenticate and establish the first lease before accepting the socket.
  io.use((socket, next) => {
    const { roomId, userId, token } = socket.handshake.auth
    if (typeof roomId !== 'string' || typeof userId !== 'string' || typeof token !== 'string' || !roomId || !userId || !token) {
      next(new Error('Room ID, player ID and token are required'))
      return
    }
    void _heartbeat(roomId, userId, socket.id, token).then(async () => {
      // The client may disconnect while Redis is processing authentication.
      if (socket.conn.readyState !== 'open') {
        await disconnectPlayer(roomId, userId, socket.id)
        next(new Error('Connection closed'))
        return
      }
      socket.data.roomId = roomId
      socket.data.userId = userId
      next()
    }).catch(error => {
      console.error('Socket authentication failed:', error)
      next(error instanceof Error ? error : new Error('Socket authentication failed'))
    })
  })

  io.on('connection', socket => {
    const { roomId, userId } = socket.data
    // Each socket renews its own lease; another socket can keep the player present.
    const heartbeat = setInterval(() => {
      void _heartbeat(roomId, userId, socket.id).catch(error => {
        console.error('Player heartbeat failed:', error)
        socket.emit('game:error', { error: 'Player connection expired' })
        socket.disconnect(true)
      })
    }, config.heartbeatMs)
    heartbeat.unref()

    socket.on('disconnect', () => {
      clearInterval(heartbeat)
      void disconnectPlayer(roomId, userId, socket.id).catch(error => console.error('Player disconnect failed:', error))
    })

    // The authenticated socket supplies the acting player, not the event payload.
    socket.on('game:start', (acknowledge?: Acknowledgement) => {
      void handleEvent(socket, io, () => startRound({ body: { roomId, userId } }), acknowledge)
    })
    socket.on('game:answer', (answer: number, acknowledge?: Acknowledgement) => {
      void handleEvent(socket, io, () => saveAnswer({ body: { roomId, userId, answer } }), acknowledge)
    })
    socket.on('game:vote', (spyId: string, acknowledge?: Acknowledgement) => {
      void handleEvent(socket, io, () => saveVote({ body: { roomId, userId, spyId } }), acknowledge)
    })

    void Promise.resolve(socket.join(roomId))
      .then(() => broadcastGameState(io, roomId))
      .catch(error => {
        console.error('Joining socket room failed:', error)
        socket.emit('game:error', { error: 'Could not join the room' })
        socket.disconnect(true)
      })
  })

  // Avoid overlapping sweeps; expiration is rechecked atomically by the controller.
  let sweeping = false
  const sweep = setInterval(() => {
    if (sweeping) return
    sweeping = true
    void expirePlayers()
      .then(async rooms => {
        for (const roomId of rooms) await broadcastGameState(io, roomId)
      })
      .catch(error => console.error('Player expiration failed:', error))
      .finally(() => { sweeping = false })
  }, config.heartbeatMs)
  sweep.unref()
  // The caller can stop the periodic sweep when shutting down the server.
  return () => clearInterval(sweep)
}
