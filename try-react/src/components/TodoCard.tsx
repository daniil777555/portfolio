import React from 'react'
import { useActions } from '../hooks/store-hooks'
import { ITodo } from '../types/ITodo'

interface IProps {
  todo: ITodo,
  classList?: string
}

export function TodoCard({ todo, classList }: IProps) {
  const { changeCoplition } = useActions()
  const classes = 'px-5 py-5 max-w-md bg-slate-700 w-full shadow-md shadow-gray-600 rounded-xl ' + (classList ?? '')

  const onChangeComplition = () => changeCoplition({
    id: todo.id,
    value: !todo.completed
  })  

  return (
    <div className={classes}>
      <h3 className="text-xl mb-3 break-words">{todo.title}</h3>
      <div className="flex">
        <label htmlFor="checkboxInput" className="text-sm select-none mr-2">
          Complited
        </label>
        <input
          type="checkbox"
          name="checkboxInput"
          id="checkboxInput"
          checked={todo.completed}
          onChange={onChangeComplition}
        />
      </div>
    </div>
  )
}
