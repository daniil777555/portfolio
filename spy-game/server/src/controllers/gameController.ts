import crypto, { randomInt } from 'crypto'
import { redis } from '../redis.js'
import { postgres } from '../postgres.js'
import type { Request } from 'express'

import config from '../config/config.js'
import { RoomStatus, type GameState, type JoinRoomArgs, type Question } from '../models/game.js'

type GameRequest<T> = Pick<Request<unknown, unknown, T>, 'body'>

// Room data is split by purpose; player deadlines and socket leases are sorted sets.
const roomKey   = (id: string) => `room:${id}`
const usersKey  = (id: string) => `room:${id}:users`
const scoresKey = (id: string) => `room:${id}:scores`
const spyKey = (id: string) => `room:${id}:spy`
const questionKey = (id: string) => `room:${id}:question`
const answersKey = (id: string) => `room:${id}:answers`
const votesKey = (id: string) => `room:${id}:votes`
const orderKey = (id: string) => `room:${id}:order`
const participantsKey = (id: string) => `room:${id}:participants`
const tokensKey = (id: string) => `room:${id}:tokens`
const askedQuestionsKey = (id: string) => `room:${id}:asked-questions`
const deadlinesKey = 'game:player-deadlines'
const roomTtlSec = Math.ceil(config.ttlMs * 5 / 1000)
const revealDurationMs = 10000
const connectionsKey = (roomId: string, userId: string) => `room:${roomId}:user:${userId}:connections`
const playerKey = (roomId: string, userId: string) => `${roomId}:${userId}`
// Lua scripts using this list address these keys by position; keep their indexes in sync.
const roomKeys = (id: string) => [
  roomKey(id),
  usersKey(id),
  scoresKey(id),
  orderKey(id),
  participantsKey(id),
  spyKey(id),
  questionKey(id),
  answersKey(id),
  votesKey(id),
  tokensKey(id),
  askedQuestionsKey(id)
]

/** Create an empty, expiring room and return its ID. */
export const createRoom = async () => {
  const script = `
    if redis.call('EXISTS', KEYS[1]) == 1 then return 0 end
    redis.call('HSET', KEYS[1], 'id', ARGV[1], 'status', 'NewGame', 'ownerId', '', 'nextOrder', 0, 'revision', 0)
    redis.call('EXPIRE', KEYS[1], ARGV[2])
    return 1
  `

  for (let attempt = 0; attempt < 5; attempt++) {
    const id = crypto.randomUUID()
    const ok = await redis.eval(script, 1, roomKey(id), id, roomTtlSec)
    if (ok === 1) return id
  }

  throw new Error('Could not allocate room id')
}

/** Add a player atomically and return their ID and private reconnect token. */
export const joinRoom = async (req: GameRequest<JoinRoomArgs>) => {
  const { roomId, userName } = req.body
  if (typeof roomId !== 'string' || !roomId) throw new Error('Room ID is required')
  if (typeof userName !== 'string' || !userName.trim() || userName.trim().length > 32) throw new Error('User name must be between 1 and 32 characters')
  const JOIN_SCRIPT = `
    if redis.call('EXISTS', KEYS[1]) == 0 then return -1 end
    if redis.call('HLEN', KEYS[2]) >= 10 then return -2 end

    redis.call('HSET', KEYS[2], ARGV[1], ARGV[2])
    redis.call('HINCRBY', KEYS[1], 'revision', 1)
    redis.call('HSETNX', KEYS[3], ARGV[1], 0)
    local order = redis.call('HINCRBY', KEYS[1], 'nextOrder', 1)
    redis.call('ZADD', KEYS[4], order, ARGV[1])
    local time = redis.call('TIME')
    local now = time[1] * 1000 + math.floor(time[2] / 1000)
    redis.call('ZADD', KEYS[12], now + tonumber(ARGV[4]), ARGV[5])
    redis.call('HSET', KEYS[10], ARGV[1], ARGV[6])

    local owner = redis.call('HGET', KEYS[1], 'ownerId')
    if not owner or owner == '' then
      redis.call('HSET', KEYS[1], 'ownerId', ARGV[1])
    end

    for i = 1, 11 do redis.call('EXPIRE', KEYS[i], ARGV[3]) end
    return 1
  `

  const user = {
    id: crypto.randomUUID(),
    name: userName.trim()
  }
  // Only the hash is stored; the caller must keep the original token for reconnects.
  const token = crypto.randomBytes(32).toString('base64url')
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

  const res = await redis.eval(
    JOIN_SCRIPT,
    12,
    ...roomKeys(roomId),
    deadlinesKey,
    user.id,
    JSON.stringify(user),
    roomTtlSec,
    config.ttlMs,
    playerKey(roomId, user.id),
    tokenHash
  )

  if (res === -1) throw new Error('Room not found')
  if (res === -2) throw new Error('Room is full')

  return { userId: user.id, token }
}

