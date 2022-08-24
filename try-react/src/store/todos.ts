import { ActionReducerMapBuilder, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ITodo } from '../types/ITodo'
import { ITodoState } from '../types/ITodoState'
import { distinct } from '../utils/arrays'
import { getTodos } from '../utils/queries/todos'

const initialState: ITodoState = {
  todos: [],
  hasMore: true
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
  setTodos: (
    state: ITodoState,
    action: PayloadAction<ITodo[]>
  ) => {
    state.todos = distinct([...state.todos, ...action.payload])
  },
  pushTodo: (
    state: ITodoState,
    action: PayloadAction<ITodo>
  ) => {
    state.todos.unshift(action.payload)
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

const extraReducers = (builder: ActionReducerMapBuilder<ITodoState>) => {
  builder
    .addCase(fetchTodos.fulfilled, (state, action) => {
      console.log(!action.payload.length, state.hasMore)
      if (!action.payload.length) {
        state.hasMore = false
        console.log(!action.payload.length, state.hasMore)
      }
      state.todos = distinct([...state.todos, ...action.payload]);
      console.log("hasMore", state.hasMore)
    })
    .addCase(fetchTodos.rejected, (state) => {
      
      // call alert
    });
}

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers,
  extraReducers
})

export const todosActions = todosSlice.actions
export default todosSlice.reducer
