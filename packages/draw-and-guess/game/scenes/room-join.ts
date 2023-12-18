import type { Application } from 'pixi.js'
import { SpriteButtonGroup } from '../widgets/sprite-button-group'
import { GameThemeInput } from '../widgets/game-theme-input'
import { RoomTitle } from '../widgets/room-title'
import { RoomLayout } from '../widgets/room-layout'
import { LoadingProgressBar } from '../widgets/loading-progress-bar'
import { PlayerAvatarList } from '../widgets/player-avatar-list'
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

  constructor (app: Application) {
    super(app)

    const layout = new RoomLayout()

    const title = this.createTitle()
    const input = this.createGameThemeInput()
    const progressBar = this.createProgressBar()
    const avatarList = this.createAvatarList()
    const buttons = this.createButtons()

    layout.addChild(title, input, progressBar, avatarList, buttons)

    this.addChild(layout)
  }

  private createTitle () {
    const title = new RoomTitle({ text: 'XXX房间' })
    return title
  }

  private createGameThemeInput () {
    const gameThemeInput = new GameThemeInput()
    return gameThemeInput
  }

  private createProgressBar () {
    const progressBar = new LoadingProgressBar()
    return progressBar
  }

  private createAvatarList () {
    const avatarList = new PlayerAvatarList()
    return avatarList
  }

  private createButtons () {
    const buttonGroup = new SpriteButtonGroup()
    const [button1, button2] = buttonGroup.setButton({ text: '开始游戏' }, { text: '邀请好友' })
    button1.button.onPress.connect(() => {
      this.emit(RoomJoin.Events.GAME_START)
    })
    button2.button.onPress.connect(() => {
      this.emit(RoomJoin.Events.INIVITE_PLAYER)
    })
    return buttonGroup
  }

  updatePlayerList () {}
}
