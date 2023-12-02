import { fromCRDTData, toCRDTData } from "./adaptor";
import { PixelData } from "./pixel-data";
import { data_to_bytes, bytes_to_data } from "crdt-buffer";

type Listener = (state: PixelData["state"]) => void;
type ByteListener = (bytes: Uint8Array) => void;
class CentralServer {
  #connections: Map<string, ByteListener> = new Map();
  connect(id: string, listener: Listener) {
    const byteListenr = (bytes: Uint8Array) => {
      const crdtData = bytes_to_data(bytes);
      const state = fromCRDTData(crdtData);
      listener(state);
    };
    this.#connections.set(id, byteListenr);
  }
  broadcast(fromId: string, bytes: Uint8Array) {
    for (const [id, listener] of this.#connections.entries()) {
      if (id === fromId) continue;
      listener(bytes);
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
    const crdtData = toCRDTData(state, 100 /* TODO: fix hardcode */);
    const bytes = data_to_bytes(crdtData);
    centralServer.broadcast(this.#id, bytes);
  }
}

const chunk = <T>(arr: T[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, size + i));
  }
  return result;
};

function bytestoHex(bytes: Uint8Array, perline: number) {
  const chunks = chunk(
    Array.from(bytes).map((n) => n.toString(16).padStart(2, "0")),
    perline,
  );
  return chunks.map((chunk) => chunk.join(" ")).join("\n");
}
