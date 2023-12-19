import { Graphics } from 'pixi.js'
import { Widget } from './widget'

export class GamePlayToolBox extends Widget {
  background: Graphics

  constructor () {
    super()
    this.background = new Graphics()
    this.view.addChild(this.background)
  }

  layout (): void {
    const { background, view } = this

    const maxWidth = view.parent.width
    const height = 48
    background.clear()
    background.beginFill(0xCCCCCC).drawRect(0, 0, maxWidth, height)
      .beginFill(0x000000).drawRect(0, height - 1, maxWidth, 1) // draw border
  }
}
