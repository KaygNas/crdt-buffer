// TODO: performance improvement
// import { bytes_to_state, state_to_bytes } from 'crdt-buffer'

import type { Size } from '../interface'
import type { PixelData } from './pixel-data'
import type { Room, Player, Socket } from '~/interfaces'
import { debuglog } from '~/utils/debug'

type Listener = (state: PixelData['state']) => void;

export class ClientConnect {
  #user: Player
  #room: Room
  #size: Size
  #io: Socket
  constructor (config: { user: Player, room: Room, io: Socket, size: Size}) {
    this.#size = config.size
    this.#user = config.user
    this.#room = config.room
    this.#io = config.io
    this.#initialize()
  }

  get user (): Player {
    return this.#user
  }

  set onmessage (listener: Listener) {
    const byteListenr = (from: Player, state: [string, any][]) => {
      if (from.id === this.user.id) {
        return
      }

      debuglog('[onmessage]', from, state)
      listener(new Map(state))
    }
    this.#io.on('paint', byteListenr)
  }

  #initialize () {
    this.#io.emit('joinRoom', this.#room.id, this.user)
    this.#io.on('join', (user: Player, message: any) => {
      debuglog('[join]', user, message)
    })
    this.#io.on('leave', (user: Player, message: any) => {
      debuglog('[leave]', user, message)
    })
  }

  send (state: PixelData['state']) {
    debuglog('[send]', state)
    this.#io.emit('paint', this.#room.id, this.user, Array.from(state.entries()))
  }
}