/** Start an owner-authorized round with a fixed set of current players. */
export const startRound = async (req: GameRequest<{ roomId: string, userId: string }>) => {
  const { roomId, userId } = req.body
  const question = await _getQuestion()
  const script = `
    if redis.call('EXISTS', KEYS[1]) == 0 then return -1 end
    if redis.call('HGET', KEYS[1], 'ownerId') ~= ARGV[1] then return -2 end
    local status = redis.call('HGET', KEYS[1], 'status')
    if status ~= 'NewGame' and status ~= 'Terminated' and status ~= 'Revealing' then return -3 end
    local players = redis.call('HKEYS', KEYS[2])
    if #players < 3 then return -4 end
    -- Do not start with a player whose deadline passed before the expiry sweep.
    local time = redis.call('TIME')
    local now = time[1] * 1000 + math.floor(time[2] / 1000)
    if status == 'Revealing' and tonumber(redis.call('HGET', KEYS[1], 'revealEndsAt') or '0') > now then return -6 end
    for _, player in ipairs(players) do
      local deadline = redis.call('ZSCORE', KEYS[12], ARGV[5] .. ':' .. player)
      if not deadline or tonumber(deadline) <= now then return -5 end
    end
    redis.call('DEL', KEYS[5], KEYS[6], KEYS[7], KEYS[9])
    ${_clearAnswers()}
    -- Snapshot participants so later joins wait until the next round.
    for _, player in ipairs(players) do redis.call('SADD', KEYS[5], player) end
    redis.call('SET', KEYS[6], players[(tonumber(ARGV[2]) % #players) + 1])
    redis.call('SET', KEYS[7], ARGV[3])
    redis.call('HSET', KEYS[1], 'status', 'Answering', 'questionId', ARGV[6], 'revoteCount', 0, 'roundScores', '{}')
    redis.call('HDEL', KEYS[1], 'revealEndsAt')
    redis.call('HINCRBY', KEYS[1], 'round', 1)
    redis.call('HINCRBY', KEYS[1], 'revision', 1)
    for i = 1, 11 do redis.call('EXPIRE', KEYS[i], ARGV[4]) end
    return 1
  `
  // 2520 is divisible by every allowed player count (3 through 10).
  const result = await redis.eval(
    script,
    12,
    ...roomKeys(roomId),
    deadlinesKey,
    userId,
    randomInt(2520),
    question.question,
    roomTtlSec,
    roomId,
    question.id
  )
  if (result === -1) throw new Error('Room not found')
  if (result === -2) throw new Error('Only the owner can start a round')
  if (result === -3) throw new Error('Round already started')
  if (result === -4) throw new Error('Not enough players to start')
  if (result === -5) throw new Error('Expired players are being removed')
  if (result === -6) throw new Error('The reveal is still in progress')
  return _getGameState(roomId)
}

