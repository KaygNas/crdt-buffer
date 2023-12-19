import type { FederatedPointerEvent } from 'pixi.js'
import { Graphics } from 'pixi.js'
import { Widget } from './widget'

interface Position {
  x: number
  y: number
}
export class GamePlayPaintBoard extends Widget {
  background: Graphics
  private prevPosition: Position | null = null
  constructor () {
    super()
    this.background = new Graphics()
    this.view.addChild(this.background)
    this.listenEvents()
  }

  private listenEvents (): void {
    const { background, redraw } = this
    background.interactive = true
    background.on('mousedown', () => {
      background.on('mousemove', redraw)
    })
    background.on('mouseup', () => {
      background.off('mousemove', redraw)
      this.prevPosition = null
    })
    background.on('mouseout', () => {
      background.off('mousemove', redraw)
      this.prevPosition = null
    })
  }

  redraw = (event: FederatedPointerEvent) => {
    const { prevPosition } = this
    const { x, y } = event.global
    const position = { x, y }

    if (prevPosition) {
      this.background
        .lineStyle(5, 0x000000, 1)
        .moveTo(prevPosition.x, prevPosition.y)
        .lineTo(position.x, position.y)
    }
    this.prevPosition = position
  }

  layout (): void {
    const { view } = this

    this.background.clear()
    this.background.beginFill(0xFFFFFF).drawRect(0, 0, view.parent.width, view.parent.height)
  }
}
