export type { Socket } from 'socket.io-client'

export interface User {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
};
