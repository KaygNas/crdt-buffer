import type { Room } from '~/interfaces'
import { roomDatabase } from '~/utils'

export interface RoomCreateRequestQuery {
  themeType: 'custom' | 'random'
  theme: string
}
export interface RoomCreateResponse {
  room: Room
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const room = roomDatabase.createRoom(body.player, body.theme).room
  return { room, body }
})