/** Save or replace a participant's answer and advance when all have answered. */
export const saveAnswer = async (
  req: GameRequest<{ roomId: string, userId: string, answer: number }>
) => {
  const { roomId, userId, answer } = req.body
  if (typeof answer !== 'number' || !Number.isInteger(answer)) throw new Error('Answer must be an integer')

  const script = `
    if redis.call('EXISTS', KEYS[1]) == 0 then return -1 end
    if redis.call('HEXISTS', KEYS[2], ARGV[1]) == 0 then return -2 end
    if redis.call('HGET', KEYS[1], 'status') ~= 'Answering' then return -3 end
    if redis.call('SISMEMBER', KEYS[4], ARGV[1]) == 0 then return -4 end
    if tonumber(ARGV[2]) < 0 or tonumber(ARGV[2]) >= redis.call('SCARD', KEYS[4]) then return -6 end
    -- Prevent phase completion while an expired participant awaits removal.
    local time = redis.call('TIME')
    local now = time[1] * 1000 + math.floor(time[2] / 1000)
    for _, player in ipairs(redis.call('SMEMBERS', KEYS[4])) do
      local deadline = redis.call('ZSCORE', KEYS[5], ARGV[4] .. ':' .. player)
      if not deadline or tonumber(deadline) <= now then return -5 end
    end

    redis.call('HSET', KEYS[3], ARGV[1], ARGV[2])
    redis.call('HINCRBY', KEYS[1], 'revision', 1)
    redis.call('EXPIRE', KEYS[3], ARGV[3])
    if redis.call('HLEN', KEYS[3]) == redis.call('SCARD', KEYS[4]) then
      redis.call('HSET', KEYS[1], 'status', 'Voting')
    end
    return 1
  `

  const result = await redis.eval(
    script,
    5,
    roomKey(roomId),
    usersKey(roomId),
    answersKey(roomId),
    participantsKey(roomId),
    deadlinesKey,
    userId,
    answer,
    roomTtlSec,
    roomId
  )

  if (result === -1) throw new Error('Room not found')
  if (result === -2) throw new Error('Player not found')
  if (result === -3) throw new Error('Round is not accepting answers')
  if (result === -4) throw new Error('Player is waiting for the next round')
  if (result === -5) throw new Error('Expired players are being removed')
  if (result === -6) throw new Error('Answer is outside the allowed range')
}

