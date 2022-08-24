import React from 'react'
import { IComplition } from '../types/IComplition'

interface IProps {
  setSelection: (str: string) => void
}

export function FilterTodos({ setSelection }: IProps) {
  const changeSelection = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelection(e.target.value)
  }

  return (
    <select
      className="text-slate-700 font-medium mx-auto block max-w-md w-full py-1 rounded-md cursor-pointer outline-none"
      name="filter"
      onChange={changeSelection}
      defaultValue={IComplition.ALL}
    >
      <option
        className="cursor-pointer text-slate-700 font-medium"
        value={IComplition.ALL}
      >
        All
      </option>
      <option
        className="cursor-pointer text-slate-700 font-medium"
        value={IComplition.NOT_COMPLETED}>
        Not completed
      </option>
      <option
        className="cursor-pointer text-slate-700 font-medium"
        value={IComplition.COMPLETED}>
        Completed
      </option>
    </select>
  )
}
