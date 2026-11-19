import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useRef, useState } from 'react'
import Button from '../../../components/Button'
import Dialog from '../../../components/Dialog'
import Input from '../../../components/Input'
import { useNotification } from '../../../components/NotificationProvider'

type GameHeaderProps = {
  roomId: string
  question: string | null | undefined
  waiting: boolean | undefined
}

export default function GameHeader({ roomId, question, waiting }: GameHeaderProps) {
  const notify = useNotification()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inviteUrl = `${typeof window === 'undefined' ? '' : window.location.origin}/${encodeURIComponent(roomId)}`

  useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current)
  }, [])

  async function copyInvite() {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)

      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 3000)
    } catch {
      notify({ status: 'error', message: 'Could not copy the invitation link.' })
    }
  }

  return (
    <>
      <header className="header">
        <div className="question">
          {question || (waiting ? 'Waiting for the next round' : 'Waiting for a round')}
        </div>
        <div className="invite-action">
          <Button size="small" variant="outlined" onClick={() => setInviteOpen(true)}>
            Invite friends
          </Button>
        </div>
      </header>
      {inviteOpen && (
        <Dialog aria-labelledby="invite-title" onClose={() => setInviteOpen(false)}>
          <h2 id="invite-title" className="invite-title">Invite friends</h2>
          <div className="qr">
            <QRCodeSVG value={inviteUrl} size={180} />
          </div>
          <Input
            id="invite-link"
            label="Invitation link"
            readOnly
            value={inviteUrl}
            action={(
              <Button size="small" variant="outlined" onClick={copyInvite}>
                Copy{copied && ' ✓'}
              </Button>
            )}
          />
        </Dialog>
      )}
      <style jsx>{`
        .header {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          gap: 16px;
          min-height: 64px;
          padding: 10px 20px;
          border-bottom: 1px solid var(--border);
        }

        .question {
          display: -webkit-box;
          flex: 1;
          min-width: 0;
          overflow: hidden;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          color: var(--foreground);
          overflow-wrap: anywhere;
          text-align: center;
        }

        .invite-action {
          flex-shrink: 0;
        }

        .qr {
          display: flex;
          justify-content: center;
          margin: 16px 0;
        }

        .invite-title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
        }

        @media (max-width: 600px) {
          .header {
            padding: 8px;
          }

          .question {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </>
  )
}
