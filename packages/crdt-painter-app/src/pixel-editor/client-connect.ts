import { PixelData } from "./pixel-data";

type Listener = (state: PixelData["state"]) => void;

class CentralServer {
  #connections: Map<string, Listener> = new Map();
  connect(id: string, listener: Listener) {
    this.#connections.set(id, listener);
  }
  broadcast(fromId: string, state: PixelData["state"]) {
    for (const [id, listener] of this.#connections.entries()) {
      if (id === fromId) continue;
      listener(state);
    }
  }
}

const centralServer = new CentralServer();

export class ClientConnect {
  #id: string;
  #latency: number;

  constructor(id: string, latency = 0) {
    this.#id = id;
    this.#latency = latency;
  }

  set onmessage(listener: Listener) {
    centralServer.connect(this.#id, listener);
  }

  #sleep(second: number) {
    return new Promise((resolve) => setTimeout(resolve, second * 1000));
  }

  async send(state: PixelData["state"]) {
    await this.#sleep(this.#latency);
    centralServer.broadcast(this.#id, state);
  }
}
