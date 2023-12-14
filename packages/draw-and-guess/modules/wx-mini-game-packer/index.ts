import { defineNuxtModule, addVitePlugin } from '@nuxt/kit'
import type { OutputOptions } from 'rollup'
interface WxMiniGamePackerOptions {
  entry: string;
}

export default defineNuxtModule<WxMiniGamePackerOptions>({
  meta: {
    name: 'wx-mini-game-packer'
  },
  setup () {
    // compile an extra output for wx mini game
    addVitePlugin(() => {
      return {
        name: 'wx-mini-game-packer',
        apply: 'build',
        async buildEnd () {
          const gameModuleId = Array.from(this.getModuleIds()).find(id => id.endsWith('game/index.ts'))!
          const gameModuleInfo = this.getModuleInfo(gameModuleId)!
          const collectAllImportedModules = (moduleId: string, result: string[] = []) => {
            const moduleInfo = this.getModuleInfo(moduleId)!
            result.push(moduleId)
            moduleInfo.importedIds.forEach((importedModuleId) => {
              if (!result.includes(importedModuleId)) {
                collectAllImportedModules(importedModuleId, result)
              }
            })
            return result
          }
          const emitAllImportedModules = (moduleIds: string[]) => {
            moduleIds.forEach((moduleId) => {
              const moduleInfo = this.getModuleInfo(moduleId)!
              this.emitFile({
                id: moduleInfo.id,
                type: 'chunk'
              })
            })
          }
          const allImportedModules = collectAllImportedModules(gameModuleId)

          emitAllImportedModules(allImportedModules)

          console.log('gameModuleIds', gameModuleId)
          console.log('gameModuleInfo', gameModuleInfo)
          console.log('gameModuleInfo.importedModules', allImportedModules)
        }
      }
    })
  }
})
