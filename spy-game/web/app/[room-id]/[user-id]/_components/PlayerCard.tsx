import type { GameUser } from '../../../../types/game'
import UserIcon from '../../../../public/user.svg'

type PlayerCardProps = {
  player: GameUser
  revealed: boolean
  selected?: boolean
  percentage?: number
  showVoteFill?: boolean
  onVote?: () => void
  answerSide?: 'left' | 'right' | 'bottom'
}

function CardContents({ player, revealed, percentage, showVoteFill = true, answerSide }: PlayerCardProps) {
  return (
    <>
      {showVoteFill && <span className="fill" style={{ height: `${percentage ?? 0}%` }} />}
      <span className="details">
        <span className="avatar">
          <UserIcon width={30} height={30} aria-hidden="true" />
        </span>
        <span className="name">{player.name}</span>
        {percentage === undefined && <span className="score">{player.score} pts</span>}
        {player.hasAnswered && answerSide !== 'bottom' && (
          <span className={`answer ${revealed ? 'revealed' : ''} ${answerSide ? `side-${answerSide}` : ''}`}>
            {revealed ? player.answer : '?'}
          </span>
        )}
        {percentage !== undefined && <span className="percent">{Math.round(percentage)}%</span>}
      </span>
      {player.hasAnswered && answerSide === 'bottom' && (
        <span className={`answer side-bottom ${revealed ? 'revealed' : ''}`}>
          {revealed ? player.answer : '?'}
        </span>
      )}
      <style jsx>{`
        .fill {
          position: absolute;
          right: 0;
          bottom: 0;
          left: 0;
          border-radius: 11px;
          background: rgba(195, 40, 58, 0.35);
          transition: height 250ms ease;
        }

        .details {
          position: relative;
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 3px;
        }

        .avatar {
          display: grid;
          width: 38px;
          height: 38px;
          place-items: center;
          color: var(--accent);
        }

        .name {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.82rem;
          font-weight: 650;
        }

        .score,
        .percent {
          color: var(--muted);
          font-size: 0.68rem;
        }

        .answer {
          display: grid;
          width: 26px;
          height: 32px;
          place-items: center;
          border: 1px solid var(--accent);
          border-radius: 4px;
          background: var(--background);
          color: var(--accent);
          font-weight: 700;
        }

        .answer.revealed {
          background: var(--accent);
          color: var(--background);
          animation: flip-answer 350ms ease-out both;
        }

        .side-left,
        .side-right {
          position: absolute;
          top: 35%;
        }

        .side-left {
          right: calc(100% + 12px);
        }

        .side-right {
          left: calc(100% + 12px);
        }

        .side-bottom {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          left: 0;
          margin: 0 auto;
        }

        @keyframes flip-answer {
          from { transform: rotateY(90deg); }
          to { transform: rotateY(0); }
        }

        @media (max-height: 700px) {
          .avatar {
            width: 28px;
            height: 28px;
          }

          .answer {
            height: 24px;
          }
        }

        @media (max-width: 400px) {
          .details {
            gap: 2px;
          }

          .avatar {
            width: 22px;
            height: 22px;
          }

          .name {
            font-size: 0.7rem;
            line-height: 1.1;
          }

          .score,
          .percent {
            font-size: 0.6rem;
            line-height: 1;
          }

          .answer {
            width: 20px;
            height: 20px;
            font-size: 0.7rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .fill {
            transition: none;
          }

          .answer.revealed {
            animation: none;
          }
        }
      `}</style>
    </>
  )
}

export default function PlayerCard(props: PlayerCardProps) {
  const { player, selected, onVote } = props
  const contents = <CardContents {...props} />

  return (
    <>
      {onVote ? (
        <button
          type="button"
          className={`player ${selected ? 'selected' : ''}`}
          onClick={onVote}
          aria-pressed={selected}
          aria-label={`Vote for ${player.name}`}
        >
          {contents}
        </button>
      ) : (
        <div className={`player ${selected ? 'selected' : ''}`}>{contents}</div>
      )}
      <style jsx>{`
        .player {
          position: relative;
          display: block;
          width: clamp(72px, 11vw, 110px);
          min-height: 100px;
          padding: 8px;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: var(--panel);
          color: var(--foreground);
          font: inherit;
          text-align: center;
        }

        button.player {
          cursor: pointer;
        }

        button.player:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
        }

        .player.selected {
          border-color: #ef5968;
          box-shadow: 0 0 0 2px #ef5968;
        }

        @media (max-height: 700px) {
          .player {
            min-height: 68px;
            padding: 4px;
          }
        }

        @media (max-width: 400px) {
          .player {
            width: clamp(56px, 18vw, 72px);
            min-height: 64px;
            padding: 3px;
          }
        }
      `}</style>
    </>
  )
}
