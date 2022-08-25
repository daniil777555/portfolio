import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit'
import { ITodo } from '../types/ITodo'
import { ITodoState } from '../types/ITodoState'
import { distinct } from '../utils/arrays'
import { getTodos } from '../utils/queries'

const initialState: ITodoState = {
  todos: [],
  hasMore: true,
  initialFetchRejected: false,
  loading: true,
  page: 1,
}

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (page: number) => {
    const response = await getTodos(page)
    if (response?.data) {
      return response.data
    }
    return []
  }
)

const reducers = {
  setTodos: (state: ITodoState, action: PayloadAction<ITodo[]>) => {
    state.todos = distinct([...state.todos, ...action.payload])
  },
  pushTodo: (state: ITodoState, action: PayloadAction<ITodo>) => {
    state.todos.unshift(action.payload)
  },
  initialFetchWasRejected: (state: ITodoState) => {
    state.initialFetchRejected = true
  },
  incrementPage: (state: ITodoState) => {
    state.page++
  },
  changeCoplition: (
    state: ITodoState,
    action: PayloadAction<{ id: string | number; value: boolean }>
  ) => {
    state.todos = state.todos.map(
      (todo) =>
        (todo.id === action.payload.id && {
          ...todo,
          completed: action.payload.value
        }) ||
        todo
    )
  }
}

const extraReducers = (
  builder: ActionReducerMapBuilder<ITodoState>
) => {
  builder
    .addCase(fetchTodos.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchTodos.fulfilled, (state, action) => {
      if (!action.payload.length) {
        state.hasMore = false
      }
      state.todos = distinct([...state.todos, ...action.payload])
      state.loading = false
    })
    .addCase(fetchTodos.rejected, (state) => {
      state.loading = false
    })
}

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers,
  extraReducers
})

export const todosActions = todosSlice.actions
export default todosSlice.reducer
