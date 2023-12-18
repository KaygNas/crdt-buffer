import type { Room } from '~/interfaces'
import { roomDatabase } from '~/utils'

export interface RoomCreateRequestQuery {
  themeType: 'custom' | 'random'
  theme: string
}
export interface RoomCreateResponse {
  room: Room
}

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const room: Room = roomDatabase.createRoom()
  return { room, query }
})