/** Save or replace a vote for a round participant and reveal after all votes. */
export const saveVote = async (
  req: GameRequest<{ roomId: string, userId: string, spyId: string }>
) => {
  const { roomId, userId, spyId } = req.body
  if (typeof spyId !== 'string' || !spyId) throw new Error('Spy candidate must be a player ID')

  const script = `
    if redis.call('EXISTS', KEYS[1]) == 0 then return -1 end
    if redis.call('HEXISTS', KEYS[2], ARGV[1]) == 0 then return -2 end
    if redis.call('HGET', KEYS[1], 'status') ~= 'Voting' then return -3 end
    if redis.call('SISMEMBER', KEYS[4], ARGV[2]) == 0 then return -4 end
    if redis.call('SISMEMBER', KEYS[4], ARGV[1]) == 0 then return -5 end
    if ARGV[1] == ARGV[2] then return -9 end
    local time = redis.call('TIME')
    local now = time[1] * 1000 + math.floor(time[2] / 1000)
    for _, player in ipairs(redis.call('SMEMBERS', KEYS[4])) do
      local deadline = redis.call('ZSCORE', KEYS[5], ARGV[4] .. ':' .. player)
      if not deadline or tonumber(deadline) <= now then return -6 end
    end

    local lastVote = redis.call('HEXISTS', KEYS[3], ARGV[1]) == 0
      and redis.call('HLEN', KEYS[3]) + 1 == redis.call('SCARD', KEYS[4])
    local counts = {}
    local tied = false
    if lastVote then
      for _, candidate in ipairs(redis.call('HVALS', KEYS[3])) do
        counts[candidate] = (counts[candidate] or 0) + 1
      end
      counts[ARGV[2]] = (counts[ARGV[2]] or 0) + 1
      local highest = 0
      for _, count in pairs(counts) do
        if count > highest then highest = count; tied = false
        elseif count == highest then tied = true end
      end
    end
    local questionId = redis.call('HGET', KEYS[1], 'questionId')
    if lastVote and not tied and not questionId then
      if ARGV[5] == '' or redis.call('GET', KEYS[7]) ~= ARGV[6] then return -7 end
      questionId = ARGV[5]
    end
    local roomTtl = redis.call('PTTL', KEYS[1])
    if lastVote and not tied and roomTtl <= 0 then return -8 end
    local spy = redis.call('GET', KEYS[9])
    if lastVote and not tied and not spy then return -10 end
    redis.call('HSET', KEYS[3], ARGV[1], ARGV[2])
    redis.call('HINCRBY', KEYS[1], 'revision', 1)
    redis.call('EXPIRE', KEYS[3], ARGV[3])
    if lastVote and tied then
      redis.call('DEL', KEYS[3])
      redis.call('HINCRBY', KEYS[1], 'revoteCount', 1)
    elseif lastVote then
      local participants = redis.call('SMEMBERS', KEYS[4])
      local spyVotes = counts[spy] or 0
      local roundScores = {}
      for _, player in ipairs(participants) do
        local points = 0
        if player == spy then
          if spyVotes * 2 < #participants then points = 2
          elseif spyVotes * 2 == #participants then points = 1 end
        elseif redis.call('HGET', KEYS[3], player) == spy then
          points = 1
        end
        roundScores[player] = points
        redis.call('HINCRBY', KEYS[8], player, points)
      end
      redis.call('SADD', KEYS[6], questionId)
      redis.call('PEXPIRE', KEYS[6], roomTtl)
      redis.call('HSET', KEYS[1], 'status', 'Revealing', 'questionId', questionId,
        'roundScores', cjson.encode(roundScores), 'revealEndsAt', now + tonumber(ARGV[7]))
    end
    return 1
  `

  const submitVote = (questionId: number | string = '', question: string = '') => redis.eval(
    script,
    9,
    roomKey(roomId),
    usersKey(roomId),
    votesKey(roomId),
    participantsKey(roomId),
    deadlinesKey,
    askedQuestionsKey(roomId),
    questionKey(roomId),
    scoresKey(roomId),
    spyKey(roomId),
    userId,
    spyId,
    roomTtlSec,
    roomId,
    questionId,
    question,
    revealDurationMs
  )

  let result = await submitVote()
  if (result === -7) {
    // Rounds started before question IDs were stored only contain the question text.
    const text = await redis.get(questionKey(roomId))
    if (!text) throw new Error('Round question ID is missing')
    const match = await postgres.query<Pick<Question, 'id'>>('SELECT id FROM questions WHERE question = $1', [text])
    if (!match.rows[0]) throw new Error('Round question ID is missing')
    result = await submitVote(match.rows[0].id, text)
  }

  if (result === -1) throw new Error('Room not found')
  if (result === -2) throw new Error('Player not found')
  if (result === -3) throw new Error('Round is not accepting votes')
  if (result === -4) throw new Error('Spy candidate not found')
  if (result === -5) throw new Error('Player is waiting for the next round')
  if (result === -6) throw new Error('Expired players are being removed')
  if (result === -7) throw new Error('Round question ID is missing')
  if (result === -8) throw new Error('Room expiry is invalid')
  if (result === -9) throw new Error('Players cannot vote for themselves')
  if (result === -10) throw new Error('Round spy is missing')
}

