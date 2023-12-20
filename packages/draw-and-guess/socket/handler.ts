/**
 * Duplicated from https://github.com/sush1lemon/nuxt-socket.io/tree/main
 */
import type { Server } from 'socket.io'

import { debuglog } from '~/utils/debug'
import { useTurso } from '~/utils/turso'
import * as SocketEvents from '~/constants/socket-events'
import type { Room, Player } from '~/interfaces'
import { roomDatabase } from '~/utils'

export const socketHandler = async (io: Server) => {
  debuglog('✔️ Hello from the socket handler')

  const threads = await getThreads()

  io.on('connection', function (socket) {
    debuglog('socket connected', socket.id)
    socket.on('disconnect', function () {
      debuglog('socket disconnected', socket.id)
    })

    socket.on(SocketEvents.ROOM_JOIN, (room: Room, player: Player) => {
      debuglog(`[Socket.io] joinRoom received room ${room.id} from user ${player.name}(${player.id})`)
      socket.join(room.id)
      roomDatabase.addPlayerToRoom(room.id, player)
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

    socket.on(SocketEvents.PLAYER_PAINT, function (room:Room, user:Player, message) {
      debuglog(`[Socket.io] message received room ${room.id} from user ${user.id} ${user.name}}`)
      const thread = threads.find(t => t.id === room.id)
      if (thread) {
        debuglog(`[Socket.io] emit paint room ${room.id} from user ${user.id} ${user.name}}`)
        io.to(room.id).emit('paint', user, message)
      }
    })
  })
}

const getThreads = async () => {
  const client = useTurso()
  const threadsQ = await client.execute(
    'select * from threads'
  )
  return threadsQ.rows
}
