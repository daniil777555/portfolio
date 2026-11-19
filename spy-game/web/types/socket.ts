import type { ErrorPayload, GameState, RoomCredentials } from './game'

export type SocketAuth = RoomCredentials

export interface GameAcknowledgementResult {
  ok: boolean
  error?: string
}

export type GameAcknowledgement = (result: GameAcknowledgementResult) => void

export interface ClientToServerEvents {
  'game:start': (acknowledge: GameAcknowledgement) => void
  'game:answer': (answer: number, acknowledge: GameAcknowledgement) => void
  'game:vote': (spyId: string, acknowledge: GameAcknowledgement) => void
}

export interface ServerToClientEvents {
  'game:state': (state: GameState) => void
  'game:error': (error: ErrorPayload) => void
}
