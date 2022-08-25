import { ISnackBarEnum } from './ISnackBarEnum'

export interface ISnackBar {
  visibility: boolean
  childType: ISnackBarEnum | null
  text: string
  withError: boolean
  timed: boolean
  time: number
  open: () => void
  close: () => void
  setComponentType: (childType: ISnackBarEnum) => void
  setText: (str: string) => void
  setTimed: (val: boolean) => void
  setTime: (timeNum: number) => void
  setWithError: (val: boolean) => void
}