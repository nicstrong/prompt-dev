import dotenv from 'dotenv'
import { createServerApp } from './server.js'
import { env } from './env.js'
import { Server } from 'socket.io'
import { createServer } from 'node:http'
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from '@prompt-dev/shared-types'

export * from './api/index.js'

dotenv.config()

const port = env.PORT || 5001
const app = createServerApp()
const server = createServer(app)

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server)

io.use((socket, next) => {
  const token = socket.handshake.auth.token
  console.log('Token:', token)
  // if (isValidToken(token)) {
  //   // Token is valid, proceed with connection
  //   next()
  // } else {
  //   // Token is invalid, refuse connection
  //   next(new Error('Invalid token'))
  // }
})
io.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(port, () => {
  console.log(`api running on ${port}`)
})
