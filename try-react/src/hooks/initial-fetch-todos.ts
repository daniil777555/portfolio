import { useEffect } from 'react'
import { fetchTodos } from '../store/todos'
import { useActions, useAppDispatch, useAppSelector } from './store-hooks'

export function useInitialFetchTodos() {
  const { todos, page } = useAppSelector(state => state.todos)
  const { initialFetchWasRejected } = useActions()
  const dispatch = useAppDispatch()
  const doFetch = async () => await dispatch(fetchTodos(page)).then(res => {
    if (res.meta.requestStatus === 'rejected') {
      initialFetchWasRejected()
    }
  })

  useEffect(() => {
    if (!todos.length) doFetch()
  }, [])
}