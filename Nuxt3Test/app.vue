<template>
  <div class="app">
    <NuxtLayout>
      <AppHeader />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss" scoped>
@import '~/assets/scss/vars.scss';
.app {
  max-width: 768px;
  margin: 0 auto;
  padding: 0 10px;
  min-height: 100vh;
}
</style>
