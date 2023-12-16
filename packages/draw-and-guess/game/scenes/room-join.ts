import type * as PIXI from 'pixi.js'
import { Scene } from './scene'
/**
 * The Scene for creating a new room.
 */
export class RoomJoin extends Scene {
  static Events = {
    GAME_START: 'game-start',
    INIVITE_PLAYER: 'invite-player',
    EXIT_ROOM: 'exit-room'
  }

  constructor (app: PIXI.Application) {
    super(app)
    this.init()
  }

  init () {

  }

  updatePlayerList () {}
}
