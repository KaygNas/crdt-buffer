import { Container, Text } from 'pixi.js'

export class RoomTitle extends Container {
  constructor (opts: {parent: Container, text: string}) {
    super()

    const { parent, text } = opts
    this.setParent(parent)

    const title = new Text(text)
    title.anchor.set(0.5)
    title.position.set(parent.width / 2, 0)
    title.setParent(this)
  }
}
