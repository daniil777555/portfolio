export function useInput(emit: Function) {
  const onInput = (e: Event) => {
    const target = e.target as HTMLInputElement

    emit('update:value', target.value)
  }

  return { onInput }
}
