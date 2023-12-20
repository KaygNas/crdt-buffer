import type { Player, Room } from '~/interfaces'
import { generateRandom } from '~/utils'

interface SocketPlayer extends Player {
  socketId: string
}
interface RoomPlayer extends SocketPlayer {
  room: Room
}

class RoomDatabase {
  private rooms: Room[] = []

  createRoom (player: SocketPlayer) {
    const room: Room = { id: generateRandom(8), name: `${player.name}的房间` }
    this.rooms.push(room)
    return room
  }

  getRoom (roomId: string) {
    return this.rooms.find(room => room.id === roomId)
  }

  removeRoom (roomId: string) {
    const room = this.getRoom(roomId)
    if (!room) {
      return
    }
    this.rooms = this.rooms.filter(room => room.id !== roomId)
    playerDatabase.removePlayersInRoom(roomId)
  }

  getPlayersOfRoom (roomId: string) {
    return playerDatabase.getPlayersByRoomId(roomId)
  }

  addPlayerToRoom (roomId: string, player: SocketPlayer) {
    const room = this.getRoom(roomId)
    if (!room) {
      return
    }
    playerDatabase.setPlayer({ ...player, room })
  }

  removePlayerFromRoom (_: string, playerId: string) {
    playerDatabase.removePlayer(playerId)
  }
}

export const roomDatabase = new RoomDatabase()

class PlayerDatabase {
  private playerSocketIdToId: Map<RoomPlayer['socketId'], RoomPlayer['id']> = new Map()
  private roomIdToPlayerIds: Map<Room['id'], Set<RoomPlayer['id']>> = new Map()
  private players: Map<RoomPlayer['id'], RoomPlayer> = new Map()

  setPlayer (player: RoomPlayer) {
    this.players.set(player.id, player)
    this.playerSocketIdToId.set(player.socketId, player.id)
    this.roomIdToPlayerIds.get(player.room.id)?.add(player.id)
  }

  getPlayer (playerId: string) {
    return this.players.get(playerId)
  }

  removePlayer (playerId: string) {
    const player = this.getPlayer(playerId)
    if (!player) {
      return
    }

    this.players.delete(player.id)
    this.playerSocketIdToId.delete(player.socketId)
    this.roomIdToPlayerIds.get(player.room.id)?.delete(player.id)
  }

  getPlayerBySocketId (socketId: string) {
    const playerId = this.playerSocketIdToId.get(socketId)
    return playerId ? this.getPlayer(playerId) : undefined
  }

  getPlayersByRoomId (roomId: string) {
    const playerIds = this.roomIdToPlayerIds.get(roomId)
    return playerIds ? [...playerIds].map(playerId => this.getPlayer(playerId)!) : []
  }

  removePlayersInRoom (roomId: string) {
    this.roomIdToPlayerIds.get(roomId)?.forEach(playerId => this.removePlayer(playerId))
    this.roomIdToPlayerIds.delete(roomId)
  }
}

export const playerDatabase = new PlayerDatabase()
