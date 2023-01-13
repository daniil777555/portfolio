<template>
  <div ref="wrapper" class="">
    <canvas ref="canvasBlock" class="canvas" @click="$emit('click')" />
  </div>
</template>

<script setup lang="ts">
defineEmits(['click'])
const canvasBlock = ref<HTMLCanvasElement | null>(null)
const wrapper = ref<HTMLDivElement | null>(null)
const { state: canvasState, setCanvas, setSize } = useCanvasState()

onMounted(() => {
  setCanvas(canvasBlock.value as HTMLCanvasElement)
  setSize(wrapper.value!.clientWidth, wrapper.value!.clientHeight)
  const { redrawPic } = useCanvas()

  if (canvasState.lines.length) {
    redrawPic()
  }
})

onBeforeUnmount(() => {
  const { removeListeners } = useCanvas()
  removeListeners()
})
</script>

<style lang="scss" scoped>
.canvas {
  cursor: crosshair;
  user-select: none;
}
</style>
