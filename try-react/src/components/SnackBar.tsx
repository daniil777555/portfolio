import React, { useContext, useEffect } from 'react'
import { SnackBarContext } from '../context/snack-bar'

interface IProps {
  text: string,
  withError: boolean,
  time?: number
}

export function SnackBar({ text, withError, time = 1000 }: IProps) {
  const { visibility ,close } = useContext(SnackBarContext)

  useEffect(() => {
    if (visibility) setTimeout(() => close(), time)
  })
  return (
    <div className='fixed flex justify-between bg-inherit shadow-sm shadow-slate-100'>
      <span className='font-semibold mr-2 text-sm'> { text } </span>
      { withError && <svg className='fill-red-600 w-6 h-6'>
        <use href='../assets/svg/cross.svg'></use>
      </svg> }
      { !withError && <svg className='fill-green-600 w-6 h-6'>
        <use href='../assets/svg/check.svg'></use>
      </svg> }
    </div>  
  )
}
