import type { Application } from 'pixi.js'
import { SpriteButtonGroup } from '../widgets/sprite-button-group'
import { GameThemeInput } from '../widgets/game-theme-input'
import { RoomTitle } from '../widgets/room-title'
import { RoomLayout } from '../widgets/room-layout'
import { Scene } from './scene'

export interface RoomCreateEvent {
  themeType: 'custom' | 'random',
  theme: string
}

/**
 * The Scene for creating a new room.
 */
export class RoomCreate extends Scene {
  static Events = {
    CREATED: 'created'
  }

  inputValue: string = ''

  constructor (app: Application) {
    super(app)

    const layout = new RoomLayout()

    const title = this.createTitle()
    const input = this.createGameThemeInput()
    const buttons = this.createButtons()

    layout.addChild(title, input, buttons)

    this.addChild(layout)
  }

  private createTitle () {
    const title = new RoomTitle({ text: '你们画我们猜' })
    return title
  }

  private createGameThemeInput () {
    const gameThemeInput = new GameThemeInput()
    gameThemeInput.input.on('change', (value: string) => {
      this.inputValue = value
      console.log(this.inputValue)
    })
    return gameThemeInput
  }

  private createButtons () {
    const buttonGroup = new SpriteButtonGroup()
    const [button1, button2] = buttonGroup.setButton({ text: '生成题目' }, { text: '随机生成' })
    button1.button.onPress.connect(() => {
      const event: RoomCreateEvent = {
        themeType: 'custom',
        theme: this.inputValue
      }
      this.emit(RoomCreate.Events.CREATED, event)
    })
    button2.button.onPress.connect(() => {
      const event: RoomCreateEvent = {
        themeType: 'random',
        theme: ''
      }
      this.emit(RoomCreate.Events.CREATED, event)
    })
    return buttonGroup
  }
}
