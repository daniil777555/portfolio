import { Pool } from 'pg'
import config from './config/config.js'

export const postgres = new Pool(config.postgres)

postgres.on('error', error => {
  console.error('PostgreSQL connection error:', error)
})
