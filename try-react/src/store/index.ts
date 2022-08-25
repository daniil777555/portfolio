import { Action, configureStore } from '@reduxjs/toolkit'
import thunk, { ThunkAction } from 'redux-thunk'
import todosReducer  from './todos'
import { usersAPI } from './users.api'

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    [usersAPI.reducerPath]: usersAPI.reducer
  },
  middleware: 
    getDefaultMiddleware => getDefaultMiddleware().concat(usersAPI.middleware, thunk)
  
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
