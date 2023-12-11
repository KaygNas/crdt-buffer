import { bytes_to_state, state_to_bytes } from 'crdt-buffer'

import type { PixelData } from './pixel-data'

type Listener = (state: PixelData['state']) => void;
type ByteListener = (bytes: Uint8Array) => void;
class CentralServer {
  #connections: Map<string, ByteListener> = new Map()
  connect (id: string, listener: Listener) {
    const byteListenr = (bytes: Uint8Array) => {
      const stateMap = bytes_to_state(bytes)
      const state = Object.fromEntries(stateMap.entries())
      listener(state)
    }
    this.#connections.set(id, byteListenr)
  }

  broadcast (fromId: string, bytes: Uint8Array) {
    for (const [id, listener] of this.#connections.entries()) {
      if (id === fromId) { continue }
      listener(bytes)
    }
  }
}

const centralServer = new CentralServer()

export class ClientConnect {
  #id: string
  #latency: number

  constructor (id: string, latency = 0) {
    this.#id = id
    this.#latency = latency
  }

  set onmessage (listener: Listener) {
    centralServer.connect(this.#id, listener)
  }

  #sleep (second: number) {
    return new Promise(resolve => setTimeout(resolve, second * 1000))
  }

  async send (state: PixelData['state']) {
    await this.#sleep(this.#latency)
    const bytes = state_to_bytes(state, 100 /* TODO: fix hardcode */)
    centralServer.broadcast(this.#id, bytes)
  }
}

const chunk = <T>(arr: T[], size: number) => {
  const result = []
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, size + i))
  }
  return result
}

function bytestoHex (bytes: Uint8Array, perline: number) {
  const chunks = chunk(
    Array.from(bytes).map(n => n.toString(16).padStart(2, '0')),
    perline
  )
  return chunks.map(chunk => chunk.join(' ')).join('\n')
}
