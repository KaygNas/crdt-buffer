import type * as PIXI from 'pixi.js'
import { Scene } from './scene'
/**
 * The Scene for creating a new room.
 */
export class GameEnd extends Scene {
  static Events = {
    PLAY_AGAIN: 'play-again',
    SHARE: 'share'
  }

  constructor (app: PIXI.Application) {
    super(app)
    this.init()
  }

  init () {

  }

  setRanking () {}
}
