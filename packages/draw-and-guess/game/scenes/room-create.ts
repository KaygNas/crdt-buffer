import type { Application } from 'pixi.js'
import { Graphics, Text, Container } from 'pixi.js'
import { Button, Input } from '@pixi/ui'
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

    const PADDING = 24
    const view = this.createView({
      width: app.view.width - PADDING * 2,
      height: app.view.height - PADDING * 2
    })
    view.position.set(24, 24)

    const container = new Container()
    container.position.set(0, 124)

    const title = this.createTitle(view)

    const input = this.createInput(view)
    input.position.set(0, title.position.y + title.height + 24)

    const buttons = this.createButtons(view)
    buttons.position.set(0, input.position.y + input.height + 24)

    container.addChild(title, input, buttons)
    view.addChild(container)
    this.addChild(view)
  }

  private createView (opts:{width: number, height: number}) {
    const { width, height } = opts
    const view = new Graphics().beginFill(0xFFFFFF).drawRect(0, 0, width, height)
    return view
  }

  private createTitle (parent: Container) {
    const title = new Text('你们画我们猜')
    title.anchor.set(0.5)
    title.position.set(parent.width / 2, 0)
    return title
  }

  private createInput (parent: Container) {
    const container = new Container()
    const label = new Text('画作主题：', { fontSize: 18 })
    const input = new Input({
      bg: new Graphics().beginFill(0xEEEEEE).drawRect(0, 0, parent.width, 48),
      padding: 24,
      align: 'left',
      placeholder: '请描述画作主题',
      textStyle: {
        fill: 0xAAAAAA
      }
    })
    input.position.set(0, 32)

    input.onChange.connect(() => {
      this.inputValue = input.value
    })

    container.addChild(label, input)
    return container
  }

  private createButtons (parent: Container) {
    const container = new Container()
    const BUTTON_GAP = 24
    const width = (parent.width - BUTTON_GAP) / 2
    const button1 = this.createButton({ text: '生成题目', width })
    const button2 = this.createButton({ text: '随机生成', width })
    button2.view.position.set(button1.view.width + BUTTON_GAP, 0)

    button1.onPress.connect(() => {
      this.emit(RoomCreate.Events.CREATED, {
        gameThemeType: 'custom',
        inputValue: this.inputValue
      })
    })
    button2.onPress.connect(() => {
      this.emit(RoomCreate.Events.CREATED, {
        gameThemeType: 'random',
        inputValue: this.inputValue
      })
    })

    container.addChild(button1.view, button2.view)
    return container
  }

  private createButton (opts: {text: string, width: number}) {
    const width = opts.width
    const height = 48
    const radius = 8

    const buttonView = new Graphics().beginFill(0xEEEEEE).drawRoundedRect(0, 0, width, height, radius)
    const text = new Text(opts.text, { fontSize: 18 })
    text.anchor.set(0.5)
    text.x = buttonView.width / 2
    text.y = buttonView.height / 2
    buttonView.addChild(text)
    const button = new Button(buttonView)
    return button
  }
}
