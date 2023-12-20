import type { Application } from 'pixi.js'
import { Graphics } from 'pixi.js'
import { GamePlayHeader } from '../widgets/game-play-header'
import { PlayerAvatarList } from '../widgets/game-play-player-avatar-list'
import { Widget } from '../widgets/widget'
import { GamePlayToolBox, MessageInput } from '../widgets/game-play-toolbox'
import { GamePlayPaintBoard } from '../widgets/game-play-paint-board'
import { Scene } from './scene'

class GamePlayLayout extends Widget {
  background: Graphics
  header: GamePlayHeader
  paintBoard: GamePlayPaintBoard
  toolBox: GamePlayToolBox
  playerAvatarList: PlayerAvatarList

  constructor (opts: { header: GamePlayHeader, toolBox: GamePlayToolBox, paintBoard: GamePlayPaintBoard, playerAvatarList: PlayerAvatarList }) {
    super()

    this.background = new Graphics()
    this.view.addChild(this.background)

    const { header, paintBoard, toolBox, playerAvatarList } = opts
    this.header = header
    this.paintBoard = paintBoard
    this.toolBox = toolBox
    this.playerAvatarList = playerAvatarList
    this.addChild(header, paintBoard, toolBox, playerAvatarList)
  }

  layout (): void {
    const { header, background, paintBoard, toolBox, playerAvatarList, view } = this

    background.clear()
    background.beginFill(0xAAAAAA).drawRect(0, 0, view.parent.width, view.parent.height)
    playerAvatarList.view.position.set(0, background.height - playerAvatarList.view.height)
    toolBox.view.position.set(0, playerAvatarList.view.position.y - toolBox.view.height)
    paintBoard.view.mask = new Graphics().beginFill(0xFFFFFF)
      .drawRect(
        0,
        header.view.height,
        background.width,
        background.height - header.view.height - toolBox.view.height - playerAvatarList.view.height
      )
  }
}

/**
 * The Scene for creating a new room.
 */
export class GamePlay extends Scene {
  static Events = {
    GAME_END: 'game-end'
  }

  private gamePlayLayout: GamePlayLayout

  constructor (app: Application) {
    super(app)

    const header = new GamePlayHeader()
    header.answer.setAnswer('test')

    const paintBoard = new GamePlayPaintBoard()
    const toolBox = new GamePlayToolBox()
    const playerAvatarList = new PlayerAvatarList()

    playerAvatarList.setPlayers([{ avatar: '', name: '' }])

    const layout = new GamePlayLayout({ header, paintBoard, toolBox, playerAvatarList })
    this.gamePlayLayout = layout

    this.addChild(layout)
    this.listenEvents()
  }

  private listenEvents (): void {
    const { gamePlayLayout } = this
    gamePlayLayout.toolBox.messageInput.on(MessageInput.Events.SEND_MESSAGE, ({ message }) => {
      console.log('send message', message)
    })
    gamePlayLayout.toolBox.messageInput.on(MessageInput.Events.ASK_FOR_TEAM, () => {
      console.log('ask for team')
    })
  }

  // TODO: Add methods for updating the game state.
}
