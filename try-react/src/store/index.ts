import { Action, configureStore } from '@reduxjs/toolkit'
import thunk, { ThunkAction } from 'redux-thunk'
import todosReducer  from './todos'

export const store = configureStore({
  reducer: {
    todos: todosReducer
  },
  middleware: 
    getDefaultMiddleware => getDefaultMiddleware().concat(thunk)
  
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
