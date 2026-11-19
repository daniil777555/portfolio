import { Router } from 'express'
import { _getGameState, createRoom, joinRoom } from '../controllers/gameController.js'
import type { Request, Response } from 'express'

const router = Router()

router.get('/:roomId', async (req: Request<{ roomId: string }>, res: Response) => {
  try {
    if (!await _getGameState(req.params.roomId)) {
      res.status(404).json({ error: 'Room not found' })
      return
    }
    res.json({ roomId: req.params.roomId, exists: true })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Could not check room' })
  }
})

router.post('/', async (req: Request, res: Response) => {
  const userName = req.body?.userName
  if (typeof userName !== 'string' || !userName.trim() || userName.trim().length > 32) {
    res.status(400).json({ error: 'User name must be between 1 and 32 characters' })
    return
  }
  try {
    const roomId = await createRoom()
    const { userId, token } = await joinRoom({ body: { roomId, userName } })
    res.status(201).json({ roomId, userId, token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Could not create room' })
  }
})

router.post('/:roomId/join', async (req: Request<{ roomId: string }>, res: Response) => {
  const userName = req.body?.userName
  if (typeof userName !== 'string' || !userName.trim() || userName.trim().length > 32) {
    res.status(400).json({ error: 'User name must be between 1 and 32 characters' })
    return
  }
  try {
    const { userId, token } = await joinRoom({ body: { roomId: req.params.roomId, userName } })
    res.status(201).json({ userId, token })
  } catch (error) {
    console.error(error)
    if (error instanceof Error && error.message === 'Room not found') {
      res.status(404).json({ error: error.message })
    } else if (error instanceof Error && error.message === 'Room is full') {
      res.status(409).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Could not join room' })
    }
  }
})

export default router