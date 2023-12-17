import { Graphics, type Application } from 'pixi.js'
import { Widget } from '../widgets/widget'
export class Scene extends Widget {
  app: Application

  constructor (app: Application) {
    super()

    app.stage.removeChildren()
    app.stage.addChild(this.view)

    const background = new Graphics().beginFill(0xFFFFFF).drawRect(0, 0, app.view.width, app.view.height)
    this.view.addChild(background)

    this.app = app
  }

  layout (): void { }
}
