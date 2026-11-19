import type { RoomCredentials } from '../../types/game'

const apiUrl = process.env.NEXT_PUBLIC_API_URL

async function request(path: string, options?: RequestInit): Promise<unknown> {
  if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL is not configured')
  const response = await fetch(`${apiUrl.replace(/\/$/, '')}${path}`, options)
  const data: unknown = await response.json()
  if (!response.ok) {
    if (typeof data === 'object' && data !== null && 'error' in data && typeof data.error === 'string') {
      throw new Error(data.error)
    }
    throw new Error(`Request failed (${response.status})`)
  }
  return data
}

function credentials(value: unknown): { userId: string, token: string } {
  if (typeof value !== 'object' || value === null ||
      !('userId' in value) || typeof value.userId !== 'string' || !value.userId ||
      !('token' in value) || typeof value.token !== 'string' || !value.token) {
    throw new Error('The server returned invalid credentials')
  }
  return { userId: value.userId, token: value.token }
}

const tokenKey = (roomId: string, userId: string) => `spy-game:${roomId}:${userId}`

export function getToken(roomId: string, userId: string) {
  return sessionStorage.getItem(tokenKey(roomId, userId))
}

function saveCredentials(roomId: string, value: unknown): RoomCredentials {
  const player = credentials(value)
  sessionStorage.setItem(tokenKey(roomId, player.userId), player.token)
  return { roomId, ...player }
}

export async function createRoom(userName: string) {
  const result = await request('/game', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName })
  })
  if (typeof result !== 'object' || result === null || !('roomId' in result) ||
      typeof result.roomId !== 'string' || !result.roomId) {
    throw new Error('The server returned an invalid room ID')
  }
  return saveCredentials(result.roomId, result)
}

export async function checkRoom(roomId: string) {
  await request(`/game/${encodeURIComponent(roomId)}`)
  return { roomId, exists: true }
}

export async function joinRoom(roomId: string, userName: string) {
  const result = await request(`/game/${encodeURIComponent(roomId)}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName })
  })
  return saveCredentials(roomId, result)
}
