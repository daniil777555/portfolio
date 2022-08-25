import React, { useContext } from 'react'
import { SnackBarContext } from '../context/snack-bar'

export function SnackBarAlert() {
  const { text, withError } = useContext(SnackBarContext)

  return (
    <>
      <span
        className={
          'font-bold mr-2 text-base ' +
          (withError ? 'text-red-600' : 'text-green-600')
        }>
        {text}
      </span>
    </>
  )
}
