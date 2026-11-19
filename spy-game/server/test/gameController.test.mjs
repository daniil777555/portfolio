import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createRoom, joinRoom, saveAnswer, saveVote, startRound, _getGameState } from '../dist/controllers/gameController.js'
import { pubClient, redis, subClient } from '../dist/redis.js'
import { postgres } from '../dist/postgres.js'

after(async () => {
  redis.disconnect()
  pubClient.disconnect()
  subClient.disconnect()
  await postgres.end()
})

test('answers can be changed per player and are reset for a new round', async () => {
  let roomId
  try {
    roomId = await createRoom()
    const players = (await Promise.all(['One', 'Two', 'Three'].map(userName =>
      joinRoom({ body: { roomId, userName } })))).map(user => user.userId)
    const ownerId = (await _getGameState(roomId)).ownerId
    const submit = (userId, answer) => saveAnswer({ body: { roomId, userId, answer } })

    await assert.rejects(submit(players[0], 1), /not accepting answers/)
    await assert.rejects(submit(players[0], '1'), /integer/)
    await assert.rejects(submit(players[0], Infinity), /integer/)
    await assert.rejects(saveAnswer({ body: { roomId: 'missing', userId: players[0], answer: 1 } }), /Room not found/)

    const count = await postgres.query('SELECT COUNT(*) AS count FROM questions')
    assert.ok(Number(count.rows[0].count) >= 20)
    const round = await startRound({ body: { roomId, userId: ownerId } })
    const questionId = await redis.hget(`room:${roomId}`, 'questionId')
    const question = await postgres.query('SELECT question FROM questions WHERE id = $1', [questionId])
    assert.equal(round.question, question.rows[0].question)
    assert.equal(await redis.scard(`room:${roomId}:asked-questions`), 0)
    await assert.rejects(submit('missing', 1), /Player not found/)
    await assert.rejects(submit(players[0], 3), /allowed range/)
    await assert.rejects(submit(players[1], -1), /allowed range/)
    await submit(players[0], 2)
    await submit(players[1], 1)
    await submit(players[0], 0)

    const state = await _getGameState(roomId)
    assert.deepEqual(
      Object.fromEntries(state.users.map(user => [user.id, user.answer])),
      { [players[0]]: 0, [players[1]]: 1, [players[2]]: null }
    )
    assert.ok(await redis.ttl(`room:${roomId}:answers`) > 0)

    await assert.rejects(startRound({ body: { roomId, userId: ownerId } }), /Round already started/)
    assert.equal((await _getGameState(roomId)).users.find(user => user.id === players[0]).answer, 0)

    await redis.hset(`room:${roomId}`, 'status', 'Terminated')
    assert.equal(await redis.scard(`room:${roomId}:asked-questions`), 0)
    const nextRound = await startRound({ body: { roomId, userId: ownerId } })
    assert.ok(nextRound.users.every(user => user.answer === null))
    await submit(players[0], 2)
    assert.equal((await _getGameState(roomId)).users.find(user => user.id === players[0]).answer, 2)
  } finally {
    if (roomId) {
      const users = await redis.hkeys(`room:${roomId}:users`)
      if (users.length) await redis.zrem('game:player-deadlines', ...users.map(id => `${roomId}:${id}`))
      await redis.del(
        `room:${roomId}`,
        `room:${roomId}:users`,
        `room:${roomId}:scores`,
        `room:${roomId}:spy`,
        `room:${roomId}:question`,
        `room:${roomId}:answers`,
        `room:${roomId}:order`,
        `room:${roomId}:tokens`,
        `room:${roomId}:participants`,
        `room:${roomId}:asked-questions`
      )
    }
  }
})

