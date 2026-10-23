<template>
  <main class="main pt-20 px-4 pb-10">
    <h3 class="text-3xl font-bold mx-auto w-fit mb-6">
      Upload your image
    </h3>
    <div
      ref="inputArea"
      class="border-4 rounded-lg border-dashed mx-auto main__frame flex justify-center items-center cursor-pointer"
      @click="onInputClick"
      >
      <p class=" text-xl font-bold text-center">Put your image here</p>
      <input
        class="hidden"
        type="file"
        name="inputFile"
        id="input-file"
        ref="inputFile"
        accept="image/png, image/jpeg, image/jpg"
        @input="handleFiles"
      >
    </div>
    <div class="mx-auto w-fit mt-10 relative" ref="scrollToImage">
      <div v-if="loading && src" class="main__cover-block main__cover-block--loading">
        <img src="./images/loading.svg" alt="Loading" class="main__icon">
      </div>
      <div v-if="isDetected && !loading && src" class="main__cover-block main__cover-block--done">
        <img src="./images/check.svg" alt="Loading" class="main__icon-2">
        <p class="main__text main__text--green">
          Detected!
        </p>
      </div>
      <div v-if="!isDetected && !loading && src" class="main__cover-block main__cover-block--reject">
        <img src="./images/cross.svg" alt="Loading" class="main__icon-2">
        <p class="main__text main__text--red">
          Not detected!
        </p>
      </div>
      <img v-if="src" :src="src" alt="Image" class="main__image">
    </div>
  </main>
</template>

<script setup lang="ts">
import * as tf from '@tensorflow/tfjs'
import { timeout } from '~/utils/timeout'

class L2 {

  static className = 'L2';

  constructor(config: any) {
    return tf.regularizers.l1l2(config)
  }
}

// @ts-ignore
tf.serialization.registerClass(L2)

const inputFile = ref<HTMLInputElement>(null!)
const inputArea = ref<HTMLDivElement>(null!)
const scrollToImage = ref<HTMLDivElement>(null!)
const image = ref<File>(null!)
const src = ref<string>('')
const loading = ref<boolean>(false)
const isDetected = ref<boolean>(false)
let model: tf.LayersModel | null = null

watch(src, async () => {
  if (src.value) {
    loading.value = true
    await timeout(150)
    scrollToImg()
    const imageObj = new Image()
    imageObj.src = src.value
    imageObj.onload = async () => {
      if (model) {
        let tfImage = tf.browser.fromPixels(imageObj)
        tfImage = tf.image.resizeBilinear(tfImage, [256, 256])
        tfImage = tfImage.expandDims(0)
        const preds = model.predict(tfImage)
        // @ts-ignore
        const data = await preds.data()
        await timeout(500)
        isDetected.value = !!data[0]
        loading.value = false
      }
    }
  }
})

function onInputClick() {
  inputFile.value.click()
}

function preventDefaults(e: Event) {
  e.preventDefault()
  e.stopPropagation()
}

function setSrc() {
  src.value ?? URL.revokeObjectURL(src.value)

  if (image.value) {
    src.value = URL.createObjectURL(image.value)
  }
}

async function onDrop(e: DragEvent) {
  if (e.dataTransfer?.files.length) {
    if (e.dataTransfer.files.item(0)) {
      image.value = e.dataTransfer.files.item(0) as File
      setSrc()
    }
  }
}

function handleFiles(ev: Event) {
  const input = ev.target as HTMLInputElement
  if (!input.files) {
    return
  }

  if (input.files.item(0)) {
    image.value = input.files.item(0) as File
    setSrc()
  }
}

function scrollToImg() {
  scrollToImage.value.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
}

onMounted(async () => {
  model = await tf.loadLayersModel('./model/model.json')

  inputArea.value.addEventListener('drop', onDrop, false)
  inputArea.value.addEventListener('drop', preventDefaults, false)
  inputArea.value.addEventListener(
    'dragenter',
    preventDefaults,
    false
  )
  inputArea.value.addEventListener(
    'dragover',
    preventDefaults,
    false
  )
  inputArea.value.addEventListener(
    'dragleave',
    preventDefaults,
    false
  )
})

onBeforeUnmount(() => {
  inputArea.value.removeEventListener('drop', onDrop, false)
  inputArea.value.removeEventListener('drop', preventDefaults, false)
  inputArea.value.removeEventListener(
    'dragenter',
    preventDefaults,
    false
  )
  inputArea.value.removeEventListener(
    'dragover',
    preventDefaults,
    false
  )
  inputArea.value.removeEventListener(
    'dragleave',
    preventDefaults,
    false
  )
})

</script>

<style lang="scss" scoped>
@import '~/assets/vars.scss';

.main {
  min-height: 100vh;

  &__frame {
    border-color: $color-blue;
    width: clamp(268px, 40%, 668px);
    height: clamp(128px, 30%, 256px);
    aspect-ratio: 4 / 2;
  }

  &__image {
    max-width: 768px;
    max-height: 768px;
    width: 100%;
  }

  &__cover-block {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease-in-out;

    &--loading {
      backdrop-filter: blur(12px);
      background-color: rgba($color: #ffffff, $alpha: 0.4);
    }

    &--done {
      background-color: rgba($color: #62ff3a, $alpha: 0.4);
    }

    &--reject {
      background-color: rgba($color: #eb1c1c, $alpha: 0.4);
    }
  }

  &__text {
    font-size: 20px;
    font-weight: 600;
    text-align: center;

    &--green {
      color: #62ff3a;
    }

    &--red {
      color: #eb1c1c;
    }
  }

  &__icon {
    width: 64px;
    height: 64px;
  }

  &__icon-2 {
    width: 128px;
    height: 128px;
  }

  &__made-by-block {
    z-index: 10;
    backdrop-filter: blur(12px);
    background-color: rgba($color: $color-bg, $alpha: 0.4);
  }

  &__made-by {
    font-size: 14px;
    font-weight: 600;
    color: $color-blue;
  }
}
</style>
