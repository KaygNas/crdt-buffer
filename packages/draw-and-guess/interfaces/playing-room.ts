import type { AnswerTheme, Player, Room } from './shared'

export interface PlayingRoomPlayer extends Player {
  score: number;
  isPainist: boolean;
  isAssistant: boolean;
  isGuesser: boolean;
  isCorrectGuesser: boolean;
}

export interface GameRound {
  round: number;
  answer: string;
  paintist: PlayingRoomPlayer;
  assistants: PlayingRoomPlayer[];
  guessers: PlayingRoomPlayer[];
  correctGuessers: PlayingRoomPlayer[];
  totalTime: number;
}

export interface PlayingRoom extends Room {
  players: PlayingRoomPlayer[];
  answerTheme: AnswerTheme;
  currentGameRound: GameRound;
}

export interface GussingMessage {
  text: string;
  from: PlayingRoomPlayer;
}
