import type { ErrorPayload, PlayerCredentials, RoomCredentials } from './game'

export interface CreateRoomRequest {
  userName: string
}

export type CreateRoomResponse = RoomCredentials

export interface JoinRoomParams {
  roomId: string
}

export type JoinRoomRequest = CreateRoomRequest
export type JoinRoomResponse = PlayerCredentials

export interface GameApiSchema {
  checkRoom: {
    method: 'GET'
    path: '/game/:roomId'
    params: JoinRoomParams
    response: { roomId: string, exists: true }
    error: ErrorPayload
  }
  createRoom: {
    method: 'POST'
    path: '/game'
    body: CreateRoomRequest
    response: CreateRoomResponse
    error: ErrorPayload
  }
  joinRoom: {
    method: 'POST'
    path: '/game/:roomId/join'
    params: JoinRoomParams
    body: JoinRoomRequest
    response: JoinRoomResponse
    error: ErrorPayload
  }
}
