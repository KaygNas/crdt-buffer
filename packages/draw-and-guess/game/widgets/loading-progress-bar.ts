import { ProgressBar } from '@pixi/ui'
import { Graphics } from 'pixi.js'
import { Widget } from './widget'

export class LoadingProgressBar extends Widget {
  progressBar: ProgressBar
  background: Graphics
  fill: Graphics
  borderColor = 0x000000
  height = 20
  radius = 8
  border = 2
  backgroundColor = 0x000000
  fillColor = 0xFFFFFF

  constructor () {
    super()

    const { border, borderColor, height, radius, backgroundColor, fillColor } = this
    const bg = new Graphics()
    this.drawBackground({ view: bg, width: 0, border, borderColor, height, radius, backgroundColor })
    const fill = new Graphics()
    this.drawFill({ view: fill, width: 0, border, borderColor, height, radius, fillColor })
    const progressBar = new ProgressBar({
      bg,
      fill,
      progress: 1
    })
    this.background = bg
    this.fill = fill
    this.progressBar = progressBar
    this.view.addChild(progressBar)
  }

  layout (): void {
    const { view, progressBar, background, fill } = this
    if (!view.parent) {
      return
    }

    const { border, borderColor, height, radius, backgroundColor, fillColor } = this
    const width = view.parent.width
    this.drawBackground({ view: background, border, borderColor, width, height, radius, backgroundColor })
    this.drawFill({ view: fill, border, borderColor, width, height, radius, fillColor })
    progressBar.progress = 100
  }

  private drawBackground (opts: {
    view: Graphics,
    borderColor: number, width: number, height: number, radius: number, border: number, backgroundColor: number
  }) {
    const { view, backgroundColor, border, borderColor, width, height, radius } = opts
    view.clear()
    view
      .beginFill(borderColor)
      .drawRoundedRect(0, 0, width, height, radius)
      .beginFill(backgroundColor)
      .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius)
    return view
  }

  private drawFill (opts: {
    view: Graphics,
    borderColor: number, width: number, height: number, radius: number, border: number, fillColor: number
  }) {
    const { view, fillColor, border, borderColor, width, height, radius } = opts
    view
      .beginFill(borderColor)
      .drawRoundedRect(0, 0, width, height, radius)
      .beginFill(fillColor)
      .drawRoundedRect(border, border, width - (border * 2), height - (border * 2), radius)
    return view
  }
}
