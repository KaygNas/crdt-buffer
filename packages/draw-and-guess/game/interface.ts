import type { Socket, User, Room } from '~/interfaces'

export interface Size {
  width: number;
  height: number;
}

export interface Platform {
  createCanvasElement: () => HTMLCanvasElement;
  getSize: () => Size;
  getUser: () => User;
  getRoom: () => Room;
  getIo: () => Socket;
}
