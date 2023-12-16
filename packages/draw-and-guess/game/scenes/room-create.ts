import * as PIXI from 'pixi.js'
import { Scene } from './scene'
/**
 * The Scene for creating a new room.
 */
export class RoomCreate extends Scene {
  static Events = {
    CREATED: 'created'
  }

  constructor (app: PIXI.Application) {
    super(app)
    this.init()
  }

  private init () {
    this.initTitle()
  }

  private initTitle () {
    const { view } = this.app
    const title = new PIXI.Text('你们画我们猜')
    title.anchor.set(0.5, 0.5)

    title.position.set(view.width / 2, view.height / 2)
    this.addChild(title)
  }
}
