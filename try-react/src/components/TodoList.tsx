import React, { useCallback } from 'react'
import { useInitialFetchTodos } from '../hooks/initial-fetch-todos'
import { useAppDispatch, useAppSelector } from '../hooks/store-hooks'
import { store } from '../store'
import { fetchTodos } from '../store/todos'
import { ITodo } from '../types/ITodo'
import { Paginator } from './Paginator'
import { TodoCard } from './TodoCard'

interface IProps {
  todos: ITodo[],
  classes?: string
}

export function TodoList({ todos, classes }: IProps) {
  const { hasMore } = useAppSelector(state => state.todos)
  let iterator = 0
  let loading = false
  let page = 1
  const dispatch = useAppDispatch()
  const className = 'flex flex-col content-center max-w-fit mx-auto ' + (classes ?? '')

  const paginate =  async () => {
    const hasMore = store.getState().todos.hasMore
    if (loading || !hasMore) return

    loading = true
    iterator++
    page++
    await dispatch(fetchTodos(page))
    loading = false
  }

  useInitialFetchTodos()
  return (
    <div className={className}>
      { 
        (!!todos.length) && 
        todos.map(todo => <TodoCard todo={todo} key={todo.id} classList={'mb-5'}/>)
      }
      { 
        (!!todos.length) && 
        <Paginator page={iterator} observed={paginate}/>
      }
      {
        (loading && !todos.length) &&
        'loading'
      }
      {
        (!loading && !todos.length) &&
        ' nothing'
      }
    </div>
  )
}
