import React, { useCallback } from 'react'
import { useActions, useAppDispatch, useAppSelector } from '../hooks/store-hooks'
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
  const { hasMore, initialFetchRejected } = useAppSelector(state => state.todos)
  const { incrementPage } = useActions()
  let iterator = 0
  const dispatch = useAppDispatch()
  const className = 'flex flex-col items-center mx-auto ' + (classes ?? '')

  const paginate =  useCallback(async () => {
    if (store.getState().todos.loading) return

    iterator++
    incrementPage()
    await dispatch(fetchTodos(store.getState().todos.page))
    
    
  }, [incrementPage, iterator,  dispatch])

  return (
    <div className={className}>
      { 
        (!!todos.length) && 
        todos.map(todo => <TodoCard todo={todo} key={todo.id} classList={'mb-5'}/>)
      }
      { 
        (!!todos.length && hasMore && !initialFetchRejected) && 
        <Paginator page={iterator} observed={paginate}/>
      }
    </div>
  )
}
