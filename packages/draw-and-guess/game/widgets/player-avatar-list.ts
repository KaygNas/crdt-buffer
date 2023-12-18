import { Text, Graphics } from 'pixi.js'
import { Widget } from './widget'

class PlayerAvatar extends Widget {
  name: Text
  avatar: Graphics

  constructor (opts: {name: string, avatar: string}) {
    super()

    const { view } = this
    const { name } = opts

    const avatarSprite = new Graphics().beginFill(0xEEEEEE).drawCircle(0, 0, 24)
    this.avatar = avatarSprite

    const nameText = new Text(name, { fontSize: 12 })
    nameText.anchor.set(0.5, 0)
    nameText.position.set(0, avatarSprite.height / 2 + 4)
    this.name = nameText

    view.addChild(avatarSprite, nameText)
  }

  layout (): void {}
}

export class PlayerAvatarList extends Widget {
  playerAvatars: PlayerAvatar[]

  constructor () {
    super()
    this.playerAvatars = this.createPlaceholderPlayerAvatars(8)
    this.addChild(...this.playerAvatars)
  }

  setPlayers (players: {name: string, avatar: string}[]) {
    players.forEach((player, index) => {
      this.playerAvatars[index].name.text = player.name
    })
  }

  private createPlaceholderPlayerAvatars (num: number) {
    const placeholderPlayerAvatars: PlayerAvatar[] = Array.from({ length: num })
      .map(() => ({ name: '等待加入', avatar: 'TODO' }))
      .map(player => new PlayerAvatar({
        name: player.name,
        avatar: player.avatar
      }))
    return placeholderPlayerAvatars
  }

  layout (): void {
    const { view } = this

    if (!view.parent) {
      return
    }

    const maxWidth = view.parent.width
    const cols = 4
    const itemWidth = maxWidth / cols
    const itemHeight = 80
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
