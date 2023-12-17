import type { Application, Container } from 'pixi.js'
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

    const layout = new RoomLayout({
      parent: this,
      width: app.view.width,
      height: app.view.height
    })

    const title = this.createTitle(layout)
    const input = this.createGameThemeInput(layout)
    const buttons = this.createButtons(layout)

    layout.layout(title, input, buttons)
  }

  private createTitle (parent: Container) {
    const title = new RoomTitle({ parent, text: '你们画我们猜' })
    return title
  }

  private createGameThemeInput (parent: Container) {
    const gameThemeInput = new GameThemeInput({ parent })
    gameThemeInput.input.on('change', (value: string) => {
      this.inputValue = value
    })
    return gameThemeInput
  }

  private createButtons (parent: Container) {
    const buttonGroup = new SpriteButtonGroup({ parent })
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