/** Read a consistent room snapshot, including the private spy ID; callers must filter it. */
export const _getGameState = async (roomId: string): Promise<GameState | null> => {
  const res = await redis
    .multi()
    .hgetall(roomKey(roomId))
    .hgetall(usersKey(roomId))
    .hgetall(scoresKey(roomId))
    .get(spyKey(roomId))
    .get(questionKey(roomId))
    .hgetall(answersKey(roomId))
    .hgetall(votesKey(roomId))
    .smembers(participantsKey(roomId))
    .exec()

  if (!res) throw new Error('Could not read game state')

  const [game, users, scores, spyId, question, answers, votes, participants] = res.map(([err, val]) => {
    if (err) throw err
    return val
  }) as [Record<string, string>, Record<string, string>, Record<string, string>, string | null, string | null, Record<string, string>, Record<string, string>, string[]]

  if (!game.id) return null

  const status = Object.values(RoomStatus).find(value => value === game.status)
  if (!status) throw new Error('Invalid room status')
  const roundScores = JSON.parse(game.roundScores || '{}') as Record<string, number>

  return {
    id: game.id,
    ownerId: game.ownerId || null,
    status,
    revision: Number(game.revision),
    round: Number(game.round || 0),
    revoteCount: Number(game.revoteCount || 0),
    revealEndsAt: game.revealEndsAt ? Number(game.revealEndsAt) : null,
    spyId: spyId ?? null,
    question: question ?? null,
    users: Object.entries(users).map(([id, raw]) => {
      const user: unknown = JSON.parse(raw)
      if (typeof user !== 'object' || user === null ||
          !('id' in user) || typeof user.id !== 'string' ||
          !('name' in user) || typeof user.name !== 'string') {
        throw new Error('Invalid player data')
      }

      return {
        ...user,
        id: user.id,
        name: user.name,
        score: Number(scores[id] ?? 0),
        roundScore: roundScores[id] ?? 0,
        answer: answers[id] === undefined ? null : Number(answers[id]),
        hasAnswered: answers[id] !== undefined,
        vote: votes[id] ?? null,
        waiting: [RoomStatus.Answering, RoomStatus.Voting, RoomStatus.Revealing].includes(status)
          && !participants.includes(id)
      }
    })
  }
}

const _getQuestion = async (): Promise<Question> => {
  const result = await postgres.query<Question>('SELECT id, question FROM questions ORDER BY RANDOM() LIMIT 1')
  const question = result.rows[0]
  if (!question) throw new Error('No questions available')
  return question
}

export const generateQuestion = () => {
  // If this becomes an actual project, query an AI service to generate a question.
}

// The reset runs in the round-start script so answers cannot race with it.
const _clearAnswers = () => 'redis.call(\'DEL\', KEYS[8])'

/**
 * Authenticate a new socket when given a token, or renew an existing socket lease.
 * Active leases also renew room keys; an expired player or lease cannot be revived.
 */
export const _heartbeat = async (roomId: string, userId: string, socketId: string, token?: string) => {
  const script = `
    if redis.call('EXISTS', KEYS[1]) == 0 or redis.call('HEXISTS', KEYS[2], ARGV[1]) == 0 then return -1 end
    local time = redis.call('TIME')
    local now = time[1] * 1000 + math.floor(time[2] / 1000)
    local deadline = redis.call('ZSCORE', KEYS[12], ARGV[2])
    if not deadline or tonumber(deadline) <= now then return -2 end
    local lease = redis.call('ZSCORE', KEYS[13], ARGV[3])
    if ARGV[4] ~= '' then
      if redis.call('HGET', KEYS[10], ARGV[1]) ~= ARGV[4] then return -3 end
    elseif not lease or tonumber(lease) <= now then return -2 end
    redis.call('ZREMRANGEBYSCORE', KEYS[13], '-inf', now)
    redis.call('ZADD', KEYS[13], now + tonumber(ARGV[5]), ARGV[3])
    -- The player remains present until the last active socket lease expires.
    local latest = redis.call('ZREVRANGE', KEYS[13], 0, 0, 'WITHSCORES')
    redis.call('ZADD', KEYS[12], latest[2], ARGV[2])
    redis.call('EXPIRE', KEYS[13], ARGV[6])
    for i = 1, 11 do redis.call('EXPIRE', KEYS[i], ARGV[6]) end
    return 1
  `
  const result = await redis.eval(
    script,
    13,
    ...roomKeys(roomId),
    deadlinesKey,
    connectionsKey(roomId, userId),
    userId,
    playerKey(roomId, userId),
    socketId,
    token ? crypto.createHash('sha256').update(token).digest('hex') : '',
    config.ttlMs,
    roomTtlSec
  )
  if (result === -1) throw new Error('Room or player not found')
  if (result === -2) throw new Error('Player connection expired')
  if (result === -3) throw new Error('Invalid player token')
}

