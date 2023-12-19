import type { Application } from 'pixi.js'
import { Graphics } from 'pixi.js'
import { GamePlayHeader } from '../widgets/game-play-header'
import { PlayerAvatarList } from '../widgets/game-play-player-avatar-list'
import { Widget } from '../widgets/widget'
import { Scene } from './scene'
/**
 * The Scene for creating a new room.
 */
export class GamePlay extends Scene {
  static Events = {
    GAME_END: 'game-end'
  }

  private playerAvatarList: PlayerAvatarList

  constructor (app: Application) {
    super(app)

    const gamePlayHeader = new GamePlayHeader()
    gamePlayHeader.answer.setAnswer('test')

    const playerAvatarList = new PlayerAvatarList()
    playerAvatarList.setPlayers([{ avatar: '', name: '' }])
    this.playerAvatarList = playerAvatarList

    const layout = new GamePlayLayout({ header: gamePlayHeader, playerAvatarList })

    this.addChild(layout)
  }

  // TODO: Add methods for updating the game state.
}

class GamePlayLayout extends Widget {
  background: Graphics
  header: GamePlayHeader
  playerAvatarList: PlayerAvatarList
  constructor (opts: { header: GamePlayHeader, playerAvatarList: PlayerAvatarList }) {
    super()
    const { header, playerAvatarList } = opts
    this.background = new Graphics()
    this.header = header
    this.playerAvatarList = playerAvatarList
    this.view.addChild(this.background)
    this.addChild(header, playerAvatarList)
  }

  layout (): void {
    const { header, background, playerAvatarList, view } = this

    background.clear()
    background.beginFill(0xAAAAAA).drawRect(0, 0, view.parent.width, view.parent.height)

    playerAvatarList.view.position.set(0, background.height - playerAvatarList.view.height)
  }
}
