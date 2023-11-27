import { CRDT } from "./interface";

export type State<T> = [peer: string, timestamp: number, value: T];
export class LWWRegister<T> implements CRDT<T, State<T>> {
  readonly id: string;
  state: State<T>;

  get value() {
    return this.state[2];
  }

  constructor(id: string, state: State<T>) {
    this.id = id;
    this.state = state;
  }

  set(value: T) {
    this.state = [this.id, this.state[1] + 1, value];
  }

  merge(state: State<T>) {
    const [remotePeer, remoteTimestamp] = state;
    const [localPeer, localTimestamp] = this.state;

    if (localTimestamp > remoteTimestamp) return;

    if (localTimestamp === remoteTimestamp && localPeer > remotePeer) return;

    this.state = state;
  }
}
