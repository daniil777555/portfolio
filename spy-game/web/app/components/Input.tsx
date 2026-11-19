import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type InputProps = ComponentPropsWithoutRef<'input'> & {
  id: string
  label?: string
  error?: string
  action?: ReactNode
}

export default function Input({
  id,
  label,
  error,
  action,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: InputProps) {
  const errorId = `${id}-error`
  return (
    <>
      {label && <label htmlFor={id}>{label}</label>}
      <div className={action ? 'input-container with-action' : 'input-container'}>
        <input
          id={id}
          {...props}
          aria-invalid={error ? true : invalid}
          aria-describedby={[describedBy, error && errorId].filter(Boolean).join(' ') || undefined}
        />
        {action && <div className="input-action">{action}</div>}
      </div>
      <div className="error-space">
        {error && <p id={errorId} role="alert">{error}</p>}
      </div>
      <style jsx>{`
        label {
          display: block;
          margin-bottom: 8px;
          font-size: 0.9rem;
          font-weight: 650;
        }

        input {
          width: 100%;
          min-height: 46px;
          padding: 10px 12px;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--background);
          color: var(--foreground);
          font: inherit;
        }

        input::placeholder {
          color: #74869d;
        }

        input:focus-visible {
          outline: 2px solid var(--accent);
          outline-offset: 3px;
        }

        .with-action {
          display: flex;
          align-items: center;
          border: 1px solid var(--border);
          border-radius: 8px;
          background: var(--background);
        }

        .with-action input {
          min-width: 0;
          border: 0;
          background: transparent;
        }

        .input-action {
          flex: none;
          margin: 4px;
        }

        .error-space {
          height: 2.65rem;
          padding-top: 0.25rem;
          overflow-y: auto;
        }

        .error-space p {
          margin: 0;
          color: #ffb4ab;
          font-size: 0.85rem;
          line-height: 1.2rem;
        }
      `}</style>
    </>
  )
}
