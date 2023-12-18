<script lang='ts' setup>
import { io } from 'socket.io-client'
import type { Platform } from '~/game'
import { Game } from '~/game'
import { generateRandom } from '~/utils'

definePageMeta({ layout: 'default' })

const canvasRef = ref<HTMLCanvasElement>()
onMounted(() => {
  const canvasElement = canvasRef.value!
  const parentHeight = canvasElement.parentElement!.clientHeight
  const parentWidth = canvasElement.parentElement!.clientWidth
  const route = useRoute()
  const platform: Platform = {
    getCanvas: () => canvasElement,
    getSize: () => ({
      width: Math.min(375, parentWidth),
      height: parentHeight
    }),
    getIo: () => io(),
    getUser: () => ({
      id: crypto.randomUUID().replaceAll('-', ''),
      name: generateRandom(4)
    }),
    getRoom: async () => {
      const { room } = await $fetch('/api/room/id', { params: { roomId: route.query.roomId } })
      return room
    }
  }
  const game = new Game(platform)
  game.start()
})
</script>

<template>
  <div class="game-wrapper">
    <canvas ref="canvasRef" class="game" />
  </div>
</template>

<style scoped>
.game-wrapper {
  min-width: calc(100vw - 16px);
  min-height: calc(100vh - 28px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.game {
  border: 6px solid #000;
  border-radius: 18px;
}
</style>
