import { Graphics } from 'pixi.js'
import { Widget } from './widget'
import type { Player } from '~/interfaces'

class PlayerAvatar extends Widget {
  avatar: Graphics

  constructor (opts: Player) {
    super()

    const { view } = this

    const avatarSprite = new Graphics().beginFill(0xEEEEEE).drawCircle(18, 18, 18)
    this.avatar = avatarSprite

    view.addChild(avatarSprite)
  }

  layout (): void {}
}

export class PlayerAvatarList extends Widget {
  static AVATAR_COUNT = 8

  playerAvatars: PlayerAvatar[]
  background: Graphics

  constructor () {
    super()

    const background = new Graphics()
    this.background = background
    this.view.addChild(background)

    this.playerAvatars = this.createPlaceholderPlayerAvatars(PlayerAvatarList.AVATAR_COUNT)
    this.addChild(...this.playerAvatars)
  }

  setPlayers (players: Player[]) {
    players.forEach((player, index) => {
      // TODO
    })
  }

  private createPlaceholderPlayerAvatars (num: number) {
    const placeholderPlayerAvatars: PlayerAvatar[] = Array.from({ length: num })
      .map(() => ({ id: '-', name: '等待加入', avatar: 'TODO' }))
      .map(player => new PlayerAvatar(player))
    return placeholderPlayerAvatars
  }

  layout (): void {
    const { view, background, playerAvatars } = this

    const maxWidth = view.parent.width
    const height = 48
    background.clear()
    background.beginFill(0xCCCCCC).drawRect(0, 0, maxWidth, height)
    const itemWidth = maxWidth / PlayerAvatarList.AVATAR_COUNT
    playerAvatars.map(avatar => avatar.view).forEach((child, index) => {
      const offsetX = Math.max(0, (itemWidth - child.getLocalBounds().width) / 2)
      const offsetY = Math.max(0, (height - child.getLocalBounds().height) / 2)
      child.position.set(itemWidth * index + offsetX, offsetY)
    })
  }
}
