export interface ICanvasLine {
  x: number,
  y: number,
  color: string,
  strokeWidth: number
}

export interface ICanvasState {
  color: string,
  fillColor: string,
  strokeWidth: number,
  lines: Array<ICanvasLine[]>,
  canvas?: HTMLCanvasElement,
  width: number
  height: number
}
