/**
 * Duplicated from https://github.com/sush1lemon/nuxt-socket.io/tree/main
 */
import type { Server } from 'socket.io'

import { debuglog } from '~/utils/debug'
import { useTurso } from '~/utils/turso'
import * as SocketEvents from '~/constants/socket-events'
import type { Room, User } from '~/interfaces'

export const socketHandler = async (io: Server) => {
  debuglog('✔️ Hello from the socket handler')

  const threads = await getThreads()

  io.on('connection', function (socket) {
    debuglog('socket connected', socket.id)
    socket.on('disconnect', function () {
      debuglog('socket disconnected', socket.id)
    })

    socket.on(SocketEvents.JOIN_ROOM, (room:Room, user:User) => {
      debuglog(`[Socket.io] joinRoom received room ${room.id} from user ${user.name}(${user.id})`)
      socket.join(room.id)
      io.to(room.id).emit(SocketEvents.PLAYER_JOIN, {
        from_id: user.id,
        from_name: user.name,
        system: true,
        content: `${user.name ?? user.id} joined the thread`
      })
    })

    socket.on(SocketEvents.LEAVE_ROOM, (room: Room, user: User) => {
      socket.leave(room.id)
      io.to(room.id).emit(SocketEvents.PLAYER_LEAVE, {
        from_id: user.id,
        from_name: user.name,
        system: true,
        content: `${user.name ?? user.id} left the thread`
      })
    })

    socket.on(SocketEvents.PAINT, function (room:Room, user:User, message) {
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
