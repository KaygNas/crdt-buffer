import type * as PIXI from 'pixi.js'
import { GamePlayHeader } from '../widgets/game-play-header'
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
    const gamePlayHeader = new GamePlayHeader()

    gamePlayHeader.answer.setAnswer('test')

    this.addChild(gamePlayHeader)
  }

  // TODO: Add methods for updating the game state.
}
