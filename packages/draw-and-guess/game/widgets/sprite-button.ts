import { Graphics, Text } from 'pixi.js'
import { Button } from '@pixi/ui'
import { Widget } from './widget'

export class SpriteButton extends Widget {
  button: Button
  background: Graphics
  text: Text

  constructor (opts: { text: string, width: number, height: number}) {
    super()

    const { width, height } = opts
    const radius = 8

    const background = new Graphics().beginFill(0x333333).drawRoundedRect(0, 0, width, height, radius)
    this.background = background

    this.button = new Button(background)

    const text = new Text(opts.text, { fontSize: 18, fill: 0xFFFFFF })
    this.text = text

    this.view.addChild(background, text)
  }

  layout (): void {
    const { text, background } = this

    text.anchor.set(0.5)
    text.x = background.width / 2
    text.y = background.height / 2
  }
}
