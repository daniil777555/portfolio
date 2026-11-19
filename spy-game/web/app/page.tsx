'use client'

import Button from './components/Button'
import RoomDialog from './components/RoomDialog'
import Logo from '../public/logo.svg'
import { useState } from 'react'

const rules = [
  {
    title: 'Everyone gets a role.',
    description:
      'The spy receives a card revealing their role. Everyone else receives a card with the same question.'
  },
  {
    title: 'Choose an answer.',
    description:
      'Use your numbered answer cards to answer the question, such as “How many players read more than I do?” Pick a number, but keep it hidden for now. Remember, don\'t count yourself.'
  },
  {
    title: 'Reveal the question.',
    description:
      'Once everyone has chosen an answer, the question is revealed to all players.'
  },
  {
    title: 'Show your answers.',
    description:
      'After the question is revealed, everyone shows their chosen answer.'
  },
  {
    title: 'Vote for the spy.',
    description:
      'Look at the answers and decide who you think the spy is. Take your time: once everyone has voted, the game automatically reveals the spy.'
  }
]

export default function Home() {
  const [roomDialogOpen, setRoomDialogOpen] = useState(false)

  return (
    <main className="page-shell">
      <div className="page-content">
        <header className="hero">
          <div className="hero-logo">
            <Logo width={144} height={144} aria-hidden="true" />
          </div>
          <p className="eyebrow">
            <span className="eyebrow-dot" aria-hidden="true" />
            A social deduction game
          </p>
          <h1>
            Spy <span>Game</span>
          </h1>
          <p className="hero-description">
            Enter a room, invite your friends and play!
          </p>
          <div className="hero-action">
            <Button size="large" onClick={() => setRoomDialogOpen(true)}>
              Enter a room
            </Button>
          </div>
          {roomDialogOpen && <RoomDialog onClose={() => setRoomDialogOpen(false)} />}
        </header>

        <section className="rules-panel" aria-labelledby="rules-title">
          <div className="rules-heading">
            <div>
              <p className="section-kicker">Mission briefing</p>
              <h2 id="rules-title">Rules of the game</h2>
            </div>
            <span className="rules-count">05 RULES</span>
          </div>

          <ol className="rules-list">
            {rules.map((rule, index) => (
              <li className="rule" key={rule.title}>
                <span className="rule-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3>{rule.title}</h3>
                  <p>{rule.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <footer className="page-footer">
          <span className="footer-line" aria-hidden="true" />
          <p>Trust your instincts. Trust no one.</p>
          <span className="footer-line" aria-hidden="true" />
        </footer>
      </div>
      <style jsx>{`
        .page-shell {
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(ellipse at 50% -18%, rgba(32, 80, 111, 0.38), transparent 58%),
            var(--background);
          padding: 104px 24px 40px;
        }

        .page-content {
          width: min(100%, 760px);
          margin: 0 auto;
        }

        .hero {
          margin-bottom: 56px;
          text-align: center;
        }

        .hero-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
          color: #8ab8d4;
        }

        .eyebrow,
        .section-kicker {
          color: var(--accent);
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          line-height: 1.4;
          text-transform: uppercase;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 20px;
        }

        .eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 14px rgba(115, 224, 190, 0.75);
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(3.75rem, 11vw, 6.5rem);
          font-weight: 750;
          letter-spacing: -0.075em;
          line-height: 0.98;
        }

        .hero h1 span {
          color: var(--accent);
        }

        .hero-description {
          margin: 22px 0 0;
          color: #bdc9d8;
          font-size: clamp(1rem, 2.5vw, 1.15rem);
          line-height: 1.6;
        }

        .hero-action {
          margin-top: 28px;
        }

        .rules-panel {
          overflow: hidden;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(15, 35, 57, 0.96), rgba(9, 25, 44, 0.96));
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);
        }

        .rules-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 20px;
          padding: 30px 34px 25px;
          border-bottom: 1px solid var(--border);
        }

        .section-kicker {
          margin: 0 0 8px;
          font-size: 0.68rem;
        }

        .rules-heading h2 {
          margin: 0;
          font-size: clamp(1.45rem, 4vw, 1.8rem);
          font-weight: 650;
          letter-spacing: -0.035em;
        }

        .rules-count {
          flex: 0 0 auto;
          padding: 7px 10px;
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--muted);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.64rem;
          letter-spacing: 0.1em;
        }

        .rules-list {
          margin: 0;
          padding: 4px 34px;
          list-style: none;
        }

        .rule {
          display: grid;
          grid-template-columns: 38px 1fr;
          gap: 18px;
          padding: 22px 0;
        }

        .rule + .rule {
          border-top: 1px solid var(--border);
        }

        .rule-number {
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border: 1px solid rgba(115, 224, 190, 0.24);
          border-radius: 50%;
          color: var(--accent);
          font-family: var(--font-geist-mono), monospace;
          font-size: 0.7rem;
        }

        .rule h3 {
          margin: 1px 0 5px;
          font-size: 0.98rem;
          font-weight: 650;
          letter-spacing: -0.015em;
        }

        .rule p {
          max-width: 590px;
          margin: 0;
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.7;
        }

        .page-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 30px;
        }

        .page-footer p {
          margin: 0;
          color: #74869d;
          font-size: 0.75rem;
          letter-spacing: 0.04em;
        }

        .footer-line {
          width: 24px;
          height: 1px;
          background: rgba(159, 184, 211, 0.22);
        }

        @media (max-width: 600px) {
          .page-shell {
            padding: 76px 18px 30px;
          }

          .hero {
            margin-bottom: 40px;
          }

          .rules-heading {
            padding: 24px 22px 20px;
          }

          .rules-list {
            padding: 2px 22px;
          }

          .rule {
            grid-template-columns: 32px 1fr;
            gap: 13px;
            padding: 19px 0;
          }

          .rule-number {
            width: 30px;
            height: 30px;
          }
        }
      `}</style>
    </main>
  )
}
