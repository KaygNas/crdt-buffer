import type { Application, Container } from 'pixi.js'
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

    const layout = new RoomLayout({
      parent: this,
      width: app.view.width,
      height: app.view.height
    })

    const title = this.createTitle(layout)
    const input = this.createGameThemeInput(layout)
    const progressBar = this.createProgressBar(layout)
    const playerAvatarList = this.createPlayerAvatarList(layout)
    const buttons = this.createButtons(layout)

    layout.layout(title, input, progressBar, playerAvatarList.view, buttons)
  }

  private createTitle (parent: Container) {
    const title = new RoomTitle({ parent, text: 'XXX房间' })
    return title
  }

  private createGameThemeInput (parent: Container) {
    const gameThemeInput = new GameThemeInput({ parent })
    return gameThemeInput
  }

  private createProgressBar (parent: Container) {
    const progressBar = new LoadingProgressBar({ parent })
    return progressBar
  }

  private createPlayerAvatarList (parent: Container) {
    const list = new PlayerAvatarList({})
    parent.addChild(list.view)
    return list
  }

  private createButtons (parent: Container) {
    const buttonGroup = new SpriteButtonGroup({ parent })
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
