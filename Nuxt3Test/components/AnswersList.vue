<template>
  <div class="al">
    <AppButton v-if="answers.length" class="ml-auto mr-0 block" @click="onCLear">
      Clear
    </AppButton>
    <TransitionGroup name="list">
      <AnswerItem
        v-for="answer in answers"
        :key="answer.id"
        :answer="answer"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { IQA } from '~~/types/IQA'

const questionsStore = useQuestionsStore()

const answers = computed<IQA[]>(() => questionsStore.qas)

function onCLear() {
  questionsStore.clear()
}
</script>

<style lang="scss" scoped>

</style>
