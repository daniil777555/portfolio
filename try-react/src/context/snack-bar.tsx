import React, { createContext, useState, useRef } from 'react'
import { ISnackBar } from '../types/ISnackBar'
import { ISnackBarEnum } from '../types/ISnackBarEnum'

export const SnackBarContext = createContext<ISnackBar>({
  visibility: false,
  childType: null,
  text: '',
  withError: false,
  timed: false,
  time: 1000,
  setComponentType: (childType: ISnackBarEnum) => {},
  open: () => {},
  close: () => {},
  setText: (str: string) => {},
  setTimed: (val: boolean) => {},
  setTime: (timeNum: number) => {},
  setWithError: (val: boolean) => {}
})

export const SnackBarState = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [visibility, setVisibility] = useState(false)
  const [childType, setChildType] = useState<ISnackBarEnum | null>(null)
  const text = useRef('')
  const withError = useRef(false)
  const timed = useRef(false)
  const time = useRef(1000)

  const open = () => setVisibility(true)
  const close = () => setVisibility(false)
  const setComponentType = (childType: ISnackBarEnum) => setChildType(childType)
  const setText = (str: string) => (text.current = str)
  const setTimed = (val: boolean) => (timed.current = val)
  const setTime = (timeNum: number) => (time.current = timeNum)
  const setWithError = (val: boolean) => (withError.current = val)

  return (
    <SnackBarContext.Provider
      value={{
        visibility,
        childType,
        text: text.current,
        withError: withError.current,
        time: time.current,
        timed: timed.current,
        setComponentType,
        open,
        close,
        setText,
        setTimed,
        setTime,
        setWithError
      }}>
      {children}
    </SnackBarContext.Provider>
  )
}
