import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import type { RootState, AppDispatch } from '../store/index'
import { todosActions } from '../store/todos'

const actions = {
  ...todosActions
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(actions, dispatch)
}