/**
 * Duplicated from https://github.com/sush1lemon/nuxt-socket.io/tree/main
 */
import type { Server } from 'socket.io'

import { debuglog } from '~/utils/debug'
import * as SocketEvents from '~/constants/socket-events'
import type { Room, Player, WaitingRoomPlayer } from '~/interfaces'
import { roomDatabase } from '~/utils'

export const socketHandler = (io: Server) => {
  debuglog('✔️ Hello from the socket handler')

  io.on('connection', function (socket) {
    debuglog('socket connected', socket.id)
    socket.on('disconnect', function () {
      debuglog('socket disconnected', socket.id)
    })

    socket.on(SocketEvents.ROOM_JOIN, (room: Room, player: Player) => {
      debuglog(`[Socket.io] joinRoom received room ${room.id} from user ${player.name}(${player.id})`)
      const _room = roomDatabase.getRoom(room.id)
      if (!_room) {
        return
      }

      socket.join(_room.room.id)
      _room.addPlayer(player)
      io.to(_room.room.id).emit(SocketEvents.PLAYER_JOIN, {
        from: player,
        playerList: _room.room.players,
        system: true
      })
    })

    socket.on(SocketEvents.ROOM_LEAVE, (room: Room, player: Player) => {
      const _room = roomDatabase.getRoom(room.id)
      if (!_room) {
        return
      }
      socket.leave(_room.room.id)
      _room.removePlayer(player.id)
      io.to(room.id).emit(SocketEvents.PLAYER_LEAVE, {
        from: player,
        playerList: _room.room.players,
        system: true
      })
    })

    socket.on(SocketEvents.ROOM_PAINT, function (room: Room, player: Player, data) {
      debuglog(`[Socket.io] message received room ${room.id} from user ${player.id} ${player.name}}`)
      const _room = roomDatabase.getRoom(room.id)
      if (!_room) {
        return
      }

      io.to(_room.room.id).emit(SocketEvents.PLAYER_PAINT, player, data)
    })

    socket.on(SocketEvents.ROOM_MESSAGE, function (room: Room, player: Player, data) {
      debuglog(`[Socket.io] message received room ${room.id} from user ${player.id} ${player.name}}`)
      const _room = roomDatabase.getRoom(room.id)
      if (!_room) {
        return
      }
      io.to(_room.room.id).emit(SocketEvents.PLAYER_MESSAGE, player, data)
    })

    socket.on(SocketEvents.ROOM_PLAYER_READY, function (room: Room, player: Player) {
      debuglog(`[Socket.io] message received room ${room.id} from user ${player.id} ${player.name}}`)
      const _room = roomDatabase.getRoom(room.id)
      if (!_room) {
        return
      }
      const _player = _room.getPlayer(player.id) as WaitingRoomPlayer | undefined
      if (!_player) {
        return
      }
      _player.isReady = !_player.isReady
      io.to(_room.room.id).emit(SocketEvents.ROOM_STATE_CHANGE, _room.room)
    })

    socket.on(SocketEvents.ROOM_PLAYER_GAME_START, function (room: Room, player: Player) {
      debuglog(`[Socket.io] message received room ${room.id} from user ${player.id} ${player.name}}`)
      const _room = roomDatabase.getRoom(room.id)
      if (!_room) {
        return
      }
      _room.setNextState('playing')
      io.to(_room.room.id).emit(SocketEvents.ROOM_STATE_CHANGE, _room.room)
    })

    socket.on(SocketEvents.ROOM_NEXT_ROUND, function (room: Room, player: Player) {
      debuglog(`[Socket.io] message received room ${room.id} from user ${player.id} ${player.name}}`)
      const _room = roomDatabase.getRoom(room.id)
      if (!_room) {
        return
      }
      _room.setNextRound()
      io.to(_room.room.id).emit(SocketEvents.ROOM_STATE_CHANGE, _room.room)
    })
  })
}
