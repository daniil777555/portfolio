import { ICanvasState, ICanvasLine } from '~~/types/ICanvasState'

const state: ICanvasState = reactive({
  color: '#000',
  strokeWidth: 1,
  lines: [],
  fillColor: '#fff',
  canvas: undefined,
  width: 150,
  height: 150
})

export const useCanvasState = () => {
  const setColor = (color: string) => (state.color = color)
  const setFillColor = (color: string) => (state.fillColor = color)
  const setStrokeWidth = (width: number) => (state.strokeWidth = width)
  const addLinesArr = () => state.lines.push([])
  const pushLine = (line: ICanvasLine) => state.lines[state.lines.length - 1].push(line)
  const popLinesArr = () => state.lines.pop()
  const setCanvas = (canvas: HTMLCanvasElement) => (state.canvas = canvas)
  const setSize = (width: number, height: number) => {
    state.width = width
    state.height = height
    state.canvas!.width = width
    state.canvas!.height = height
  }

  return {
    state,
    setColor,
    setFillColor,
    setStrokeWidth,
    addLinesArr,
    pushLine,
    popLinesArr,
    setCanvas,
    setSize
  }
}
