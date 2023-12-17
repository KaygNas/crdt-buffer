import { SpriteButton } from './sprite-button'
import { Widget } from './widget'

export class SpriteButtonGroup extends Widget {
  buttons: SpriteButton[] = []

  setButton (...buttons:{text: string}[]) {
    const _buttons = buttons.map(button => new SpriteButton({ ...button, width: 100, height: 10 }))
    this.buttons = _buttons
    this.addChild(...this.buttons)
    return this.buttons
  }

  layout () {
    const { view, buttons } = this

    if (!view.parent) {
      return
    }

    const BUTTON_GAP = 24
    const width = (view.parent.width - BUTTON_GAP) / buttons.length
    const height = 48
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i]

      button.background.clear()
      button.background.beginFill(0x333333).drawRoundedRect(0, 0, width, height, 8)
      button.view.x = (width + BUTTON_GAP) * i
      button.view.y = 0
    }
  }
}
