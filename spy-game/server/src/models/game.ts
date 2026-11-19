export interface JoinRoomArgs {
  roomId: string
  userName: string
}

export interface Question {
  id: number
  question: string
}

export enum RoomStatus {
  NewGame = 'NewGame',
  Terminated = 'Terminated',
  Answering = 'Answering',
  Voting = 'Voting',
  Revealing = 'Revealing'
}

export interface User {
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
  spyId: string | null
  question: string | null
  users: User[]
}