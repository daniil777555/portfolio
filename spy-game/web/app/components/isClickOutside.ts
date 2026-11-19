import type { MouseEvent } from 'react'

export function isClickOutside(event: MouseEvent<HTMLElement>) {
  if (event.target !== event.currentTarget) return false
  const bounds = event.currentTarget.getBoundingClientRect()
  return (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
}
