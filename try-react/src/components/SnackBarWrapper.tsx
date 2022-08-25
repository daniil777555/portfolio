import React, { useContext, useEffect } from 'react'
import { SnackBarContext } from '../context/snack-bar'

interface IProps {
  children: React.ReactNode
}

export function SnackBarWrapper({ children }: IProps) {
  const { visibility, timed, time, close, setWithError, setTimed } =
    useContext(SnackBarContext)

  useEffect(() => {
    if (visibility && timed) setTimeout(() => {
      close()
      setWithError(false)
      setTimed(false)
    }, time)
  })

  return (
    <div className="bottom-5 left-0 fixed px-5 w-full">
      <div className="mx-auto max-w-md flex bg-gray-900 items-center justify-between px-3 py-3 rounded-md shadow-md shadow-slate-500">
        {children}
      </div>
    </div>
  )
}
