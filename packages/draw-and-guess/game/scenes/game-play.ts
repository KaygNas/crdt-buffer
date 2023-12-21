import type { Application } from 'pixi.js'
import { Graphics } from 'pixi.js'
import { GamePlayHeader } from '../widgets/game-play-header'
import { PlayerAvatarList } from '../widgets/game-play-player-avatar-list'
import { Widget } from '../widgets/widget'
import { GamePlayToolBox, MessageInput } from '../widgets/game-play-toolbox'
import { GamePlayPaintBoard } from '../widgets/game-play-paint-board'
import { Danmaku } from '../widgets/game-play-danmaku'
import { Scene } from './scene'
import type { PlayingRoom } from '~/interfaces'

class GamePlayLayout extends Widget {
  background: Graphics
  header: GamePlayHeader
  paintBoard: GamePlayPaintBoard
  toolBox: GamePlayToolBox
  playerAvatarList: PlayerAvatarList
  danmaku: Danmaku

  constructor (opts: { header: GamePlayHeader, toolBox: GamePlayToolBox, paintBoard: GamePlayPaintBoard, playerAvatarList: PlayerAvatarList, danmaku: Danmaku }) {
    super()

    this.background = new Graphics()
    this.view.addChild(this.background)

    const { header, paintBoard, toolBox, playerAvatarList, danmaku } = opts
    this.header = header
    this.paintBoard = paintBoard
    this.toolBox = toolBox
    this.playerAvatarList = playerAvatarList
    this.danmaku = danmaku
    this.addChild(header, paintBoard, toolBox, playerAvatarList, danmaku)
  }

  layout (): void {
    const { header, background, paintBoard, toolBox, playerAvatarList, danmaku, view } = this

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
    danmaku.view.position.set(0, header.view.height)
  }
}

/**
 * The Scene for creating a new room.
 */
export class GamePlay extends Scene {
  static Events = {
    SEND_MESSAGE: 'send-message',
    ASK_FOR_TEAM: 'ask-for-team'
  }

  gamePlayLayout: GamePlayLayout

  constructor (app: Application, room: PlayingRoom) {
    super(app)

    const header = new GamePlayHeader()
    const paintBoard = new GamePlayPaintBoard()
    const toolBox = new GamePlayToolBox()
    const playerAvatarList = new PlayerAvatarList()
    const danmaku = new Danmaku()

    const layout = new GamePlayLayout({ header, paintBoard, toolBox, playerAvatarList, danmaku })
    this.gamePlayLayout = layout

    header.timer.setTimer(room.currentGameRound.totalTime)
    header.answer.setAnswer(room.currentGameRound.answer)
    playerAvatarList.setPlayers(room.players)

    this.addChild(layout)
    this.listenEvents()
  }

  private listenEvents (): void {
    const { gamePlayLayout } = this
    gamePlayLayout.toolBox.messageInput.on(MessageInput.Events.SEND_MESSAGE, ({ message }) => {
      console.log('send message', message)
      this.emit(GamePlay.Events.SEND_MESSAGE, { message })
    })
    gamePlayLayout.toolBox.messageInput.on(MessageInput.Events.ASK_FOR_TEAM, () => {
      console.log('ask for team')
      this.emit(GamePlay.Events.ASK_FOR_TEAM)
    })
  }

  // TODO: Add methods for updating the game state.
}
