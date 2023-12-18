import type { Room } from '~/interfaces'
import { generateRandom } from '~/utils'

class RoomDatabase {
  private rooms: Room[] = []

  public createRoom () {
    const room: Room = { id: generateRandom(8), name: 'XXX房间' }
    this.rooms.push(room)
    return room
  }

  public getRoom (roomId: string) {
    return this.rooms.find(room => room.id === roomId)
  }

  public removeRoom (roomId: string) {
    this.rooms = this.rooms.filter(room => room.id !== roomId)
  }
}

export const roomDatabase = new RoomDatabase()
