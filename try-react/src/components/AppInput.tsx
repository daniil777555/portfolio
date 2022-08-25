import React from 'react'

interface IProps {
  setText: (val: string) => void,
  validate: Function,
  error: string,
  model: string
}

export function AppInput({ setText, validate, error, model }: IProps) {
  return (
    <div>
      <input
        type="text"
        value={model}
        className='w-full text-slate-700 font-medium mx-auto block max-w-md py-1 px-2 rounded-md cursor-pointer outline-none'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setText(e.target.value)
        }
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => validate(e.target.value.trim())}
      />
      {
        error &&
        <p className='text-red-600 font-semibold text-xs'>
          { error }
        </p>
      }
    </div>
  )
}
