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
import { UnauthorizedError } from './api/routes/utils.js'
import { verifyToken } from '@clerk/express'
import { inspect } from 'node:util'

export * from './api/index.js'

dotenv.config()

const port = env.PORT || 5001
const app = createServerApp()
const server = createServer(app)

export const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server, {
  transports: ['websocket'],
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

io.use(async (socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    // No token provided, refuse connection
    return next(new UnauthorizedError('Unauthorized (missing_token)'))
  }

  try {
    const claims = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
    })
    socket.data.userId = claims.sub
    next()
  } catch (error) {
    // Handle any errors that occur during token validation
    console.error('Token validation error:', error)
    return next(new UnauthorizedError('Unauthorized (token_validation_error)'))
  }
})
io.on('connection', (socket) => {
  socket.on('disconnect', () => {})
})

server.listen(port, () => {
  console.log(`api running on ${port}`)
})