test('votes can be changed per player and are reset for a new round', async t => {
  let roomId
  let otherRoomId
  try {
    roomId = await createRoom()
    otherRoomId = await createRoom()
    const players = (await Promise.all(['One', 'Two', 'Three'].map(userName =>
      joinRoom({ body: { roomId, userName } })))).map(user => user.userId)
    const ownerId = (await _getGameState(roomId)).ownerId
    const { userId: otherPlayer } = await joinRoom({ body: { roomId: otherRoomId, userName: 'Other' } })
    const vote = (userId, spyId) => saveVote({ body: { roomId, userId, spyId } })

    await assert.rejects(vote(players[0], players[1]), /not accepting votes/)
    await assert.rejects(vote(players[0], ''), /player ID/)
    await assert.rejects(vote(players[0], 123), /player ID/)
    await assert.rejects(saveVote({ body: { roomId: 'missing', userId: players[0], spyId: players[1] } }), /Room not found/)

    await startRound({ body: { roomId, userId: ownerId } })
    for (const userId of players) await saveAnswer({ body: { roomId, userId, answer: 1 } })
    await assert.rejects(vote(otherPlayer, players[1]), /Player not found/)
    await assert.rejects(vote(players[0], otherPlayer), /Spy candidate not found/)
    await vote(players[0], players[1])
    await vote(players[1], players[0])
    await vote(players[0], players[2])

    const state = await _getGameState(roomId)
    assert.deepEqual(
      Object.fromEntries(state.users.map(user => [user.id, user.vote])),
      { [players[0]]: players[2], [players[1]]: players[0], [players[2]]: null }
    )
    assert.ok(await redis.ttl(`room:${roomId}:votes`) > 0)

    await assert.rejects(startRound({ body: { roomId, userId: ownerId } }), /Round already started/)
    assert.equal((await _getGameState(roomId)).users.find(user => user.id === players[0]).vote, players[2])

    await redis.hset(`room:${roomId}`, 'status', 'Terminated')
    const nextRound = await startRound({ body: { roomId, userId: ownerId } })
    assert.ok(nextRound.users.every(user => user.vote === null))
    for (const userId of players) await saveAnswer({ body: { roomId, userId, answer: 1 } })
    await vote(players[0], players[1])
    assert.equal((await _getGameState(roomId)).users.find(user => user.id === players[0]).vote, players[1])
    const questionId = await redis.hget(`room:${roomId}`, 'questionId')
    assert.equal(await redis.scard(`room:${roomId}:asked-questions`), 0)
    await vote(players[1], players[0])
    await vote(players[2], players[0])
    assert.equal((await _getGameState(roomId)).status, 'Revealing')
    assert.deepEqual(await redis.smembers(`room:${roomId}:asked-questions`), [questionId])
    assert.ok(await redis.ttl(`room:${roomId}:asked-questions`) > 0)
    const [[, historyTtl], [, roomTtl]] = await redis.multi()
      .pttl(`room:${roomId}:asked-questions`)
      .pttl(`room:${roomId}`)
      .exec()
    assert.ok(historyTtl <= roomTtl)
    const question = await postgres.query('SELECT id, question FROM questions WHERE id = $1', [questionId])
    t.mock.method(postgres, 'query', async () => ({ rows: question.rows }))
    await assert.rejects(startRound({ body: { roomId, userId: ownerId } }), /reveal is still in progress/)
    await redis.hset(`room:${roomId}`, 'revealEndsAt', 0)
    const repeatedRound = await startRound({ body: { roomId, userId: ownerId } })
    assert.equal(repeatedRound.question, question.rows[0].question)
    assert.equal(await redis.hget(`room:${roomId}`, 'questionId'), questionId)
  } finally {
    for (const id of [roomId, otherRoomId]) {
      if (!id) continue
      const users = await redis.hkeys(`room:${id}:users`)
      if (users.length) await redis.zrem('game:player-deadlines', ...users.map(userId => `${id}:${userId}`))
      await redis.del(
        `room:${id}`,
        `room:${id}:users`,
        `room:${id}:scores`,
        `room:${id}:spy`,
        `room:${id}:question`,
        `room:${id}:answers`,
        `room:${id}:votes`,
        `room:${id}:order`,
        `room:${id}:tokens`,
        `room:${id}:participants`,
        `room:${id}:asked-questions`
      )
    }
  }
})

test('round start fails without changing room state if no questions are available', async t => {
  const roomId = await createRoom()
  let users = []
  try {
    users = await Promise.all(['One', 'Two', 'Three'].map(userName => joinRoom({ body: { roomId, userName } })))
    const ownerId = (await _getGameState(roomId)).ownerId
    const query = t.mock.method(postgres, 'query', async () => ({ rows: [] }))
    await assert.rejects(startRound({ body: { roomId, userId: ownerId } }), /No questions available/)
    query.mock.mockImplementation(async () => { throw new Error('Database unavailable') })
    await assert.rejects(startRound({ body: { roomId, userId: ownerId } }), /Database unavailable/)
    const state = await _getGameState(roomId)
    assert.equal(state.status, 'NewGame')
    assert.equal(state.question, null)
  } finally {
    if (users.length) await redis.zrem('game:player-deadlines', ...users.map(user => `${roomId}:${user.userId}`))
    await redis.del(
      `room:${roomId}`,
      `room:${roomId}:users`,
      `room:${roomId}:scores`,
      `room:${roomId}:order`,
      `room:${roomId}:tokens`
    )
  }
})

test('a round started before question IDs were stored can still finish', async () => {
  const roomId = await createRoom()
  let players = []
  try {
    players = await Promise.all(['One', 'Two', 'Three'].map(userName => joinRoom({ body: { roomId, userName } })))
    const ownerId = (await _getGameState(roomId)).ownerId
    await startRound({ body: { roomId, userId: ownerId } })
    await redis.hdel(`room:${roomId}`, 'questionId')
    await redis.set(`room:${roomId}:question`, 'How many players read more?', 'KEEPTTL')
    for (const player of players) {
      await saveAnswer({ body: { roomId, userId: player.userId, answer: 1 } })
    }
    const vote = (player, candidate = players[0]) => saveVote({ body: { roomId, userId: player.userId, spyId: candidate.userId } })
    await assert.rejects(vote(players[0]), /cannot vote for themselves/)
    await vote(players[0], players[1])
    await vote(players[1])
    await redis.persist(`room:${roomId}`)
    await assert.rejects(vote(players[2]), /Room expiry is invalid/)
    assert.equal((await _getGameState(roomId)).status, 'Voting')
    await redis.expire(`room:${roomId}`, 60)
    await vote(players[2])

    const expected = await postgres.query('SELECT id FROM questions WHERE question = $1', ['How many players read more?'])
    assert.equal((await _getGameState(roomId)).status, 'Revealing')
    assert.deepEqual(await redis.smembers(`room:${roomId}:asked-questions`), [String(expected.rows[0].id)])
  } finally {
    if (players.length) await redis.zrem('game:player-deadlines', ...players.map(player => `${roomId}:${player.userId}`))
    await redis.del(
      `room:${roomId}`,
      `room:${roomId}:users`,
      `room:${roomId}:scores`,
      `room:${roomId}:spy`,
      `room:${roomId}:question`,
      `room:${roomId}:answers`,
      `room:${roomId}:votes`,
      `room:${roomId}:order`,
      `room:${roomId}:tokens`,
      `room:${roomId}:participants`,
      `room:${roomId}:asked-questions`
    )
  }
})

