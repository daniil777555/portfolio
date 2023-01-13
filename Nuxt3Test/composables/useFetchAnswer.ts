import { IAPIResponse } from '~~/types/IAPIResponse'

export async function useFetchAnswer() {
  let a = ''
  const error = 'Smth went wrong'
  let showErr = false

  try {
    const res = await useFetch<IAPIResponse>('https://yesno.wtf/api')
    if (res.data.value) {
      a = res.data.value.answer
    }
  } catch (e) {
    console.log(e)
    showErr = true
  }

  return { a, error, showErr }
}
