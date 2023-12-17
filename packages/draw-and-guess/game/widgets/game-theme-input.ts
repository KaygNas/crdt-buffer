import { Container, Text, Graphics } from 'pixi.js'
import { Input } from '@pixi/ui'

export class GameThemeInput extends Container {
  input: Input

  constructor (opts: {parent: Container}) {
    super()

    const { parent } = opts
    this.setParent(parent)

    const label = new Text('画作主题：', { fontSize: 18 })
    label.setParent(this)

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
    input.setParent(this)
    this.input = input
  }
}
