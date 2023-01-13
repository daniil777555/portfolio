<template>
  <div class="index">
    <div class="index__input-block">
      <AppInput
        v-model:value="question"
        placeholder="Type your question"
        class="w-full mb-5"
        @keypress.enter="fetchAnswer"
      />
      <AppButton class="mx-auto block" @click="fetchAnswer">
        Get answer
      </AppButton>
    </div>
    <p v-if="errorShown" class="index__err text-xs text-red-600 text-center mt-2">
      {{ err }}
    </p>
    <Transition name="fade">
      <div v-if="answer" class="my-6">
        <p class="text-center text-2xl font-black">
          The answer is {{ answer }}
        </p>
      </div>
    </Transition>
    <AnswersList />
  </div>
</template>

<script setup lang="ts">
const question = ref('')
let prevQ = ''
const answer = ref('')
const err = ref('')
const errorShown = ref(false)
const questionsStore = useQuestionsStore()

questionsStore.$subscribe((_mutation, state) => {
  if (state.qas.length === 0) {
    answer.value = ''
    prevQ = ''
  }
})

async function fetchAnswer() {
  if (!question.value) {
    err.value = 'Need the question'
    errorShown.value = true
    return
  }

  if (answer.value) {
    questionsStore.addQA({
      id: Date.now().toString(),
      q: prevQ,
      a: answer.value
    })
  }

  prevQ = question.value
  errorShown.value = false
  question.value = ''
  answer.value = ''

  const { a, error, showErr } = await useFetchAnswer()

  answer.value = a
  err.value = error
  errorShown.value = showErr
}
</script>

<style lang="scss" scoped>
.index {
  &__input-block {
    max-width: 368px;
    margin: 0 auto;
  }
}
</style>
