import { Graphics, Text } from 'pixi.js'
import { FancyButton, Input } from '@pixi/ui'
import { Widget } from './widget'

export class MessageInput extends Widget {
  static Events = {
    SEND_MESSAGE: 'send-message',
    ASK_FOR_TEAM: 'ask-for-team'
  }

  input: Input
  inputBackground: Graphics
  sendButton: FancyButton
  teamButton: FancyButton

  constructor () {
    super()
    this.inputBackground = new Graphics().beginFill(0x000000).drawRect(0, 0, 100, 36)
    this.input = new Input({
      bg: this.inputBackground,
      padding: 12,
      align: 'left',
      placeholder: '请输入消息',
      textStyle: { fontSize: 12, fill: 0xAAAAAA }
    })

    this.sendButton = new FancyButton({
      text: new Text('发送', { fontSize: 12, fill: 0xFFFFFF }),
      defaultView: new Graphics().beginFill(0x333333).drawRect(0, 0, 40, 32)
    })
    this.sendButton.onPress.connect(() => {
      this.emit(MessageInput.Events.SEND_MESSAGE, { message: this.input.value })
    })

    this.teamButton = new FancyButton({
      text: new Text('协助', { fontSize: 12, fill: 0xFFFFFF }),
      defaultView: new Graphics().beginFill(0x333333).drawRect(0, 0, 40, 32)
    })
    this.teamButton.onPress.connect(() => {
      this.emit(MessageInput.Events.ASK_FOR_TEAM)
    })

    this.view.addChild(this.input, this.sendButton, this.teamButton)
  }

  layout (): void {
    const { input, inputBackground, sendButton, teamButton, view } = this

    const maxWidth = view.parent.width
    const maxHeight = view.parent.height
    teamButton.position.set(maxWidth - teamButton.width - 12, (maxHeight - teamButton.height) / 2)
    sendButton.position.set(teamButton.x - sendButton.width - 8, (maxHeight - sendButton.height) / 2)

    inputBackground.beginFill(0x000000).drawRect(0, 0, sendButton.x - 20, 36)
    input.position.set(12, (maxHeight - inputBackground.height) / 2)
  }
}

export class GamePlayToolBox extends Widget {
  background: Graphics
  messageInput: MessageInput

  constructor () {
    super()

    this.background = new Graphics()
    this.view.addChild(this.background)

    const messageInput = new MessageInput()
    this.messageInput = messageInput

    this.addChild(messageInput)
  }

  layout (): void {
    const { background, view } = this

    const maxWidth = view.parent.width
    const height = 48
    background.clear()
    background.beginFill(0xCCCCCC).drawRect(0, 0, maxWidth, height)
      .beginFill(0x000000).drawRect(0, height - 1, maxWidth, 1) // draw border
  }
}
