// eslint-disable-next-line camelcase
import { bytes_to_state, state_to_bytes } from 'crdt-buffer'
import type { Socket } from 'socket.io-client'

import type { PixelData } from './pixel-data'
import { debuglog } from '~/utils/debug'


type Listener = (state: PixelData['state']) => void;
interface User {
  id: string;
  name: string;
}

export class ClientConnect {
  #roomId: string
  #userId: string
  #userName: string
  #io: Socket
  constructor (config: {userId: string, userName: string; roomId: string, io: Socket}) {
    this.#roomId = config.roomId
    this.#userId = config.userId
    this.#userName = config.userName
    this.#io = config.io
    this.#initialize()
  }

  get user (): User {
    return {
      id: this.#userId,
      name: this.#userName
    }
  }

  set onmessage (listener: Listener) {
    const byteListenr = (from: User, blob: ArrayBuffer) => {
      const bytes = new Uint8Array(blob)
      debuglog('bytes received from', from, bytes)
      const stateMap = bytes_to_state(bytes)
      const state = Object.fromEntries(stateMap.entries())
      listener(state)
    }
    this.#io.on('paint', byteListenr)
  }

  #initialize () {
    this.#io.emit('joinRoom', this.#roomId, this.user)
  }

  send (state: PixelData['state']) {
    const bytes = state_to_bytes(state, 100 /* TODO: fix hardcode */)
    this.#io.emit('paint', this.#roomId, this.user, bytes)
  }
}
