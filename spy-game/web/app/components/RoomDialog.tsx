'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState, type SubmitEvent } from 'react'
import Button from './Button'
import Dialog from './Dialog'
import Input from './Input'
import { useNotification } from './NotificationProvider'
import { checkRoom, createRoom, joinRoom } from './room-service'

type Step = 'choose' | 'room' | 'new-name' | 'existing-name'

function getRoomId(value: string) {
  try {
    const input = value.trim()
    const url = new URL(input)
    if (
      !/^https?:\/\/[^/?#\\]+\/[^/?#\\]+$/i.test(input) ||
      !['http:', 'https:'].includes(url.protocol) ||
      url.host !== window.location.host ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      !/^\/[^/]+$/.test(url.pathname)
    ) {
      return null
    }

    const roomId = decodeURIComponent(url.pathname.slice(1))
    return roomId && !/[\/\\]/.test(roomId) ? roomId : null
  } catch {
    return null
  }
}

export default function RoomDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const notify = useNotification()
  const titleId = useId()
  const stepContainerRef = useRef<HTMLDivElement>(null)
  const stepContentRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState<Step>('choose')
  const [roomUrl, setRoomUrl] = useState('')
  const [roomId, setRoomId] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    const container = stepContainerRef.current
    const content = stepContentRef.current
    if (!container || !content) return

    const observer = new ResizeObserver(() => {
      const height = content.getBoundingClientRect().height
      if (height > 0) container.style.height = `${height}px`
    })
    observer.observe(content)
    return () => observer.disconnect()
  }, [])

  function changeStep(nextStep: Step) {
    setError('')
    setStep(nextStep)
  }

  async function submitRoom(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const id = getRoomId(roomUrl)
    if (!id) {
      setError('Enter a room URL on this host with a single room ID.')
      return
    }

    setPending(true)
    setError('')
    try {
      const room = await checkRoom(id)
      if (!room.exists) {
        notify({ status: 'error', message: 'Room not found. Check the URL and try again.' })
        return
      }
      setRoomId(room.roomId)
      changeStep('existing-name')
    } catch (reason) {
      notify({ status: 'error', message: reason instanceof Error ? reason.message : 'Could not check the room. Please try again.' })
    } finally {
      setPending(false)
    }
  }

  async function submitName(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Enter your name or nickname.')
      return
    }

    setPending(true)
    setError('')
    try {
      const result =
        step === 'new-name'
          ? await createRoom(trimmedName)
          : await joinRoom(roomId, trimmedName)
      router.push(`/${encodeURIComponent(result.roomId)}/${encodeURIComponent(result.userId)}`)
      onClose()
    } catch (reason) {
      notify({ status: 'error', message: reason instanceof Error ? reason.message : 'Could not enter the room. Please try again.' })
      setPending(false)
    }
  }

  const title =
    step === 'choose'
      ? 'Enter a room'
      : step === 'room'
        ? 'Enter a room URL'
        : 'What should we call you?'

  return (
    <Dialog
      aria-labelledby={titleId}
      kicker="Your next mission"
      onClose={onClose}
      closeDisabled={pending}
    >
      <div className="step-container" ref={stepContainerRef}>
        <div className="step-content" ref={stepContentRef}>
          <h2 id={titleId}>{title}</h2>
          {step === 'choose' ? (
            <>
              <p className="description">Start a new game or join your friends.</p>
              <div className="actions">
                <div className="action">
                  <Button className="w-full" onClick={() => changeStep('new-name')}>
                    New game
                  </Button>
                </div>
                <div className="action">
                  <Button className="w-full" variant="outlined" onClick={() => changeStep('room')}>
                    Enter existing
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={step === 'room' ? submitRoom : submitName} noValidate>
              {step === 'room' ? (
                <Input
                  id="room-url"
                  label="Room URL"
                  type="url"
                  value={roomUrl}
                  onChange={(event) => setRoomUrl(event.target.value)}
                  placeholder="https://example.com/room-id"
                  autoFocus
                  disabled={pending}
                  error={error}
                />
              ) : (
                <Input
                  id="player-name"
                  label="Name or nickname"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  maxLength={32}
                  autoComplete="nickname"
                  autoFocus
                  disabled={pending}
                  error={error}
                />
              )}
              <div className="actions">
                <div className="action">
                  <Button className="w-full" type="submit" loading={pending}>
                    {step === 'room' ? 'Continue' : 'Enter'}
                  </Button>
                </div>
                <div className="action">
                  <Button
                    className="w-full"
                    variant="outlined"
                    disabled={pending}
                    onClick={() => changeStep(step === 'existing-name' ? 'room' : 'choose')}
                  >
                    Back
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <style jsx>{`
        .step-container {
          overflow: hidden;
          overflow: clip;
          overflow-clip-margin: 5px;
          transition: height 220ms ease;
        }

        .step-content {
          display: flow-root;
        }

        h2 {
          margin: 16px 0 0;
          font-size: 1.6rem;
          letter-spacing: -0.035em;
          text-align: center;
        }

        .description {
          margin: 16px 0 0;
          color: var(--muted);
          line-height: 1.6;
        }

        form {
          margin-top: 24px;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 24px;
        }

        .action {
          flex: 1 1 145px;
          min-width: 0;
        }

        form .actions {
          margin-top: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .step-container {
            transition: none;
          }
        }
      `}</style>
    </Dialog>
  )
}
