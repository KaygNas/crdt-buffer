import type { Socket, Player, Room } from '~/interfaces'

export interface Size {
  width: number;
  height: number;
}

export interface Platform {
  getCanvas: () => HTMLCanvasElement;
  getSize: () => Size;
  getUser: () => Player;
  getRoom: () => Promise<Room | undefined>;
  getIo: () => Socket;
}
