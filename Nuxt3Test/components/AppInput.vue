<template>
  <input
    :value="props.value"
    type="text"
    :placeholder="placeholder"
    class="input border-2 border-slate-50 rounded-md text-base py-1 px-2"
    @input="onInput"
    @keypress.enter="$emit('keypress.enter', $event)"
  >
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
    required: true
  },

  placeholder: {
    type: String,
    default: '',
    required: false
  }
})
const emit = defineEmits(['update:value', 'keypress.enter'])

const { onInput } = useInput(emit)

</script>

<style lang="scss" scoped>
@import '~/assets/scss/vars.scss';
.input {
  background-color: $color-input;
  outline: none;
}
</style>
