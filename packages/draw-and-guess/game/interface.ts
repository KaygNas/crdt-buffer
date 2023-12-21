import type { Socket, Player, WaitingRoom, PlayingRoom, PrizeGivingRoom } from '~/interfaces'

export interface Size {
  width: number;
  height: number;
}

export interface Platform {
  getCanvas: () => HTMLCanvasElement;
  getSize: () => Size;
  getUser: () => Player;
  getRoom: () => Promise<WaitingRoom | PlayingRoom | PrizeGivingRoom | undefined>;
  getIo: () => Socket;
}
