import type { Socket, User, Room } from '~/interfaces'

export interface Size {
  width: number;
  height: number;
}

export interface Platform {
  getCanvas: () => HTMLCanvasElement;
  getSize: () => Size;
  getUser: () => User;
  getRoom: () => Promise<Room | undefined>;
  getIo: () => Socket;
}
