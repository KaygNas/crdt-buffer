import { defineNuxtModule, createResolver } from '@nuxt/kit'
import * as vite from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const resolver = createResolver(import.meta.url)
const entryResolver = createResolver(resolver.resolve('../../wx-mini-game'))
const outputResolver = createResolver(resolver.resolve('../../dist/wx-mini-game'))
const gameModuleEntry = entryResolver.resolve('game.ts')
const gameModuleOutput = outputResolver.resolve('')
export default defineNuxtModule({
  meta: {
    name: 'wx-mini-game-packer'
  },
  hooks: {
  },
  setup (_, nuxt) {
    const catpureViteConfig = () => {
      return new Promise<vite.UserConfig>((resolve) => {
        nuxt.hook('vite:configResolved', (config, env) => {
          if (env.isClient) {
            resolve(config)
          }
        })
      })
    }
    const viteConfig = catpureViteConfig()

    const buildWxMiniGame = async () => {
      // eslint-disable-next-line no-console
      console.log('building wx-mini-game')

      const config = await viteConfig
      await vite.build({
        ...config,
        logLevel: 'warn',
        build: {
          target: config.build?.target,
          rollupOptions: {
            input: gameModuleEntry,
            output: {
              dir: gameModuleOutput,
              format: 'es',
              entryFileNames: '[name].js',
              manualChunks: (id) => {
                if (id.includes('wx-mini-game')) {
                  return 'game'
                }
                else {
                  return 'vendor'
                }
              }
            }
          },
          minify: false
        },
        plugins: [
          ...config.plugins!,
          viteStaticCopy({
            targets: [
              { src: entryResolver.resolve('*.json'), dest: gameModuleOutput }
            ]
          })
        ]
      })
    }

    nuxt.hook('close', () => {
      buildWxMiniGame()
    })
  }
})
