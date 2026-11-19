import { Redis } from 'ioredis'
import config from './config/config.js'

export const redis = new Redis({ port: config.redisPort })
export const pubClient = new Redis({ port: config.redisPort })
export const subClient = pubClient.duplicate()