/** Remove one socket lease, granting a grace period only when no sockets remain. */
export const disconnectPlayer = async (roomId: string, userId: string, socketId: string) => {
  const script = `
    if redis.call('ZREM', KEYS[2], ARGV[2]) == 0 then return 0 end
    local time = redis.call('TIME')
    local now = time[1] * 1000 + math.floor(time[2] / 1000)
    redis.call('ZREMRANGEBYSCORE', KEYS[2], '-inf', now)
    local latest = redis.call('ZREVRANGE', KEYS[2], 0, 0, 'WITHSCORES')
    local deadline = latest[2] or (now + tonumber(ARGV[3]))
    if redis.call('ZSCORE', KEYS[1], ARGV[1]) then
      redis.call('ZADD', KEYS[1], deadline, ARGV[1])
    end
    return 1
  `
  await redis.eval(script, 2, deadlinesKey, connectionsKey(roomId, userId), playerKey(roomId, userId), socketId, config.ttlMs)
}

/**
 * Remove expired players, terminate affected active rounds and transfer ownership.
 * Return the changed room IDs so their connected players can receive fresh state.
 */
export const expirePlayers = async (): Promise<string[]> => {
  const changedRooms = new Set<string>()
  const script = `
      local time = redis.call('TIME')
      local now = time[1] * 1000 + math.floor(time[2] / 1000)
      local deadline = redis.call('ZSCORE', KEYS[12], ARGV[1])
      if not deadline or tonumber(deadline) > now then return 0 end
      -- Recheck leases atomically: a player may have reconnected since the scan.
      redis.call('ZREMRANGEBYSCORE', KEYS[13], '-inf', now)
      local latest = redis.call('ZREVRANGE', KEYS[13], 0, 0, 'WITHSCORES')
      if latest[2] then
        redis.call('ZADD', KEYS[12], latest[2], ARGV[1])
        return 0
      end
      redis.call('ZREM', KEYS[12], ARGV[1])
      redis.call('DEL', KEYS[13])
      if redis.call('EXISTS', KEYS[1]) == 0 then return 0 end
      if redis.call('HDEL', KEYS[2], ARGV[2]) == 0 then return 0 end
      redis.call('HINCRBY', KEYS[1], 'revision', 1)
      redis.call('HDEL', KEYS[3], ARGV[2])
      redis.call('ZREM', KEYS[4], ARGV[2])
      redis.call('HDEL', KEYS[8], ARGV[2])
      redis.call('HDEL', KEYS[9], ARGV[2])
      redis.call('HDEL', KEYS[10], ARGV[2])
      local status = redis.call('HGET', KEYS[1], 'status')
      -- Waiting players are not part of the current round and do not terminate it.
      if (status == 'Answering' or status == 'Voting') and redis.call('SISMEMBER', KEYS[5], ARGV[2]) == 1 then
        redis.call('HSET', KEYS[1], 'status', 'Terminated')
      end
      if redis.call('HGET', KEYS[1], 'ownerId') == ARGV[2] then
        -- The order set records join order, so its first member becomes owner.
        local nextOwner = redis.call('ZRANGE', KEYS[4], 0, 0)
        redis.call('HSET', KEYS[1], 'ownerId', nextOwner[1] or '')
      end
      return 1
  `
  // Use Redis time for deadlines across servers and drain expired players in batches.
  while (true) {
    const [seconds, microseconds] = await redis.time()
    const now = Number(seconds) * 1000 + Math.floor(Number(microseconds) / 1000)
    const due = await redis.zrangebyscore(deadlinesKey, '-inf', now, 'LIMIT', 0, 100)
    for (const player of due) {
      const [roomId, userId] = player.split(':')
      const result = await redis.eval(
        script,
        13,
        ...roomKeys(roomId),
        deadlinesKey,
        connectionsKey(roomId, userId),
        player,
        userId
      )
      if (result === 1) changedRooms.add(roomId)
    }
    if (due.length < 100) break
  }
  return [...changedRooms]
}