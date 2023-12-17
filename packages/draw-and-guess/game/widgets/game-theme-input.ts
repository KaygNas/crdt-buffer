import { Text, Graphics } from 'pixi.js'
import { Input } from '@pixi/ui'
import { Widget } from './widget'

export class GameThemeInput extends Widget {
  label: Text
  input: Input
  inputBackground: Graphics

  constructor () {
    super()

    const label = new Text('画作主题：', { fontSize: 18 })
    this.label = label

    const inputBackground = new Graphics().beginFill(0xEEEEEE).drawRect(0, 0, 200, 48)
    this.inputBackground = inputBackground

    const input = new Input({
      bg: inputBackground,
      padding: 24,
      align: 'left',
      placeholder: '请描述画作主题',
      textStyle: { fill: 0xAAAAAA }
    })
    this.input = input

    this.view.addChild(label, input)
  }

  layout (): void {
    const { input, label, inputBackground, view } = this
    const { parent } = view

    if (!parent) {
      return
    }

    inputBackground.clear()
    inputBackground.beginFill(0xEEEEEE).drawRect(0, 0, parent.width, 48)
    input.position.set(0, label.getLocalBounds().bottom + 8)
  }
}
