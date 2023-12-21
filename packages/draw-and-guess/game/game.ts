import * as PIXI from 'pixi.js'
import { update as tweenUpdate } from '@tweenjs/tween.js'
import { RoomCreate, RoomJoin, GamePlay, GameEnd } from './scenes'
import type { Platform } from './interface'
import type { WaitingRoom, PlayingRoom, PrizeGivingRoom, Player } from '~/interfaces'
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
    this.app.ticker.add(() => {
      tweenUpdate()
    })
  }

  async start () {
    const room = await this.platform.getRoom()
    if (!room) {
      this.initCreateRoomScene()
    }
    else {
      this.changeToRoomScene(room)
    }
  }

  private changeToRoomScene (room: WaitingRoom | PlayingRoom | PrizeGivingRoom) {
    if (room.state === 'waiting') {
      this.initJoinRoomScene(room)
    }
    else if (room.state === 'playing') {
      this.initPlayGameScene(room)
    }
    else if (room.state === 'prizing') {
      this.initEndGameScene(room)
    }
    else {
      throw new Error(`Invalid room ${room}`)
    }
  }

  private initCreateRoomScene () {
    const roomCreate = new RoomCreate(this.app)
    roomCreate.on(RoomCreate.Events.CREATED, async (event) => {
      const res = await $fetch('/api/room/create', {
        body: { event, player: this.platform.getUser() },
        method: 'POST'
      })
      this.initJoinRoomScene(res.room as WaitingRoom)
    })
  }

  private initJoinRoomScene (room: WaitingRoom) {
    const { platform } = this
    const io = platform.getIo()
    const user = platform.getUser()

    const roomJoin = new RoomJoin(this.app, room)

    io.emit(SocketEvents.ROOM_JOIN, room, user)
    io.on(SocketEvents.PLAYER_JOIN, (data) => {
      console.log(SocketEvents.PLAYER_JOIN, data)
      roomJoin.playerAvatarList.setPlayers(data.playerList)
    })
    io.on(SocketEvents.PLAYER_LEAVE, (data) => {
      console.log(SocketEvents.PLAYER_LEAVE, data)
      roomJoin.playerAvatarList.setPlayers(data.playerList)
    })
    io.on(SocketEvents.ROOM_STATE_CHANGE, (room: WaitingRoom | PlayingRoom | PrizeGivingRoom) => {
      console.log(SocketEvents.ROOM_STATE_CHANGE, room)
      this.changeToRoomScene(room)
    })

    roomJoin.on(RoomJoin.Events.GAME_START, () => {
      io.emit(SocketEvents.ROOM_PLAYER_GAME_START, room, user)
    })
    roomJoin.on(RoomJoin.Events.INIVITE_PLAYER, () => {
      // TODO: Add invite player logic.
      const url = `${location.origin}?roomId=${room.id}`
      console.log(url)
    })
    roomJoin.on(RoomJoin.Events.EXIT_ROOM, () => {
      io.emit(SocketEvents.ROOM_LEAVE, room, user)
    })
  }

  private initPlayGameScene (room: PlayingRoom) {
    const { platform } = this
    const io = platform.getIo()
    const user = platform.getUser()

    const gamePlay = new GamePlay(this.app, room)

    io.emit(SocketEvents.ROOM_JOIN, room, user)
    io.on(SocketEvents.PLAYER_MESSAGE, (player: Player, data) => {
      console.log(SocketEvents.PLAYER_MESSAGE, player, data)
      gamePlay.gamePlayLayout.danmaku.createNewDanmaku(data.message)
    })

    gamePlay.on(GamePlay.Events.SEND_MESSAGE, (data) => {
      io.emit(SocketEvents.ROOM_MESSAGE, room, user, data)
    })
    gamePlay.on(GamePlay.Events.ASK_FOR_TEAM, () => {
      // TODO
    })
  }

  private initEndGameScene (room: PrizeGivingRoom) {
    const gameEnd = new GameEnd(this.app)
    gameEnd.on(GameEnd.Events.PLAY_AGAIN, () => {
      // TODO: Add play again logic.
    })
    gameEnd.on(GameEnd.Events.SHARE, () => {
      // TODO: Add share logic.
    })
  }
}
