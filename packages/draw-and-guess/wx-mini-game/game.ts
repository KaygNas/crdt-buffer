/// <reference path="../node_modules/minigame-api-typings/index.d.ts" />

// @ts-ignore
import io from 'weapp.socket.io'
import { Game, type Platform } from '~/game'
import { generateRandom } from '~/utils/random'

const main = () => {
  const canvas = wx.createCanvas() as unknown as HTMLCanvasElement
  const systemInfo = wx.getSystemInfoSync()

  const platform: Platform = {
    createCanvasElement: () => canvas,
    getSize: () => ({
      width: Math.min(375, systemInfo.windowWidth),
      height: systemInfo.screenHeight
    }),
    getIo: () => {
      console.log('io', io)
      return io('http://localhost:3000')
    },
    getUser: () => ({
      id: generateRandom(8),
      name: generateRandom(4)
    }),
    getRoom: () => ({
      id: '1', // TODO
      name: 'test'
    })
  }
  const game = new Game(platform)
  game.start()
}

main()
