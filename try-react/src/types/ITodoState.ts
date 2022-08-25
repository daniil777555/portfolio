import { ITodo } from './ITodo'

export interface ITodoState {
  todos: ITodo[],
  hasMore: boolean,
  initialFetchRejected: boolean,
  loading: boolean,
  page: number
}