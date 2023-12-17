import type { Application } from 'pixi.js'
import { SpriteButtonGroup } from '../widgets/sprite-button-group'
import { GameThemeInput } from '../widgets/game-theme-input'
import { RoomTitle } from '../widgets/room-title'
import { RoomLayout } from '../widgets/room-layout'
import { Scene } from './scene'

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
    })
    return gameThemeInput
  }

  private createButtons () {
    const buttonGroup = new SpriteButtonGroup()
    const [button1, button2] = buttonGroup.setButton({ text: '生成题目' }, { text: '随机生成' })
    button1.button.onPress.connect(() => {
      this.emit(RoomCreate.Events.CREATED, {
        gameThemeType: 'custom',
        inputValue: this.inputValue
      })
    })
    button2.button.onPress.connect(() => {
      this.emit(RoomCreate.Events.CREATED, {
        gameThemeType: 'random',
        inputValue: this.inputValue
      })
    })
    return buttonGroup
  }
}
