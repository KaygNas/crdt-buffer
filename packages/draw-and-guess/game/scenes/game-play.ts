import type * as PIXI from 'pixi.js'
import { Scene } from './scene'
/**
 * The Scene for creating a new room.
 */
export class GamePlay extends Scene {
  static Events = {
    GAME_END: 'game-end'
  }

  constructor (app: PIXI.Application) {
    super(app)
    this.init()
  }

  init () {

  }
  // TODO: Add methods for updating the game state.
}
