export type RoomStatus = 'NewGame' | 'Terminated' | 'Answering' | 'Voting' | 'Revealing'

export type PlayerRole = 'spy' | 'player' | null

export interface PlayerCredentials {
  userId: string
  token: string
}

export interface RoomCredentials extends PlayerCredentials {
  roomId: string
}

export interface GameUser {
  id: string
  name: string
  score: number
  roundScore: number
  answer: number | null
  hasAnswered: boolean
  vote: string | null
  waiting: boolean
}

export interface GameState {
  id: string
  ownerId: string | null
  status: RoomStatus
  revision: number
  round: number
  revoteCount: number
  revealEndsAt: number | null
  serverTime: number
  spyId: string | null
  question: string | null
  users: GameUser[]
  role: PlayerRole
}

export interface ErrorPayload {
  error: string
}
