import { Text } from 'pixi.js'
import { Widget } from './widget'

export class RoomTitle extends Widget {
  title: Text

  constructor (opts: {text: string}) {
    super()

    const { text } = opts

    const title = new Text(text)
    this.title = title
    this.view.addChild(title)
  }

  layout (): void {
    const { title, view } = this
    const { parent } = view

    if (!parent) {
      return
    }

    title.anchor.set(0.5)
    title.position.set(parent.width / 2, 0)
  }
}
