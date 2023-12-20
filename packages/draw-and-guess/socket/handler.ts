/**
 * Duplicated from https://github.com/sush1lemon/nuxt-socket.io/tree/main
 */
import type { Server } from 'socket.io'

import { debuglog } from '~/utils/debug'
import * as SocketEvents from '~/constants/socket-events'
import type { Room, Player } from '~/interfaces'
import { roomDatabase } from '~/utils'

export const socketHandler = (io: Server) => {
  debuglog('✔️ Hello from the socket handler')

  io.on('connection', function (socket) {
    debuglog('socket connected', socket.id)
    socket.on('disconnect', function () {
      debuglog('socket disconnected', socket.id)
      const player = playerDatabase.getPlayerBySocketId(socket.id)
      if (!player) {
        return
      }
      const room = player.room
      socket.leave(room.id)
      roomDatabase.removePlayerFromRoom(room.id, player.id)
      io.to(room.id).emit(SocketEvents.PLAYER_LEAVE, {
        from: player,
        playerList: roomDatabase.getPlayersOfRoom(room.id),
        system: true
      })
    })

    socket.on(SocketEvents.ROOM_JOIN, (room: Room, player: Player) => {
      debuglog(`[Socket.io] joinRoom received room ${room.id} from user ${player.name}(${player.id})`)
      socket.join(room.id)
      roomDatabase.addPlayerToRoom(room.id, { ...player, socketId: socket.id })
      io.to(room.id).emit(SocketEvents.PLAYER_JOIN, {
        from: player,
        playerList: roomDatabase.getPlayersOfRoom(room.id),
        system: true
      })
    })

    socket.on(SocketEvents.ROOM_LEAVE, (room: Room, player: Player) => {
      socket.leave(room.id)
      roomDatabase.removePlayerFromRoom(room.id, player.id)
      io.to(room.id).emit(SocketEvents.PLAYER_LEAVE, {
        from: player,
        playerList: roomDatabase.getPlayersOfRoom(room.id),
        system: true
      })
    })

    socket.on(SocketEvents.ROOM_PAINT, function (room: Room, player: Player, data) {
      debuglog(`[Socket.io] message received room ${room.id} from user ${player.id} ${player.name}}`)
      const _room = roomDatabase.getRoom(room.id)
      if (_room) {
        io.to(room.id).emit(SocketEvents.PLAYER_PAINT, player, data)
      }
    })

    socket.on(SocketEvents.ROOM_MESSAGE, function (room: Room, player: Player, data) {
      debuglog(`[Socket.io] message received room ${room.id} from user ${player.id} ${player.name}}`)
      const _room = roomDatabase.getRoom(room.id)
      if (_room) {
        io.to(room.id).emit(SocketEvents.PLAYER_MESSAGE, player, data)
      }
    })

    socket.on(SocketEvents.ROOM_PLAYER_READY, function (room: Room, player: Player) {
      debuglog(`[Socket.io] message received room ${room.id} from user ${player.id} ${player.name}}`)
      const _room = roomDatabase.getRoom(room.id)
      if (_room) {
        // TODO: add room state
        io.to(room.id).emit(SocketEvents.ROOM_STATE_CHANGE)
      }
    })

    socket.on(SocketEvents.ROOM_PLAYER_GAME_START, function (room: Room, player: Player) {
      debuglog(`[Socket.io] message received room ${room.id} from user ${player.id} ${player.name}}`)
      const _room = roomDatabase.getRoom(room.id)
      if (_room) {
        // TODO: add room state
        io.to(room.id).emit(SocketEvents.ROOM_STATE_CHANGE)
      }
    })

    socket.on(SocketEvents.ROOM_NEXT_ROUND, function (room: Room, player: Player) {
      debuglog(`[Socket.io] message received room ${room.id} from user ${player.id} ${player.name}}`)
      const _room = roomDatabase.getRoom(room.id)
      if (_room) {
        // TODO: add room state
        io.to(room.id).emit(SocketEvents.ROOM_STATE_CHANGE)
      }
    })
  })
}
