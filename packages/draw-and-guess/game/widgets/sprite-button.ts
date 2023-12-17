import { Container, Graphics, Text } from 'pixi.js'
import { Button } from '@pixi/ui'

export class SpriteButton extends Container {
  button: Button

  constructor (opts: {parent: Container, text: string, width: number, height: number}) {
    super()

    const { width, height, parent } = opts
    const radius = 8

    const view = new Graphics().beginFill(0xEEEEEE).drawRoundedRect(0, 0, width, height, radius)
    view.setParent(this)

    this.button = new Button(view)

    const text = new Text(opts.text, { fontSize: 18 })
    text.anchor.set(0.5)
    text.x = width / 2
    text.y = height / 2
    text.setParent(this)

    this.setParent(parent)
  }
}
