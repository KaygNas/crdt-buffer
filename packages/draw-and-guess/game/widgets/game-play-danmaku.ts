import { Container, Graphics, Text } from 'pixi.js'
import { Tween } from '@tweenjs/tween.js'
import { Widget } from './widget'

export class Danmaku extends Widget {
  background: Graphics
  danmakuContainer: Container
  constructor () {
    super()
    this.background = new Graphics()
    this.danmakuContainer = new Container()
    this.view.addChild(this.background, this.danmakuContainer)
  }

  createNewDanmaku (text: string) {
    const { view, danmakuContainer } = this

    const textGraphic = new Text(text, { fontSize: 12 })
    textGraphic.position.set(view.width, Math.random() * (view.height - textGraphic.height))

    const tween = new Tween(textGraphic.position)
    tween.to({ x: -textGraphic.width }, 5000).start().onComplete(() => {
      danmakuContainer.removeChild(textGraphic)
    })

    danmakuContainer.addChild(textGraphic)
  }

  layout (): void {
    const { background, view } = this
    background.clear()
    background.beginFill(0xCCCCCC, 0.2).drawRect(0, 0, view.parent.width, 44)
  }
}
