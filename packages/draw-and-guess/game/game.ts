import * as PIXI from 'pixi.js'
import { RoomCreate, RoomJoin, GamePlay, GameEnd } from './scenes'
import type { Platform } from './interface'
import type { Room } from '~/interfaces'
import * as SocketEvents from '~/constants/socket-events'
export class Game {
  private app: PIXI.Application
  private platform: Platform
  constructor (platform: Platform) {
    this.platform = platform
    const canvas = platform.getCanvas()
    const size = platform.getSize()
    this.app = new PIXI.Application({
      backgroundColor: 0xFFFFFF,
      view: canvas,
      width: size.width,
      height: size.height
    })
  }

  async start () {
    const room = await this.platform.getRoom()
    if (room) {
      this.initJoinRoomScene(room)
    }
    else {
      this.initCreateRoomScene()
    }
  }

  private initCreateRoomScene () {
    const roomCreate = new RoomCreate(this.app)
    roomCreate.on(RoomCreate.Events.CREATED, async (event) => {
      const res = await $fetch('/api/room/create', {
        body: { event, player: this.platform.getUser() },
        method: 'POST'
      })
      this.initJoinRoomScene(res.room)
    })
  }

  private initJoinRoomScene (room: Room) {
    const { platform } = this
    const io = platform.getIo()
    const user = platform.getUser()

    const roomJoin = new RoomJoin(this.app, room)
    roomJoin.on(RoomJoin.Events.GAME_START, () => {
      this.initPlayGameScene()
    })
    roomJoin.on(RoomJoin.Events.INIVITE_PLAYER, () => {
      // TODO: Add invite player logic.
      const url = `${location.origin}?roomId=${room.id}`
      console.log(url)
    })
    roomJoin.on(RoomJoin.Events.EXIT_ROOM, () => {
      this.initCreateRoomScene()
    })

    io.emit(SocketEvents.JOIN_ROOM, room, user)
    io.on(SocketEvents.PLAYER_JOIN, (data) => {
      roomJoin.playerList = data.playerList
      roomJoin.playerAvatarList.setPlayers(data.playerList)
      console.log(data)
    })
    io.on(SocketEvents.PLAYER_LEAVE, (data) => {
      roomJoin.playerList = data.playerList
      roomJoin.playerAvatarList.setPlayers(data.playerList)
      console.log(data)
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
