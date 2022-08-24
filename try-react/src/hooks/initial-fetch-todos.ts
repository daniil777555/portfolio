import { useEffect } from 'react'
import { fetchTodos } from '../store/todos'
import { useAppDispatch, useAppSelector } from './store-hooks'


export function useInitialFetchTodos() {
  const { todos: storeTodos } = useAppSelector(state => state.todos)
  const dispatch = useAppDispatch()
  const doFetch = async () => await dispatch(fetchTodos(1))

  useEffect(() => {
    if (!storeTodos.length) doFetch()
  })
}