import React, {createContext, useState} from 'react'
import { ISnackBar } from '../types/ISnackBar'


export const SnackBarContext = createContext<ISnackBar>({
  visibility: false,
  open: () => {},
  close: () => {}
})

export const SnackBarState = ({ children }: {children:  React.ReactNode }) => {
  const [visibility, setVisibility] = useState(false)

  const open = () => setVisibility(true)
  const close = () => setVisibility(false)

  return (
    <SnackBarContext.Provider value={{ visibility, open, close }}>
      { children }
    </SnackBarContext.Provider>
  )
}