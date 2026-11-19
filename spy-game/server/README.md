# Game server protocol

## Setup

If needed, copy `.env.example` to `.env` and set `POSTGRES_PASSWORD` to a private
password. `CORS_ORIGIN` is optional; localhost origins are already allowed.
Start the server with `npm run dev`
or `npm start`; Docker Compose starts Redis and PostgreSQL and waits for
PostgreSQL to be ready. PostgreSQL data is kept in a Docker volume. The initial
database setup creates the `questions` table and seeds 20 questions.

The initialization SQL runs automatically only on a new PostgreSQL volume. To
apply the idempotent schema and seed to an existing volume, run from `server/`:

```sh
docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' < db/init.sql
```

Each round selects a random PostgreSQL question. On reaching `Revealing`, its ID
is recorded in a room-scoped Redis set until the room expires. Terminated rounds
are not recorded. This history is not used to filter future questions.

## API

`POST /game` accepts `{ "userName": "..." }` and returns `{ roomId, userId, token }`.
`POST /game/:roomId/join` accepts the same body and returns `{ userId, token }`.
`GET /game/:roomId` checks whether a room exists without returning game data.
Keep the token private and reuse it to reconnect. Use HTTPS in production.
A newly joined player must connect before the player TTL expires.

Connect to Socket.IO with `auth: { roomId, userId, token }`. The server broadcasts
`game:state` to room members on connection and after game changes. The state includes
`status`, `revision`, `round`, `revoteCount`, `revealEndsAt`, `serverTime`,
`users`, and the recipient's `role` (`spy`, `player`, or
`null`). Each user includes `waiting`, `answer`, and `vote`. A player joining an
active round waits until the next round. The spy ID is hidden until `Revealing`;
the spy receives their role privately. During answering, other players' answer
values and the question for the spy and waiting players are hidden; `hasAnswered`
indicates whether each player has picked a card. The question and answers become
visible when voting starts. Clients should ignore states with a lower
`revision` than one already received, since broadcasts can arrive out of order.

Client events:

- `game:start`: owner only; starts from `NewGame`, `Terminated`, or after the reveal period.
- `game:answer`, integer from zero to one less than the participant count: saves or changes an answer during `Answering`.
- `game:vote`, another participant's player ID: saves or changes a vote during `Voting`.

Each event accepts an optional acknowledgement callback receiving `{ ok, error? }`.
Without a callback, failures are sent as `game:error`. Once all round participants
answer, the status changes to `Voting`. If the highest vote count is tied,
all votes are cleared and everyone votes again; otherwise the status changes
to `Revealing` for ten seconds. Scores are awarded atomically once on reveal:
the spy earns two points for fewer than half the votes, one for exactly half,
and zero for more than half; each other participant earns one point for voting
for the spy. `roundScore` reports each player's gain for the completed round.
Answers and votes can be changed only while their respective phase is active.

`HEARTBEAT_MS` (default 20000) must be shorter than `TTL_MS` (default 60000).
Connected sockets renew player leases and room keys; a disconnected player's grace
period is `TTL_MS`. Multiple sockets for the same player count as one presence.
When an active participant expires, the round becomes `Terminated`; an expired
waiting player does not terminate it. If the owner expires, ownership passes to
the earliest remaining player. A crashed server's players expire after their last
lease unless they reconnect. An idle room is not renewed.

Expiry deadlines are checked atomically in Redis rather than relying on Redis
key-expiration notifications. Joining and heartbeat renewal also refresh existing
room keys atomically, preventing a partially expired room during a late join.
These multi-key scripts require a single Redis instance rather than Redis Cluster.

Run `npm test` with Redis and the initialized PostgreSQL database available on
`REDIS_PORT` (default 6379) and `POSTGRES_PORT` (default 5432).
