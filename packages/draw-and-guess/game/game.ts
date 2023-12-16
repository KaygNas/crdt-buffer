import * as PIXI from 'pixi.js'
import { RoomCreate, RoomJoin, GamePlay, GameEnd } from './scenes'
import type { Platform } from './interface'
export class Game {
  private app: PIXI.Application
  constructor (platform: Platform) {
    const canvas = platform.getCanvas()
    const size = platform.getSize()
    this.app = new PIXI.Application({
      backgroundColor: 0xFFFFFF,
      view: canvas,
      width: size.width,
      height: size.height
    })
  }

  start () {
    this.initCreateRoomScene()
  }

  private initCreateRoomScene () {
    const roomCreate = new RoomCreate(this.app)
    roomCreate.on(RoomCreate.Events.CREATED, () => {
      this.initJoinRoomScene()
    })
  }

  private initJoinRoomScene () {
    const roomJoin = new RoomJoin(this.app)
    roomJoin.on(RoomJoin.Events.GAME_START, () => {
      this.initPlayGameScene()
    })
    roomJoin.on(RoomJoin.Events.INIVITE_PLAYER, () => {
      // TODO: Add invite player logic.
    })
    roomJoin.on(RoomJoin.Events.EXIT_ROOM, () => {
      this.initCreateRoomScene()
    })
  }

  private initPlayGameScene () {
    const gamePlay = new GamePlay(this.app)
    gamePlay.on(GamePlay.Events.GAME_END, () => {
      this.initEndGameScene()
    })
  }

  private initEndGameScene () {
    const gameEnd = new GameEnd(this.app)
    gameEnd.on(GameEnd.Events.PLAY_AGAIN, () => {
      this.initJoinRoomScene()
    })
    gameEnd.on(GameEnd.Events.SHARE, () => {
      // TODO: Add share logic.
    })
  }
}
