import dotenv from 'dotenv'
import { createServer } from './server.js'
import { env } from './env.js'

export * from './api/index.js'

dotenv.config()

const port = env.PORT || 5001
const server = createServer()

server.listen(port, () => {
  console.log(`api running on ${port}`)
})
