import type { AnswerTheme, Player, Room } from './shared'

export interface WaitingRoomPlayer extends Player {
  isHost: boolean;
  isReady: boolean;
}

export interface WaitingRoom extends Room {
  state: 'waiting';
  players: WaitingRoomPlayer[];
  answerTheme: AnswerTheme;
}
