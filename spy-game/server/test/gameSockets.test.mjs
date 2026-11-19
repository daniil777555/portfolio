import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { after, test } from 'node:test'
import { Server } from 'socket.io'
import { io as connect } from 'socket.io-client'
import { createAdapter } from '@socket.io/redis-adapter'

process.env.TTL_MS = '1200'
process.env.HEARTBEAT_MS = '100'

const { redis, pubClient, subClient } = await import('../dist/redis.js')
const { postgres } = await import('../dist/postgres.js')
const { createRoom, joinRoom, _getGameState } = await import('../dist/controllers/gameController.js')
const { setupGameSockets } = await import('../dist/gameSockets.js')
const { default: app } = await import('../dist/app.js')
const httpServer = createServer(app)
const io = new Server(httpServer, { adapter: createAdapter(pubClient, subClient) })
const stopSweeper = setupGameSockets(io)
await new Promise(resolve => httpServer.listen(0, '127.0.0.1', resolve))
const url = `http://127.0.0.1:${httpServer.address().port}`

after(async () => {
  stopSweeper()
  await new Promise(resolve => io.close(resolve))
  redis.disconnect()
  pubClient.disconnect()
  subClient.disconnect()
  await postgres.end()
})

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
const waitFor = async (condition, message) => {
  const end = Date.now() + 5000
  while (Date.now() < end) {
    const result = await condition()
    if (result) return result
    await delay(20)
  }
  throw new Error(`Timed out waiting for ${message}`)
}

const join = (roomId, userName) => joinRoom({ body: { roomId, userName } })
const openSocket = async (roomId, player) => {
  const socket = connect(url, { autoConnect: false, reconnection: false, auth: { roomId, ...player } })
  const states = []
  socket.on('game:state', state => states.push(state))
  socket.connect()
  await new Promise((resolve, reject) => {
    socket.once('connect', resolve)
    socket.once('connect_error', reject)
  })
  await waitFor(() => states.length > 0, 'initial game state')
  return { socket, states }
}

const cleanup = async (roomId, players, sockets) => {
  for (const { socket } of sockets) socket.disconnect()
  await delay(30)
  if (players.length) await redis.zrem('game:player-deadlines', ...players.map(player => `${roomId}:${player.userId}`))
  await redis.del(
    `room:${roomId}`,
    `room:${roomId}:users`,
    `room:${roomId}:scores`,
    `room:${roomId}:order`,
    `room:${roomId}:participants`,
    `room:${roomId}:spy`,
    `room:${roomId}:question`,
    `room:${roomId}:answers`,
    `room:${roomId}:votes`,
    `room:${roomId}:tokens`,
    `room:${roomId}:asked-questions`,
    ...players.map(player => `room:${roomId}:user:${player.userId}:connections`)
  )
}

