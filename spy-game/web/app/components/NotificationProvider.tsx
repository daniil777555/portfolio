'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode
} from 'react'
import { createPortal } from 'react-dom'

export type NotificationStatus = 'error' | 'success' | 'info'

type NotificationInput = {
  status: NotificationStatus
  message: string
}

type Notification = NotificationInput & {
  id: number
}

const NotificationContext = createContext<((notification: NotificationInput) => void) | null>(null)
const displayDuration = 5000
const animationFallbackDuration = 300

const getActiveDialog = () => {
  const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog:modal')
  return dialogs.item(dialogs.length - 1)
}

export function useNotification() {
  const notify = useContext(NotificationContext)
  if (!notify) throw new Error('useNotification must be used within NotificationProvider')
  return notify
}

export default function NotificationProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<Notification[]>([])
  const [closing, setClosing] = useState(false)
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null)
  const nextId = useRef(0)
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const regionRef = useRef<HTMLDivElement>(null)
  const current = queue[0]
  const currentId = current?.id

  const notify = useCallback((notification: NotificationInput) => {
    const id = nextId.current++
    setDialog(getActiveDialog())
    setQueue(previous => [...previous, { ...notification, id }])
  }, [])

  const finishClosing = useCallback(() => {
    if (exitTimer.current) clearTimeout(exitTimer.current)
    exitTimer.current = null
    setQueue(previous => previous[0]?.id === currentId ? previous.slice(1) : previous)
    setClosing(false)
  }, [currentId])

  useEffect(() => {
    if (currentId === undefined || closing) return
    const timer = setTimeout(() => setClosing(true), displayDuration)
    return () => clearTimeout(timer)
  }, [currentId, closing])

  useEffect(() => {
    if (!closing) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    exitTimer.current = setTimeout(finishClosing, reducedMotion ? 0 : animationFallbackDuration)
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current)
      exitTimer.current = null
    }
  }, [closing, finishClosing])

  useEffect(() => {
    if (currentId === undefined) return
    const observer = new MutationObserver(() => setDialog(getActiveDialog()))
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['open'] })
    return () => observer.disconnect()
  }, [currentId])

  useEffect(() => {
    const region = regionRef.current
    if (!dialog || currentId === undefined || !region || typeof region.showPopover !== 'function') return
    region.showPopover()
    return () => {
      if (region.matches(':popover-open')) region.hidePopover()
    }
  }, [dialog, currentId])

  const region = (
    <>
      <div ref={regionRef} className="notification-region" popover={dialog ? 'manual' : undefined}>
        {current && (
          <div
            key={current.id}
            className={`notification ${current.status}`}
            data-closing={closing}
            role={dialog ? (current.status === 'error' ? 'alert' : 'status') : undefined}
            onAnimationEnd={(event) => {
              if (closing && event.target === event.currentTarget) finishClosing()
            }}
          >
            <div className="content">
              <span className="status">{current.status}</span>
              <p>{current.message}</p>
            </div>
            <button
              type="button"
              className="dismiss"
              aria-label="Dismiss notification"
              onClick={() => setClosing(true)}
            >
              &times;
            </button>
          </div>
        )}
      </div>
      <style jsx>{`
        .notification-region {
          position: fixed;
          z-index: 1000;
          inset: auto;
          top: max(24px, env(safe-area-inset-top));
          right: 24px;
          width: min(380px, calc(100vw - 32px));
          max-width: none;
          max-height: none;
          margin: 0;
          padding: 0;
          overflow: visible;
          border: 0;
          background: transparent;
          pointer-events: none;
        }

        .notification {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 18px;
          border-radius: 12px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3);
          pointer-events: auto;
          animation-name: notification-slide-in;
          animation-duration: 250ms;
          animation-timing-function: ease-out;
          animation-fill-mode: both;
        }

        .notification[data-closing="true"] {
          animation-name: notification-slide-out;
          animation-timing-function: ease-in;
        }

        .error {
          background: var(--status-error);
          color: var(--status-error-foreground);
        }

        .success {
          background: var(--status-success);
          color: var(--status-success-foreground);
        }

        .info {
          background: var(--status-info);
          color: var(--status-info-foreground);
        }

        .content {
          min-width: 0;
        }

        .status {
          display: block;
          margin-bottom: 4px;
          font-size: 0.7rem;
          font-weight: 750;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .content p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        .dismiss {
          flex: none;
          min-width: 32px;
          min-height: 32px;
          padding: 0;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: inherit;
          font: inherit;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
        }

        .dismiss:hover {
          background: rgba(0, 0, 0, 0.12);
        }

        .dismiss:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }

        @keyframes notification-slide-in {
          from { transform: translateX(calc(100% + 24px)); }
          to { transform: translateX(0); }
        }

        @keyframes notification-slide-out {
          from { transform: translateX(0); }
          to { transform: translateX(calc(100% + 24px)); }
        }

        @media (max-width: 600px) {
          .notification-region {
            top: auto;
            right: auto;
            bottom: calc(16px + env(safe-area-inset-bottom));
            left: 50%;
            transform: translateX(-50%);
          }

          @keyframes notification-slide-in {
            from { transform: translateY(calc(100% + 16px + env(safe-area-inset-bottom))); }
            to { transform: translateY(0); }
          }

          @keyframes notification-slide-out {
            from { transform: translateY(0); }
            to { transform: translateY(calc(100% + 16px + env(safe-area-inset-bottom))); }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .notification,
          .notification[data-closing="true"] {
            animation: none;
          }
        }
      `}</style>
    </>
  )

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <div className="screen-reader-only" role="status" aria-atomic="true">
        {current && current.status !== 'error' && <span key={current.id}>{current.message}</span>}
      </div>
      <div className="screen-reader-only" role="alert" aria-atomic="true">
        {current?.status === 'error' && <span key={current.id}>{current.message}</span>}
      </div>
      {dialog ? createPortal(region, dialog) : region}
      <style jsx>{`
        .screen-reader-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </NotificationContext.Provider>
  )
}
