import { roomDatabase } from '~/utils'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const room = roomDatabase.getRoom(query.roomId as string)
  return { room }
})
