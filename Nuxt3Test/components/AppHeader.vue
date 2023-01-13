<template>
  <header class="header flex justify-end pt-5 pb-10 gap-2">
    <NuxtLink to="/" class="header__item px-2 py-1 text-lg font-bold underline rounded-md">
      Questions
    </NuxtLink>
    <NuxtLink to="/draw" class="header__item px-2 py-1 text-lg font-bold underline rounded-md">
      Draw
    </NuxtLink>
  </header>
</template>

<script setup lang="ts">

</script>

<style lang="scss" scoped>
@import '~/assets/scss/vars.scss';

.header {
  &__item {
    transition: .35s;

    @media (hover: hover) {
      &:hover {
        background: rgb(248 250 252);
        color: $color-btn;
        box-shadow: rgba(0, 0, 0, 0.65) 1.95px 1.95px 2.6px;
      }
    }
  }
}
</style>
