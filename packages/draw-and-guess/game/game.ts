import type { Platform } from './interface'
import { ClientConnect, PixelEditor } from './pixel-editor'
import { debuglog } from '~/utils/debug'

export class Game {
  public canvas: HTMLCanvasElement
  public ctx: CanvasRenderingContext2D
  public platform: Platform
  private editor!: PixelEditor
  private connect!: ClientConnect
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
    debuglog('Game initialized', this)
  }

  initEditor () {
    const { canvas, platform } = this
    const size = platform.getSize()
    const user = platform.getUser()
    const room = platform.getRoom()
    const io = platform.getIo()
    const artboardSize = { w: size.width, h: size.height }
    const editor = new PixelEditor(user.id, canvas, artboardSize)
    const connect = new ClientConnect({ user, room, io, size })
    connect.onmessage = state => editor.receive(state)
    editor.onchange = state => connect.send(state)
    this.editor = editor
    this.connect = connect
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
