/**
 * Duplicated from https://github.com/sush1lemon/nuxt-socket.io/tree/main
 */
import type { Server } from 'socket.io'

import { debuglog } from '~/utils/debug'
import { useTurso } from '~/utils/turso'

export const socketHandler = async (io: Server) => {
  debuglog('✔️ Hello from the socket handler')

  const threads = await getThreads()

  io.on('connection', function (socket) {
    debuglog('socket connected', socket.id)
    socket.on('disconnect', function () {
      debuglog('socket disconnected', socket.id)
    })

    socket.on('joinRoom', (room, user) => {
      debuglog(`[Socket.io] joinRoom received room ${room} from user ${user.name}(${user.id})`)
      socket.join(room)
      io.to(room).emit('join', {
        from_id: user.id,
        from_name: user.name,
        system: true,
        content: `${user.name ?? user.id} joined the thread`
      })
    })

    socket.on('leaveRoom', (room, user) => {
      socket.leave(room)
      io.to(room).emit('leave', {
        from_id: user.id,
        from_name: user.name,
        system: true,
        content: `${user.name ?? user.id} left the thread`
      })
    })

    socket.on('paint', function (room, user, message) {
      debuglog(`[Socket.io] message received room ${room} from user ${user.id} ${user.name}}`)
      const thread = threads.find(t => t.id === room)
      if (thread) {
        debuglog(`[Socket.io] emit paint room ${room} from user ${user.id} ${user.name}}`)
        io.to(room).emit('paint', user, message)
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
