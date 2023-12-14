// https://nuxt.com/docs/api/configuration/nuxt-config
import wasm from 'vite-plugin-wasm'

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  runtimeConfig: {
    TURSO: {
      URL: process.env.TURSO_URL || 'MOCK_URL',
      TOKEN: process.env.TURSO_TOKEN || 'MOCK_TOKEN'
    }
  },
  plugins: ['~/plugins/socket.client'],
  nitro: {
    entry: process.env.NODE_ENV === 'production' ? undefined : '../preset/entry.dev',
    preset: './preset',
    esbuild: {
      options: { target: 'es2022' }
    }
  },
  vite: {
    build: {
      target: ['chrome89', 'edge89', 'firefox89', 'safari15', 'es2022']
    },
    plugins: [wasm()]
  }
})
