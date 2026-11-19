import dotenv from 'dotenv'

dotenv.config()

interface Config {
  port: number
  redisPort: number
  nodeEnv: string
  corsOrigin: Array<string | RegExp>
  heartbeatMs: number
  ttlMs: number
  postgres: {
    host: string
    port: number
    user: string
    database: string
    password: string | undefined
  }
}

const config: Config = {
  port: Number(process.env.PORT) || 3001,
  redisPort: Number(process.env.REDIS_PORT) || 6379,
  nodeEnv: process.env.NODE_ENV || 'dev',
  corsOrigin: [
    ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
    /^https?:\/\/localhost(?::\d+)?$/i
  ],
  heartbeatMs: Number(process.env.HEARTBEAT_MS) || 20000,
  ttlMs: Number(process.env.TTL_MS) || 60000,
  postgres: {
    host: process.env.POSTGRES_HOST || '127.0.0.1',
    port: Number(process.env.POSTGRES_PORT) || 5432,
    user: process.env.POSTGRES_USER || 'spy_game',
    database: process.env.POSTGRES_DB || 'spy_game',
    password: process.env.POSTGRES_PASSWORD
  }
}

export default config