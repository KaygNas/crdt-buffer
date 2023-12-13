<script lang='ts' setup>
import type { Socket } from 'socket.io-client'

import { Game } from '~/game'
import { debuglog } from '~/utils/debug'
definePageMeta({ layout: 'default' })

const { $io } : { $io: Socket} = useNuxtApp()

const canvasRef = ref<HTMLCanvasElement>()
onMounted(() => {
  const canvasElement = canvasRef.value!
  const parentHeight = canvasElement.parentElement!.clientHeight
  const parentWidth = canvasElement.parentElement!.clientWidth
  const game = new Game({
    createCanvasElement: () => canvasElement,
    getSize: () => ({
      width: Math.min(375, parentWidth),
      height: parentHeight
    }),
    getLatency: () => 2000,
    getUuid: () => String(Math.random()),
    getIo: () => $io
  })
  game.start()
  if ($io) {
    $io.on('paint', (msg) => {
      debuglog('paint', msg)
    })
    $io.on('join', (msg) => {
      debuglog('join', msg)
    })
    $io.on('leave', (msg) => {
      debuglog('leave', msg)
    })
  }
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
