import type { CSSProperties } from 'react'
import type { GameUser, RoomStatus } from '../../../../types/game'
import Button from '../../../components/Button'
import PlayerCard from './PlayerCard'

type CurrentPlayerProps = {
  player: GameUser
  status: RoomStatus | undefined
  participantCount: number
  connected: boolean
  showVoteCard: boolean
  percentage: number
  onAnswer: (value: number) => void
  onLeave: () => void
}

export default function CurrentPlayer({
  player,
  status,
  participantCount,
  connected,
  showVoteCard,
  percentage,
  onAnswer,
  onLeave
}: CurrentPlayerProps) {
  return (
    <footer className="self">
      <div className="self-info">
        <span>{player.score} pts</span>
        <strong>{player.name}</strong>
      </div>
      <div className="leave">
        <Button size="small" variant="outlined" color="danger" onClick={onLeave}>
          Leave
        </Button>
      </div>
      {status === 'Answering' && !player.waiting && (
        <div className="answer-fan" aria-label="Choose your answer">
          {Array.from({ length: participantCount }, (_, value) => {
            const style: CSSProperties & { '--angle': string } = {
              '--angle': `${(value - (participantCount - 1) / 2) * 3}deg`
            }

            return (
              <button
                key={value}
                type="button"
                className={`choice ${player.answer === value ? 'chosen' : ''}`}
                style={style}
                onClick={() => onAnswer(value)}
                disabled={!connected}
                aria-pressed={player.answer === value}
              >
                {value}
              </button>
            )
          })}
        </div>
      )}
      {showVoteCard && (
        <div className="self-card">
          <PlayerCard player={player} revealed percentage={percentage} showVoteFill={status === 'Voting'} />
        </div>
      )}
      <style jsx>{`
        .self {
          position: relative;
          z-index: 3;
          min-height: 105px;
          padding: 8px 20px;
          border-top: 1px solid var(--border);
          background: var(--background);
        }

        .self-info {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          color: var(--muted);
        }

        .self-info strong {
          overflow: hidden;
          color: var(--foreground);
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .answer-fan {
          display: flex;
          justify-content: center;
          margin: 4px 80px 0;
        }

        .choice {
          flex: 0 1 clamp(29px, 7vw, 47px);
          min-width: 0;
          height: 62px;
          margin: 0 -2px;
          border: 1px solid var(--accent);
          border-radius: 6px;
          background: var(--panel);
          color: var(--foreground);
          font: inherit;
          cursor: pointer;
          transform: rotate(var(--angle)) translateY(var(--lift, 0));
        }

        .choice.chosen {
          --lift: -8px;
          background: var(--accent);
          color: var(--background);
        }

        .choice:focus-visible {
          outline: 2px solid white;
          outline-offset: 2px;
        }

        .self-card {
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
        }

        .leave {
          position: absolute;
          bottom: 8px;
          left: 20px;
        }
      `}</style>
    </footer>
  )
}
