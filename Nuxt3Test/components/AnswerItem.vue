<template>
  <div class="ai p-2">
    <p class="ai__title">
      Your question:
    </p>
    <p class="ai__text mb-3">
      {{ props.answer.q }}
    </p>
    <p class="ai__title">
      Your answer:
    </p>
    <p class="ai__text">
      {{ props.answer.a }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { IQA } from '~~/types/IQA'

const props = defineProps<{
  answer: IQA
}>()
</script>

<style lang="scss" scoped>
.ai {
  border-bottom: 1px solid rgb(248 250 252);

  &__title {
    font-weight: 700;
    font-size: 12px;
  }

  &__text {
    font-weight: 400;
    font-size: 16px;
  }
}
</style>
