/* eslint-disable camelcase */
import { bytes_to_state, state_to_bytes } from 'crdt-buffer'

import type { Size } from '../interface'
import type { PixelData } from './pixel-data'
import type { Room, User, Socket } from '~/interfaces'
import { debuglog } from '~/utils/debug'

type Listener = (state: PixelData['state']) => void;

export class ClientConnect {
  #user: User
  #room: Room
  #size: Size
  #io: Socket
  constructor (config: { user: User, room: Room, io: Socket, size: Size}) {
    this.#size = config.size
    this.#user = config.user
    this.#room = config.room
    this.#io = config.io
    this.#initialize()
  }

  get user (): User {
    return this.#user
  }

  set onmessage (listener: Listener) {
    const byteListenr = (from: User, blob: ArrayBuffer) => {
      if (from.id === this.user.id) {
        return
      }

      const bytes = new Uint8Array(blob)
      const state = bytes_to_state(bytes)
      debuglog('[paint]', from, state)
      listener(state)
    }
    this.#io.on('paint', byteListenr)
  }

  #initialize () {
    this.#io.emit('joinRoom', this.#room.id, this.user)
    this.#io.on('join', (user: User, message: any) => {
      debuglog('[join]', user, message)
    })
    this.#io.on('leave', (user: User, message: any) => {
      debuglog('[leave]', user, message)
    })
  }

  send (state: PixelData['state']) {
    const bytes = state_to_bytes(state, this.#size.width)
    this.#io.emit('paint', this.#room.id, this.user, bytes)
  }
}
