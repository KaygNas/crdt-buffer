import type { Player, Room } from '~/interfaces'
import { generateRandom } from '~/utils'

class RoomDatabase {
  private rooms: Room[] = []
  private playersOfRoom: Map<Room['id'], Player[]> = new Map()

  public createRoom (player: Player) {
    const room: Room = { id: generateRandom(8), name: `${player.name}的房间` }
    this.rooms.push(room)
    return room
  }

  public getRoom (roomId: string) {
    return this.rooms.find(room => room.id === roomId)
  }

  public removeRoom (roomId: string) {
    this.rooms = this.rooms.filter(room => room.id !== roomId)
  }

  public getPlayersOfRoom (roomId: string) {
    return this.playersOfRoom.get(roomId)
  }

  public addPlayerToRoom (roomId: string, player: Player) {
    const players = this.playersOfRoom.get(roomId) || []
    players.push(player)
    this.playersOfRoom.set(roomId, players)
  }

  public removePlayerFromRoom (roomId: string, playerId: string) {
    const players = this.playersOfRoom.get(roomId)
    if (!players) {
      return
    }
    this.playersOfRoom.set(roomId, players.filter(player => player.id !== playerId))
  }
}

export const roomDatabase = new RoomDatabase()

class PlayerDatabase {
  private players: Player[] = []

  public getPlayer (playerId: string) {
    return this.players.find(player => player.id === playerId)
  }

  public removePlayer (playerId: string) {
    this.players = this.players.filter(player => player.id !== playerId)
  }
}

export const playerDatabase = new PlayerDatabase()
