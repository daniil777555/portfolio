import axios from 'axios'

export async function getTodos(page: number) {
  return await axios.get(`https://jsonplaceholder.typicode.com/todos?userId=${page}`)
}