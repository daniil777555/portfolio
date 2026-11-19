'use client'

import type { ComponentPropsWithoutRef } from 'react'
import LoadingWheel from './LoadingWheel'

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: 'filled' | 'outlined'
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'danger'
  loading?: boolean
}

export default function Button({
  variant = 'filled',
  size = 'medium',
  color = 'primary',
  loading = false,
  type = 'button',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <>
      <button
        {...props}
        type={type}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={['button', color, variant, size, className]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={loading ? 'opacity-0' : undefined}>{children}</span>
        {loading && (
          <>
            <span className="loading-wheel"><LoadingWheel /></span>
            <span className="sr-only" role="status">Loading</span>
          </>
        )}
      </button>
      <style jsx>{`
        .button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: 1px solid var(--button-color);
          border-radius: 8px;
          font: inherit;
          font-weight: 650;
          line-height: 1.25;
          text-align: center;
          cursor: pointer;
          transition: background-color 180ms ease, border-color 180ms ease,
            color 180ms ease;
        }

        .loading-wheel {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          inset: 0;
        }

        .primary {
          --button-color: var(--accent);
          --button-filled-text-color: var(--background);
        }

        .danger {
          --button-color: #ef5968;
          --button-filled-text-color: #fff;
        }

        .small {
          min-height: 36px;
          padding: 0.45rem 0.8rem;
          font-size: 0.8rem;
        }

        .medium {
          min-height: 44px;
          padding: 0.65rem 1.1rem;
          font-size: 0.9rem;
        }

        .large {
          min-height: 52px;
          padding: 0.85rem 1.4rem;
          font-size: 1rem;
        }

        .filled {
          background-color: var(--button-color);
          color: var(--button-filled-text-color);
        }

        .outlined {
          background-color: transparent;
          color: var(--button-color);
        }

        .filled:not(:disabled):hover {
          background-color: color-mix(in srgb, var(--button-color), white 12%);
          border-color: color-mix(in srgb, var(--button-color), white 12%);
        }

        .outlined:not(:disabled):hover {
          background-color: color-mix(in srgb, var(--button-color) 12%, transparent);
        }

        .button:focus-visible {
          outline: 2px solid var(--button-color);
          outline-offset: 3px;
        }

        .button:disabled {
          cursor: not-allowed;
        }

        .button:disabled:not([aria-busy="true"]) {
          opacity: 0.5;
        }

        @media (prefers-reduced-motion: reduce) {
          .button {
            transition: none;
          }
        }
      `}</style>
    </>
  )
}
