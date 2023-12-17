import { Text, Graphics } from 'pixi.js'
import { Widget } from './widget'

class PlayerAvatar extends Widget {
  name: string
  avatar: string

  constructor (opts: {name: string, avatar: string}) {
    super()

    const { view } = this
    const { name, avatar } = opts
    this.name = name
    this.avatar = avatar

    const avatarSprite = new Graphics().beginFill(0xEEEEEE).drawCircle(0, 0, 24)

    const nameText = new Text(name, { fontSize: 12 })
    nameText.anchor.set(0.5, 0)
    nameText.position.set(0, avatarSprite.height / 2 + 4)

    view.addChild(avatarSprite, nameText)
  }

  layout (): void {}
}

export class PlayerAvatarList extends Widget {
  playerAvatars: PlayerAvatar[] = []

  constructor () {
    super()

    this.setPlayers(
      Array.from({ length: 8 })
        .map(() => ({ name: '等待加入', avatar: 'TODO' }))
    )
  }

  setPlayers (players: {name: string, avatar: string}[]) {
    this.view.removeChildren()
    const items = players.map(player => new PlayerAvatar({
      name: player.name,
      avatar: player.avatar
    }))
    this.playerAvatars = items
    this.view.addChild(...items.map(item => item.view))
    return items
  }

  layout (): void {
    const { view } = this
    const { parent } = view

    if (!parent) {
      return
    }

    const maxWidth = parent.width
    const cols = 4
    const itemWidth = maxWidth / cols
    const itemHeight = 64
    view.children.forEach((child, index) => {
      const row = Math.floor(index / cols)
      const col = index % cols
      child.position.set(
        col * itemWidth + itemWidth / 2,
        row * itemHeight + itemHeight / 2
      )
    })
  }
}
