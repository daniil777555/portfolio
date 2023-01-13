export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss'
  ],

  imports: {
    dirs: ['store']
  },

  css: [
    '@/assets/scss/main.scss'
  ],

  tailwindcss: {
    // cssPath: '~/assets/scss/tailwind.css'
    configPath: 'tailwind.config.js'
  }
})
