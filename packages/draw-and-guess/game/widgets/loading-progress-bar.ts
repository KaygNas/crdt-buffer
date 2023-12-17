import { ProgressBar } from '@pixi/ui'
import type { Container } from 'pixi.js'
import { Graphics } from 'pixi.js'

export class LoadingProgressBar extends ProgressBar {
  constructor (opts: {parent: Container}) {
    const { parent } = opts
    const borderColor = 0x000000
    const width = parent.width
    const height = 20
    const radius = 8
    const border = 2
    const backgroundColor = 0x000000
    const fillColor = 0xFFFFFF

    const bg = new Graphics()
      .beginFill(borderColor)
      .drawRoundedRect(0, 0, width, height, radius)
      .beginFill(backgroundColor)
      .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius)

    const fill = new Graphics()
      .beginFill(borderColor)
      .drawRoundedRect(0, 0, width, height, radius)
      .beginFill(fillColor)
      .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius)

    super({
      bg,
      fill,
      progress: 15
    })
    this.setParent(parent)
  }
}