test('socket events advance phases, keep the spy private and exclude waiting players', async () => {
  const roomId = await createRoom()
  const players = []
  const sockets = []
  try {
    for (const name of ['One', 'Two', 'Three']) players.push(await join(roomId, name))
    for (const player of players) sockets.push(await openSocket(roomId, player))

    const rejected = connect(url, {
      reconnection: false,
      auth: { roomId, userId: players[0].userId, token: 'wrong' }
    })
    await new Promise(resolve => rejected.once('connect_error', resolve))
    rejected.disconnect()

    assert.equal((await sockets[1].socket.timeout(2000).emitWithAck('game:start')).ok, false)
    assert.equal((await sockets[0].socket.timeout(2000).emitWithAck('game:start')).ok, true)
    await waitFor(() => sockets.every(({ states }) => states.at(-1)?.status === 'Answering'), 'answering broadcast')
    assert.ok(sockets.every(({ states }) => states.at(-1).spyId === null))
    assert.equal(sockets.filter(({ states }) => states.at(-1).role === 'spy').length, 1)
    assert.equal(sockets.find(({ states }) => states.at(-1).role === 'spy').states.at(-1).question, null)

    const waiting = await join(roomId, 'Waiting')
    players.push(waiting)
    sockets.push(await openSocket(roomId, waiting))
    await waitFor(() => sockets.every(({ states }) => states.at(-1)?.users.length === 4), 'waiting player broadcast')
    assert.equal(sockets[3].states.at(-1).role, null)
    assert.equal(sockets[3].states.at(-1).users.find(user => user.id === waiting.userId).waiting, true)
    assert.equal((await sockets[3].socket.timeout(2000).emitWithAck('game:answer', 1)).ok, false)

    for (const [index, answer] of [[0, 1], [0, 2]]) {
      assert.equal((await sockets[index].socket.timeout(2000).emitWithAck('game:answer', answer)).ok, true)
    }
    await waitFor(() => sockets[1].states.at(-1)?.users.find(user => user.id === players[0].userId)?.hasAnswered, 'hidden answer broadcast')
    assert.equal(sockets[1].states.at(-1).users.find(user => user.id === players[0].userId).answer, null)
    assert.equal(sockets[0].states.at(-1).users.find(user => user.id === players[0].userId).answer, 2)
    const lastAnswers = await Promise.all([1, 2].map(index =>
      sockets[index].socket.timeout(2000).emitWithAck('game:answer', index)))
    assert.ok(lastAnswers.every(result => result.ok))
    await waitFor(() => sockets.every(({ states }) => states.at(-1)?.status === 'Voting'), 'voting broadcast')
    assert.equal(sockets[0].states.at(-1).users.find(user => user.id === players[0].userId).answer, 2)
    assert.ok(sockets.every(({ states }) => states.at(-1).spyId === null))
    assert.ok(sockets.find(({ states }) => states.at(-1).role === 'spy').states.at(-1).question)
    assert.equal((await sockets[0].socket.timeout(2000).emitWithAck('game:vote', waiting.userId)).ok, false)

    for (const [voter, target] of [[0, 1], [0, 2]]) {
      assert.equal((await sockets[voter].socket.timeout(2000).emitWithAck('game:vote', players[target].userId)).ok, true)
    }
    const lastVotes = await Promise.all([[1, 0], [2, 0]].map(([voter, target]) =>
      sockets[voter].socket.timeout(2000).emitWithAck('game:vote', players[target].userId)))
    assert.ok(lastVotes.every(result => result.ok))
    await waitFor(() => sockets.every(({ states }) => states.at(-1)?.status === 'Revealing'), 'reveal broadcast')
    const spyId = (await _getGameState(roomId)).spyId
    assert.ok(sockets.every(({ states }) => states.at(-1).spyId === spyId))
    const questionId = await redis.hget(`room:${roomId}`, 'questionId')
    assert.equal(await redis.sismember(`room:${roomId}:asked-questions`, questionId), 1)
    await redis.pexpire(`room:${roomId}:asked-questions`, 250)
    assert.equal((await sockets[0].socket.timeout(2000).emitWithAck('game:start')).ok, false)
    await redis.hset(`room:${roomId}`, 'revealEndsAt', 0)
    assert.equal((await sockets[0].socket.timeout(2000).emitWithAck('game:start')).ok, true)
    assert.ok(await redis.pttl(`room:${roomId}:asked-questions`) > 1000)
    await waitFor(() => sockets[3].states.at(-1)?.status === 'Answering', 'next round')
    assert.ok(sockets[3].states.at(-1).users.every(user => !user.waiting && user.answer === null && user.vote === null))
  } finally {
    await cleanup(roomId, players, sockets)
  }
})

