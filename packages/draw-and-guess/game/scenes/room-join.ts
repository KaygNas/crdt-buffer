import type { Application } from 'pixi.js'
import { SpriteButtonGroup } from '../widgets/sprite-button-group'
import { GameThemeInput } from '../widgets/game-theme-input'
import { RoomTitle } from '../widgets/room-title'
import { RoomLayout } from '../widgets/room-layout'
import { LoadingProgressBar } from '../widgets/loading-progress-bar'
import { PlayerAvatarList } from '../widgets/player-avatar-list'
import { Scene } from './scene'
import type { Player, Room } from '~/interfaces'

/**
 * The Scene for creating a new room.
 */
export class RoomJoin extends Scene {
  static Events = {
    GAME_START: 'game-start',
    INIVITE_PLAYER: 'invite-player',
    EXIT_ROOM: 'exit-room'
  }

  room: Room
  playerList: Player[]
  roomLayout: RoomLayout
  roomTitle: RoomTitle
  gameThemeInput: GameThemeInput
  loadingProgressBar: LoadingProgressBar
  playerAvatarList: PlayerAvatarList
  buttonGroup: SpriteButtonGroup

  constructor (app: Application, room: Room) {
    super(app)

    this.room = room
    this.playerList = []

    this.roomLayout = new RoomLayout()
    this.roomTitle = this.createTitle()
    this.gameThemeInput = this.createGameThemeInput()
    this.loadingProgressBar = this.createProgressBar()
    this.playerAvatarList = this.createAvatarList()
    this.buttonGroup = this.createButtons()
    this.roomLayout.addChild(this.roomTitle, this.gameThemeInput, this.loadingProgressBar, this.playerAvatarList, this.buttonGroup)
    this.addChild(this.roomLayout)
  }

  private createTitle () {
    const title = new RoomTitle({ text: this.room.name })
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
}
