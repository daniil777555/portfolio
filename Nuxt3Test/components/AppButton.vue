<template>
  <button
    class="btn border-2 border-slate-50 rounded-md text-base py-1 px-2 outline-none"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineEmits(['click'])
</script>

<style lang="scss" scoped>
@import '~/assets/scss/vars.scss';

.btn {
  background-color: $color-btn;
  transition: .35s;
  font-weight: 700;

  @media (hover: hover) {
    &:hover {
      border-color: $color-btn;
      background: rgb(248 250 252);
      color: $color-btn;
      box-shadow: rgba(0, 0, 0, 0.65) 1.95px 1.95px 2.6px;
    }
  }
}
</style>
