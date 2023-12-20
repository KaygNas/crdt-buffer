export type { Socket } from 'socket.io-client'

export interface Player {
  id: string;
  avatar: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
};

export interface Answer {
  text: string;
}

export interface AnswerTheme {
  theme: string;
  answers: Answer[];
}
