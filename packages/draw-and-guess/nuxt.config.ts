// https://nuxt.com/docs/api/configuration/nuxt-config
import wasm from 'vite-plugin-wasm'

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [],
  vite: {
    plugins: [wasm()]
  }
})