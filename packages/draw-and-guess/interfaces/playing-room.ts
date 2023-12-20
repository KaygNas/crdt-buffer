import type { AnswerTheme, Player, Room } from './shared'

export interface PlayingRoomPlayer extends Player {
  score: number;
}

export interface GameRound {
  round: number;
  answer: string;
  paintist: PlayingRoomPlayer['id'];
  assistants: PlayingRoomPlayer['id'][];
  guessers: PlayingRoomPlayer['id'][];
  correctGuessers: PlayingRoomPlayer['id'][];
  totalTime: number;
}

export interface PlayingRoom extends Room {
  state: 'playing'
  players: PlayingRoomPlayer[];
  answerTheme: AnswerTheme;
  currentGameRound: GameRound;
}

export interface GussingMessage {
  text: string;
  from: PlayingRoomPlayer;
}