test('game state rejects invalid stored status and player data', async () => {
  const roomId = await createRoom()
  let userId
  try {
    const player = await joinRoom({ body: { roomId, userName: 'Player' } })
    userId = player.userId

    await redis.hset(`room:${roomId}`, 'status', 'invalid')
    await assert.rejects(_getGameState(roomId), /Invalid room status/)

    await redis.hset(`room:${roomId}`, 'status', 'NewGame')
    await redis.hset(`room:${roomId}:users`, userId, JSON.stringify({ id: userId, name: 123 }))
    await assert.rejects(_getGameState(roomId), /Invalid player data/)
  } finally {
    if (userId) await redis.zrem('game:player-deadlines', `${roomId}:${userId}`)
    await redis.del(
      `room:${roomId}`,
      `room:${roomId}:users`,
      `room:${roomId}:scores`,
      `room:${roomId}:order`,
      `room:${roomId}:tokens`
    )
  }
})

test('ties require a new vote and scores are awarded only after a decisive result', async () => {
  const roomId = await createRoom()
  const players = []
  try {
    for (const userName of ['Spy', 'Two', 'Three', 'Four']) {
      players.push((await joinRoom({ body: { roomId, userName } })).userId)
    }
    await startRound({ body: { roomId, userId: players[0] } })
    await redis.set(`room:${roomId}:spy`, players[0], 'KEEPTTL')
    for (const userId of players) await saveAnswer({ body: { roomId, userId, answer: 0 } })
    const vote = (from, to) => saveVote({ body: { roomId, userId: players[from], spyId: players[to] } })
    for (const [from, to] of [[0, 1], [1, 0], [2, 0], [3, 1]]) await vote(from, to)
    let state = await _getGameState(roomId)
    assert.equal(state.status, 'Voting')
    assert.equal(state.revoteCount, 1)
    assert.ok(state.users.every(user => user.vote === null && user.score === 0))
    for (const [from, to] of [[0, 1], [1, 0], [2, 0], [3, 0]]) await vote(from, to)
    state = await _getGameState(roomId)
    assert.equal(state.status, 'Revealing')
    assert.deepEqual(players.map(id => state.users.find(user => user.id === id).roundScore), [0, 1, 1, 1])
    assert.deepEqual(players.map(id => state.users.find(user => user.id === id).score), [0, 1, 1, 1])
    await assert.rejects(vote(3, 0), /not accepting votes/)
  } finally {
    if (players.length) await redis.zrem('game:player-deadlines', ...players.map(id => `${roomId}:${id}`))
    await redis.del(...['', ':users', ':scores', ':spy', ':question', ':answers', ':votes', ':order', ':tokens', ':participants', ':asked-questions'].map(suffix => `room:${roomId}${suffix}`))
  }
})

test('spy earns two points for a minority and one for half the votes', async () => {
  for (const [targets, expected] of [[[1, 2, 1, 1], 2], [[1, 0, 0, 2], 1]]) {
    const roomId = await createRoom()
    const players = []
    try {
      for (const userName of ['Spy', 'Two', 'Three', 'Four']) {
        players.push((await joinRoom({ body: { roomId, userName } })).userId)
      }
      await startRound({ body: { roomId, userId: players[0] } })
      await redis.set(`room:${roomId}:spy`, players[0], 'KEEPTTL')
      for (const userId of players) await saveAnswer({ body: { roomId, userId, answer: 0 } })
      for (const [index, target] of targets.entries()) {
        await saveVote({ body: { roomId, userId: players[index], spyId: players[target] } })
      }
      const state = await _getGameState(roomId)
      assert.equal(state.status, 'Revealing')
      assert.equal(state.users.find(user => user.id === players[0]).roundScore, expected)
    } finally {
      if (players.length) await redis.zrem('game:player-deadlines', ...players.map(id => `${roomId}:${id}`))
      await redis.del(...['', ':users', ':scores', ':spy', ':question', ':answers', ':votes', ':order', ':tokens', ':participants', ':asked-questions'].map(suffix => `room:${roomId}${suffix}`))
    }
  }
})
