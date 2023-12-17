import type { Container } from 'pixi.js'
import { Graphics } from 'pixi.js'

export class RoomLayout extends Graphics {
  constructor (opts: {parent: Container, width: number, height: number}) {
    super()

    const { width, height, parent } = opts
    const padding = 24
    this.beginFill(0x00FFFF).drawRect(0, 0, width - padding * 2, height - padding * 2)
    this.position.set(padding, padding)
    this.setParent(parent)
  }

  layout (...children: Container[]) {
    const padding = 24
    const marginTop = 124
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      child.position.set(
        0,
        i === 0
          ? marginTop
          : children[i - 1].position.y + children[i - 1].height + padding
      )
    }
  }
}
