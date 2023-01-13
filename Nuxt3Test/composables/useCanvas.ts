let isMouseDown = false

const coords = {
  x: 0,
  y: 0
}

const { state, addLinesArr, pushLine, setCanvas } = useCanvasState()

function fillCanvas(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = state.fillColor
  ctx.fillRect(0, 0, state.width, state.height)
}

function findPosition(e: MouseEvent | TouchEvent) {
  const me = e as MouseEvent
  const te = e as TouchEvent
  const x = me.clientX || te.touches[0].clientX
  const y = me.clientY || te.touches[0].clientY

  coords.x = x - state.canvas!.offsetLeft
  coords.y = y - state.canvas!.offsetTop

  pushLine({
    ...coords,
    color: state.color,
    strokeWidth: state.strokeWidth
  })
}

function draw(e: MouseEvent | TouchEvent, ctx: CanvasRenderingContext2D) {
  ctx.beginPath()
  ctx.strokeStyle = state.color
  ctx.lineWidth = state.strokeWidth
  ctx.lineCap = 'round'
  ctx.moveTo(coords.x, coords.y)
  findPosition(e)
  ctx.lineTo(coords.x, coords.y)
  ctx.stroke()
  ctx.closePath()
}

function redraw(ctx: CanvasRenderingContext2D) {
  state.lines.forEach((el) => {
    el.forEach((data, i) => {
      if ((el.length - 1) > (i + 1)) {
        ctx.beginPath()
        ctx.strokeStyle = data.color
        ctx.lineWidth = data.strokeWidth
        ctx.lineCap = 'round'
        ctx.moveTo(data.x, data.y)
        ctx.lineTo(el[i + 1].x, el[i + 1].y)
        ctx.stroke()
        ctx.closePath()
      }
    })
  })
}

export function useCanvas() {
  const ctx = state.canvas!.getContext('2d')

  if (ctx) {
    fillCanvas(ctx)
  }

  const onMouseDown = (e: MouseEvent | TouchEvent) => {
    isMouseDown = true
    addLinesArr()
    findPosition(e)
    if (ctx) {
      ctx.beginPath()
      ctx.fillStyle = state.color
      const radius = state.strokeWidth - (state.strokeWidth * 0.5)
      ctx.arc(coords.x, coords.y, radius, 0, 2 * Math.PI)
      ctx.fill()
      ctx.closePath()
    }
  }

  const onMouseUp = () => {
    isMouseDown = false
    setCanvas(state.canvas!)
  }

  const onMouseMove = (e: MouseEvent | TouchEvent) => {
    if (ctx && isMouseDown) {
      draw(e, ctx)
    }
  }

  const onFillCanvas = () => {
    fillCanvas(ctx!)
  }

  const redrawPic = () => redraw(ctx!)

  const removeListeners = () => {
    state.canvas!.removeEventListener('mousedown', onMouseDown, false)
    state.canvas!.removeEventListener('mouseup', onMouseUp, false)
    state.canvas!.removeEventListener('mousemove', onMouseMove, false)
    state.canvas!.removeEventListener('touchstart', onMouseDown, false)
    state.canvas!.removeEventListener('touchend', onMouseUp, false)
    state.canvas!.removeEventListener('touchmove', onMouseMove, false)
  }

  state.canvas!.addEventListener('mousedown', onMouseDown, false)
  state.canvas!.addEventListener('mouseup', onMouseUp, false)
  state.canvas!.addEventListener('mousemove', onMouseMove, false)
  state.canvas!.addEventListener('touchstart', onMouseDown, false)
  state.canvas!.addEventListener('touchend', onMouseUp, false)
  state.canvas!.addEventListener('touchmove', onMouseMove, false)

  return {
    ctx,
    redrawPic,
    fillCanvas,
    onFillCanvas,
    removeListeners
  }
}
