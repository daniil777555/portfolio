import React, {useState, useEffect} from 'react'
import { FilterTodos } from '../components/FilterTodos'
import { TodoList } from '../components/TodoList'
import { useAppSelector } from '../hooks/store-hooks'
import { IComplition } from '../types/IComplition'

export function TodosPage() {
  const { todos: storeTodos } = useAppSelector(state => state.todos)
  const [todos, setTodos] = useState(storeTodos)
  const [selection, setSelection] = useState('all')

  useEffect(() => {
    const filterTodos = (val: boolean) => {
      return storeTodos.filter(todo => todo.completed === val)
    }

    if (selection === IComplition.ALL) setTodos(storeTodos)
    else if (selection === IComplition.COMPLETED) setTodos(filterTodos(true))
    else if (selection === IComplition.NOT_COMPLETED) setTodos(filterTodos(false))
  }, [selection, storeTodos])

  return (
    <div className='mt-5'>
      <FilterTodos setSelection={setSelection} />
      <TodoList todos={todos} classes="mt-5"/>
    </div>
  )
}
