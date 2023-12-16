import * as PIXI from 'pixi.js'
export class Scene extends PIXI.Container {
  app: PIXI.Application
  constructor (app: PIXI.Application) {
    super()

    app.stage.removeChildren()
    app.stage.addChild(this)

    this.app = app
  }
}