test('disconnect grace, waiting-player expiry and owner transfer preserve the round', async () => {
  const roomId = await createRoom()
  const players = []
  const sockets = []
  try {
    for (const name of ['Owner', 'Next', 'Three', 'Four']) players.push(await join(roomId, name))
    for (const player of players) sockets.push(await openSocket(roomId, player))
    assert.equal((await sockets[0].socket.timeout(2000).emitWithAck('game:start')).ok, true)
    players.push(await join(roomId, 'Waiting'))
    sockets.push(await openSocket(roomId, players[4]))
    sockets[4].socket.disconnect()
    await waitFor(async () => !(await _getGameState(roomId)).users.some(user => user.id === players[4].userId), 'waiting player expiry')
    assert.equal((await _getGameState(roomId)).status, 'Answering')

    sockets.push(await openSocket(roomId, players[0]))
    sockets[0].socket.disconnect()
    await delay(1400)
    assert.equal((await _getGameState(roomId)).ownerId, players[0].userId)
    assert.equal((await _getGameState(roomId)).status, 'Answering')
    sockets.at(-1).socket.disconnect()
    await delay(100)
    sockets.push(await openSocket(roomId, players[0]))
    for (const key of [`room:${roomId}`, `room:${roomId}:users`, `room:${roomId}:participants`, `room:${roomId}:tokens`]) {
      await redis.pexpire(key, 250)
    }
    await delay(400)
    assert.equal((await _getGameState(roomId)).users.length, 4)
    await delay(1400)
    assert.equal((await _getGameState(roomId)).status, 'Answering')
    assert.equal((await _getGameState(roomId)).ownerId, players[0].userId)
    sockets.at(-1).socket.disconnect()
    await waitFor(async () => (await _getGameState(roomId)).status === 'Terminated', 'owner expiry')
    const state = await _getGameState(roomId)
    assert.equal(state.ownerId, players[1].userId)
    assert.equal(await redis.scard(`room:${roomId}:asked-questions`), 0)
    await assert.rejects(openSocket(roomId, players[0]), /Room or player not found|Player connection expired/)
    await waitFor(() => sockets[1].states.at(-1)?.status === 'Terminated', 'termination broadcast')
    assert.equal((await sockets[1].socket.timeout(2000).emitWithAck('game:start')).ok, true)
    await waitFor(() => sockets[1].states.at(-1)?.status === 'Answering', 'restart by new owner')
  } finally {
    await cleanup(roomId, players, sockets)
  }
})

test('joining immediately before room expiration refreshes all existing room keys', async () => {
  const invalid = await fetch(`${url}/game`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({})
  })
  assert.equal(invalid.status, 400)
  const tooLong = await fetch(`${url}/game`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userName: 'x'.repeat(33) })
  })
  assert.equal(tooLong.status, 400)
  const created = await fetch(`${url}/game`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ userName: 'One' })
  })
  assert.equal(created.status, 201)
  const { roomId, userId, token } = await created.json()
  const checked = await fetch(`${url}/game/${roomId}`)
  assert.deepEqual(await checked.json(), { roomId, exists: true })
  assert.equal((await fetch(`${url}/game/missing`)).status, 404)
  const players = []
  try {
    players.push({ userId, token })
    for (const key of [`room:${roomId}`, `room:${roomId}:users`, `room:${roomId}:scores`, `room:${roomId}:order`, `room:${roomId}:tokens`]) {
      await redis.pexpire(key, 150)
    }
    const joined = await fetch(`${url}/game/${roomId}/join`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ userName: 'Two' })
    })
    assert.equal(joined.status, 201)
    players.push(await joined.json())
    for (const key of [`room:${roomId}`, `room:${roomId}:users`, `room:${roomId}:scores`, `room:${roomId}:order`, `room:${roomId}:tokens`]) {
      assert.ok(await redis.pttl(key) > 1000)
    }
    await delay(200)
    assert.equal((await _getGameState(roomId)).users.length, 2)
  } finally {
    await cleanup(roomId, players, [])
  }
})

test('an empty room is not kept alive', async () => {
  const roomId = await createRoom()
  await redis.pexpire(`room:${roomId}`, 150)
  await delay(300)
  assert.equal(await redis.exists(`room:${roomId}`), 0)
})
