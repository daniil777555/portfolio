import type { CSSProperties } from 'react'
import type { GameState, GameUser } from '../../../../types/game'
import Button from '../../../components/Button'
import PlayerCard from './PlayerCard'

type GameFieldProps = {
  game: GameState | null
  me: GameUser | undefined
  participants: GameUser[]
  userId: string
  connected: boolean
  revealDone: boolean
  percentage: (id: string) => number
  onStart: () => void
  onVote: (id: string) => void
}

const PYRAMID_LAYOUT: Record<number, readonly number[] | undefined> = {
  2: [2],
  3: [1, 2],
  4: [1, 3],
  5: [2, 3],
  6: [1, 2, 3],
  7: [3, 4],
  8: [1, 3, 4],
  9: [2, 3, 4]
}

export default function GameField({
  game,
  me,
  participants,
  userId,
  connected,
  revealDone,
  percentage,
  onStart,
  onVote
}: GameFieldProps) {
  const others = game?.users.filter(player => player.id !== userId) ?? []
  const votingPlayers = others.filter(player => !player.waiting)
  const rows: GameUser[][] = []
  const layout = PYRAMID_LAYOUT[votingPlayers.length]

  if (layout) {
    let rowStart = 0

    for (const count of layout) {
      rows.push(votingPlayers.slice(rowStart, rowStart + count))
      rowStart += count
    }
  } else {
    for (let count = 1, index = 0; index < votingPlayers.length; count++) {
      rows.push(votingPlayers.slice(index, index + count))
      index += count
    }
  }

  const voting = game?.status === 'Voting'
  const revealing = game?.status === 'Revealing' && !revealDone
  const topVoted = participants.reduce<GameUser | null>((top, player) =>
    !top || percentage(player.id) > percentage(top.id) ? player : top, null)
  const spy = game?.users.find(player => player.id === game.spyId)
  const canStart = game && me && game.ownerId === userId &&
    (game.status === 'NewGame' || game.status === 'Terminated' || (game.status === 'Revealing' && revealDone))

  return (
    <section className="field" aria-label="Game field">
      {others.map((player, index) => {
        const angle = Math.PI / 2 + 2 * Math.PI * (index + 1) / (others.length + 1)
        const x = Math.cos(angle)
        const y = Math.sin(angle)
        const topPlayer = angle > Math.PI && angle < 2 * Math.PI
        const position: CSSProperties = {
          left: `calc(${50 + 50 * x}% - ${50 * x}px)`,
          top: `calc(${50 + 50 * y}% - ${50 * y}px)`
        }

        return (
          <div key={player.id} className="seat" style={position}>
            <PlayerCard
              player={player}
              revealed={game?.status !== 'Answering'}
              answerSide={topPlayer ? 'bottom' : x < 0 ? 'right' : 'left'}
            />
          </div>
        )
      })}
      {canStart && (
        <div className="start">
          <Button disabled={!connected || game.users.length < 3} onClick={onStart}>
            Start round
          </Button>
          {game.users.length < 3 && <p>At least 3 players are needed.</p>}
        </div>
      )}
      {me?.waiting && <p className="notice">You will join the next round.</p>}
      <div
        className={`overlay vote-overlay ${voting ? 'visible' : ''}`}
        aria-hidden={!voting}
        inert={!voting}
      >
        <h2>{game?.revoteCount ? 'Votes were tied. Vote again!' : 'Who is the spy?'}</h2>
        <div className="pyramid">
          {rows.map((row, index) => (
            <div className="pyramid-row" key={index}>
              {row.map(player => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  revealed
                  selected={me?.vote === player.id}
                  percentage={percentage(player.id)}
                  onVote={!me?.waiting && connected ? () => onVote(player.id) : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {revealing && (
        <div className="overlay">
          <p className="round-points">+{me?.roundScore ?? 0} points this round</p>
          <h2>The spy is revealed</h2>
          <div className="reveal-cards">
            {topVoted && (
              <div className="voted">
                <span>Most voted</span>
                <PlayerCard player={topVoted} revealed />
              </div>
            )}
            {spy && (
              <div className="spy">
                <span>Spy</span>
                <PlayerCard player={spy} revealed />
              </div>
            )}
          </div>
        </div>
      )}
      <style jsx>{`
        .field {
          position: relative;
          flex: 1;
          min-height: 0;
        }

        .seat {
          position: absolute;
          transform: translate(-50%, -50%);
        }

        .start {
          position: absolute;
          top: 55%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .start p,
        .notice {
          color: var(--muted);
          font-size: 0.8rem;
        }

        .notice {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
        }

        .overlay {
          position: absolute;
          z-index: 2;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 12px;
          background: rgba(3, 10, 20, 0.94);
        }

        .overlay h2 {
          margin: 0;
          font-size: clamp(1rem, 3vw, 1.5rem);
        }

        .vote-overlay {
          z-index: 3;
          visibility: hidden;
          opacity: 0;
          pointer-events: none;
          transition: opacity 300ms ease, visibility 0s linear 300ms;
        }

        .vote-overlay.visible {
          visibility: visible;
          opacity: 1;
          pointer-events: auto;
          transition: opacity 300ms ease, visibility 0s;
        }

        @starting-style {
          .vote-overlay.visible {
            opacity: 0;
          }
        }

        .pyramid {
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 8px;
          width: min(96%, 460px);
        }

        .pyramid-row {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .reveal-cards {
          display: flex;
          gap: 25px;
          text-align: center;
        }

        .voted,
        .spy {
          display: grid;
          gap: 8px;
          animation-duration: 1s;
          animation-delay: 1s;
          animation-fill-mode: both;
        }

        .voted {
          animation-name: slide-left;
        }

        .spy {
          animation-name: slide-right;
        }

        .round-points {
          position: absolute;
          top: 10px;
          color: var(--accent);
          animation: points 1ms 2s both;
        }

        @keyframes slide-left {
          from { transform: translateX(60px); }
          to { transform: translateX(0); }
        }

        @keyframes slide-right {
          from { transform: translateX(-60px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes points {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (max-width: 600px) {
          .pyramid,
          .pyramid-row {
            gap: 4px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .vote-overlay,
          .vote-overlay.visible {
            transition: none;
          }

          .voted,
          .spy,
          .round-points {
            animation: none;
          }
        }
      `}</style>
    </section>
  )
}
