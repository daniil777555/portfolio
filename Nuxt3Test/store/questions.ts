import { defineStore } from 'pinia'
import { IQA } from '~~/types/IQA'

export const useQuestionsStore = defineStore('QuestionStore', () => {
  const qas = ref<IQA[]>([])

  const getQAById = (id: string) => qas.value.find(el => el.id === id)
  const addQA = (qa: IQA) => qas.value.unshift(qa)
  const deleteQA = (id: string) => (qas.value = qas.value.filter(el => el.id !== id))
  const clear = () => (qas.value = [])

  return {
    qas,
    getQAById,
    addQA,
    deleteQA,
    clear
  }
})
