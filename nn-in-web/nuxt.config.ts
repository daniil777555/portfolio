// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'SolvesAI',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
        // { hid: 'og:url', property: 'og:url', content: 'https://solves.pro/' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'og:title', property: 'og:title', content: 'SolvesAI' },
        { hid: 'og:image', property: 'og:image', content: '/logo.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo.png' }
      ],

    }
  },

  css: ['~/assets/main.scss'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite: {
    define: {
      'window.global': {}
    }
  },
})
