import { Container } from 'pixi.js'
import { SpriteButton } from './sprite-button'

export class SpriteButtonGroup extends Container {
  buttons: SpriteButton[] = []

  constructor (opts:{parent: Container}) {
    super()

    const { parent } = opts
    this.setParent(parent)
  }

  setButton (...buttons:{text: string}[]) {
    this.removeChild(...this.buttons)

    const { parent } = this
    const BUTTON_GAP = 24
    const width = (parent.width - BUTTON_GAP) / buttons.length
    const height = 48
    for (let i = 0; i < buttons.length; i++) {
      const { text } = buttons[i]
      const button = new SpriteButton({ parent: this, text, width, height })
      button.position.set((width + BUTTON_GAP) * i, 0)
      this.buttons.push(button)
    }

    return this.buttons
  }
}
