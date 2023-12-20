import type { Player, Room } from './shared'

export interface PrizeGivingRoomPlayer extends Player{
  score: number;
  rank: number;
}

export interface PrizeGivingRoom extends Room {
  players: PrizeGivingRoomPlayer[];
}
