import { Graphics } from 'pixi.js'
import { Widget } from './widget'

export class RoomLayout extends Widget {
  background: Graphics

  constructor () {
    super()
    this.background = new Graphics()
    this.view.addChild(this.background)
  }

  layout () {
    const { view, background } = this
    const { parent } = view

    if (!parent) {
      return
    }

    const padding = 24
    const marginTop = 124
    const gap = 12

    background.clear()
    background.beginFill(0xEEEEEE, 0.5)
      .drawRect(0, 0, parent.width - padding * 2, parent.height - padding * 2)
    background.position.set(padding, padding)

    view.children
      .filter(child => child !== background)
      .forEach((child, index, children) => {
        if (index === 0) {
          child.position.set(padding, marginTop)
          return
        }
        const prevChild = children[index - 1]
        const bbox = prevChild.getBounds()
        child.position.set(padding, bbox.bottom + gap)
      })
  }
}
