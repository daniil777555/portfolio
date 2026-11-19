import express from 'express'
import cors from 'cors'
import config from './config/config.js'
import gameRouter from './routes/game.js'

const app = express()

app.use(cors({ origin: config.corsOrigin }))
app.use(express.json())

// Routes
app.use('/game', gameRouter)

export default app