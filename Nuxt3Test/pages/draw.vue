<template>
  <div class="draw pb-5 h-full flex flex-col">
    <div class="mb-4 flex gap-1">
      <div class="flex items-center mr-3">
        <span class="mr-2">Color: </span>
        <div v-click-outside="() => (showPicker = false)" class="relative">
          <div
            class="draw__color-block cursor-pointer"
            :style="'background:' + color + ';'"
            @click="showPicker = !showPicker"
          />
          <Transition name="fade">
            <Chrome
              v-show="showPicker"
              v-model="color"
              class="absolute top-full left-0 mt-1"
            />
          </Transition>
        </div>
      </div>
      <div class="flex items-center">
        <span class="mr-2">Stroke width: </span>
        <input v-model="strokeWidth" type="range" min="1" max="35" step="1">
      </div>
      <div
        class="draw__fill ml-3"
        :class="{'draw__fill--selected': fillSelected}"
        @click="fillSelected = !fillSelected"
      >
        <img src="/images/fill-color.svg" class="draw__icon" alt="">
      </div>
      <AppButton class="ml-4" @click="clean">
        Clean
      </AppButton>
      <AppButton class="ml-4" @click="downloadPic">
        Download
      </AppButton>
    </div>
    <AppCanvas class="flex-grow" @click="onCanvasClick" />
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { Chrome } from '@ckpack/vue-color'

const { state: canvasState, setColor, setStrokeWidth, setFillColor } = useCanvasState()
const fillSelected = ref(false)
const showPicker = ref(false)

const color = computed({
  get() {
    return canvasState.color
  },
  set(color: any) {
    setColor(color.hex)
  }
})

const strokeWidth = computed({
  get() {
    return canvasState.strokeWidth
  },
  set(width: number) {
    setStrokeWidth(Number(width))
  }
})

function onCanvasClick() {
  if (fillSelected.value) {
    const { onFillCanvas } = useCanvas()
    setFillColor(color.value)
    onFillCanvas()
  }
}

function clean() {
  const { onFillCanvas } = useCanvas()
  setFillColor('#fff')
  onFillCanvas()
}

function downloadPic() {
  if (!canvasState.canvas) {
    return
  }

  let image!: File
  canvasState.canvas.toBlob((blob) => {
    if (blob) {
      image = new File([blob], 'my picture', {
        type: 'image/jpeg'
      })
      const url = window.URL.createObjectURL(image)
      const link = document.createElement('a')
      document.body.appendChild(link) // Firefox requires the link to be in the body :(
      link.href = url
      link.download = 'my-drawing.jpeg'
      link.click()
      document.body.removeChild(link)
      // window.open(url)
    }
  }, 'image/jpeg', 1)
}

</script>

<style lang="scss" scoped>
.draw {
  height: calc(100vh - 96px);

  &__color-block {
    width: 25px;
    height: 25px;
    border-radius: 5px;
  }

  &__fill {
    padding: 5px;
    transition: .35s;
    cursor: pointer;

    &--selected {
      background-color: rgb(85, 85, 85);
      border-radius: 6px;
    }
  }

  &__icon {
    width: 24px;
    height: 24px;
  }
}
</style>
