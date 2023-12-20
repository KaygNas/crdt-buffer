// Server side socket events, recieve from client
export const ROOM_JOIN = 'room-join'
export const ROOM_LEAVE = 'room-leave'
export const ROOM_PAINT = 'room-paint'
export const ROOM_MESSAGE = 'room-message'
export const ROOM_PLAYER_READY = 'room-player-ready'
export const ROOM_PLAYER_GAME_START = 'room-player-game-start'
export const ROOM_NEXT_ROUND = 'room-next-round'

// Client side socket events, recive from server
export const PLAYER_JOIN = 'player-join'
export const PLAYER_LEAVE = 'player-leave'
export const PLAYER_PAINT = 'player-paint'
export const PLAYER_MESSAGE = 'player-message'
export const ROOM_STATE_CHANGE = 'room-state-change'
