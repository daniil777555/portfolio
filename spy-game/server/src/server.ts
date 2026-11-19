import app from './app.js'
import config from './config/config.js'
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { pubClient, subClient } from './redis.js'
import { setupGameSockets } from './gameSockets.js'

const server = createServer(app)

const io = new Server(server, {
  connectionStateRecovery: {},
  adapter: createAdapter(pubClient, subClient),
  cors: { origin: config.corsOrigin }
})

setupGameSockets(io)

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})