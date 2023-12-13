import type { Platform } from './interface'
import { ClientConnect, PixelEditor } from './pixel-editor'

export class Game {
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  public platform: Platform
  constructor (platform: Platform) {
    const canvas = platform.createCanvasElement()
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas context not found')
    }
    this.canvas = canvas
    this.ctx = ctx
    this.platform = platform
    this.initialize()
  }

  initialize () {
    this.initEditor()
    this.resizeCanvas()
  }

  initEditor () {
    const { canvas, platform } = this
    const size = platform.getSize()
    const uuid = platform.getUuid()
    const artboardSize = { w: size.width, h: size.height }
    const editor = new PixelEditor(canvas, artboardSize)
    const connect = new ClientConnect({
      userId: uuid,
      userName: 'test', // TODO: get user name
      roomId: '1', // TODO: get room
      io: platform.getIo()
    })
    connect.onmessage = state => editor.receive(state)
    editor.onchange = state => connect.send(state)
  }

  resizeCanvas () {
    const size = this.platform.getSize()
    this.canvas.width = size.width
    this.canvas.height = size.height
  }

  start () {
    // TODO
  }
}
