/* eslint-disable no-use-before-define */
import { Container, utils } from 'pixi.js'

export abstract class Widget extends utils.EventEmitter {
  view: Container = new Container()
  parent: Widget | null = null
  children: Set<Widget> = new Set()

  constructor () {
    super()
    // @ts-ignore
    this.view.$widget = this
    this.view.on('added', () => this._layout())
    this.view.on('childAdded', () => this._layout())
  }

  abstract layout (): void

  private _layout () {
    if (!this.view.parent) {
      return
    }

    this.layout()
    this.children.forEach(child => child._layout())
  }

  addChild (...children: Widget[]): void {
    children.forEach((child) => {
      this.view.addChild(child.view)
      this.children.add(child)
      child.parent = this
    })
  }
}
