'use client'

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type Ref
} from 'react'
import { isClickOutside } from './isClickOutside'

export type DialogHandle = {
  close: () => void
}

type DialogProps = {
  kicker?: string
  onClose: () => void
  closeDisabled?: boolean
  children: ReactNode
  ref?: Ref<DialogHandle>
} & (
  | { 'aria-label': string, 'aria-labelledby'?: never }
  | { 'aria-label'?: never, 'aria-labelledby': string }
)

export default function Dialog({
  kicker,
  onClose,
  closeDisabled = false,
  children,
  ref,
  ...label
}: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closingRef = useRef(false)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.showModal()
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
      document.body.style.overflow = previousOverflow
    }
  }, [])

  function finishClosing() {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = null
    dialogRef.current?.close()
  }

  function closeDialog() {
    if (closingRef.current) return
    closingRef.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClosing()
      return
    }
    setClosing(true)
    closeTimer.current = setTimeout(finishClosing, 250)
  }

  function requestClose() {
    if (!closeDisabled) closeDialog()
  }

  useImperativeHandle(ref, () => ({ close: closeDialog }))

  return (
    <dialog
      ref={dialogRef}
      {...label}
      data-closing={closing}
      onClose={onClose}
      onClick={(event) => {
        if (isClickOutside(event)) requestClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation()
          event.preventDefault()
          requestClose()
        }
      }}
      onCancel={(event) => {
        event.preventDefault()
        requestClose()
      }}
      onTransitionEnd={(event) => {
        if (closing && event.target === event.currentTarget && event.propertyName === 'opacity') {
          finishClosing()
        }
      }}
    >
      <div className="dialog-content" inert={closing}>
        <div className="dialog-header">
          {kicker && <p className="kicker">{kicker}</p>}
          <button
            className="close"
            type="button"
            aria-label="Close"
            disabled={closeDisabled || closing}
            onClick={requestClose}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
      <style jsx>{`
        dialog {
          position: fixed;
          inset: 0;
          width: min(440px, calc(100% - 36px));
          max-height: calc(100% - 36px);
          margin: auto;
          padding: 0;
          border: 1px solid var(--border);
          border-radius: 18px;
          background: var(--panel);
          color: var(--foreground);
          box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
          opacity: 1;
          transform: translateY(0);
          transition: opacity 180ms ease, transform 180ms ease;
        }

        dialog::backdrop {
          background: rgba(3, 10, 20, 0.8);
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          opacity: 1;
          transition: opacity 180ms ease;
        }

        dialog[data-closing="true"] {
          opacity: 0;
          transform: translateY(8px);
        }

        dialog[data-closing="true"]::backdrop {
          opacity: 0;
        }

        @starting-style {
          dialog[open] {
            opacity: 0;
            transform: translateY(8px);
          }

          dialog[open]::backdrop {
            opacity: 0;
          }
        }

        .dialog-content {
          padding: 30px;
          text-align: left;
        }

        .dialog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
        }

        .kicker {
          margin: 0;
          color: var(--accent);
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .close {
          margin-left: auto;
          padding: 0 4px;
          border: 0;
          background: transparent;
          color: var(--muted);
          font: inherit;
          font-size: 1.8rem;
          line-height: 1;
          cursor: pointer;
        }

        .close:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .close:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
        }

        @media (max-width: 600px) {
          .dialog-content {
            padding: 24px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          dialog, dialog::backdrop {
            transition: none;
          }
        }
      `}</style>
    </dialog>
  )
}
