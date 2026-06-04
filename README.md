# Taste of IRON

Turn-based fighting game — browser port.

A strategic turn-based fighting game where you choose actions (Attack, Block, Dodge, Rest) each turn to defeat your opponent. Originally a CLI game, now ported to the browser with PvE and PvP modes.

---

## Quick Start

```bash
npm install
npm start          # Start SPA (localhost:5173) + server (port 3000)
npm run test       # Run 344 tests
npm run cli        # Legacy CLI version
```

---

## Game Rules

### Objective
Defeat your opponent by reducing their HP to 0 before the match ends (3 rounds × 3 actions = 9 turns).

### Actions

| Action | Effect | Cost |
|--------|--------|------|
| **Attack** | Deal 2 damage to opponent | 2 SP |
| **Block** | Reduce incoming damage to 1 | 1 SP |
| **Dodge** | Evade all damage | 2 SP |
| **Rest** | Recover 2 stamina | Free |

### Combat Resolution
Both players choose an action simultaneously. Actions are resolved based on the opponent's chosen action:

- **Attack** hits Block, Rest, Dodge, Idle — but **fails** if opponent also Attacks (both take 2 damage)
- **Block** works only against Attack (reduces damage to 1)
- **Rest** heals 2 SP if opponent doesn't Attack — otherwise takes 2 damage
- **Dodge** always works (costs 2 SP, no other effect)

### Fighter Classes

| Class | HP | SP | Playstyle |
|-------|----|----|-----------|
| Light | 2 | 4 | Fast, fragile, many options |
| Medium | 3 | 3 | Balanced |
| Heavy | 4 | 2 | Tanky, limited stamina |
### Round Breaks
After every 3 actions, both fighters recover **+2 HP and +2 SP**.

### Win Conditions
- Reduce opponent to 0 HP (immediate win)
- Most HP remaining after all rounds
- Draw if HP is equal

---

## Architecture

```
src/
├── core/           # Pure TS game logic (no framework deps)
│   ├── actor/      # Fighter class, stats, actions
│   ├── actions/    # Attack, Block, Dodge, Rest, Idle
│   ├── calculators/# Action resolution, round breaks
│   ├── counters/   # Round/action tracking
│   ├── ai/         # AI opponents with configurable difficulty
│   └── utils/      # Random utilities
├── web/            # React SPA (Vite + Tailwind CSS)
│   ├── components/ # UI primitives + game components
│   ├── hooks/      # useGame, useWebSocket
│   ├── context/    # GameContext (useReducer)
│   └── pages/      # HomePage, GamePage, PvPGamePage
├── server/         # WebSocket multiplayer server
│   ├── GameServer  # Connection handling, authoritative game
│   ├── RoomManager # Room creation, matchmaking
│   └── types.ts    # WS protocol types
├── ui/console/     # Legacy CLI interface
└── cli/            # CLI entry point
```

### Key Design Decisions
- **Core is framework-agnostic**: all game logic in `src/core/` has zero dependencies on React, DOM, or Node.js APIs
- **Event-driven GameController**: emits state changes → UI subscribes and renders
- **Authoritative server**: multiplayer server runs GameController, clients send actions and receive state
- **3 UI layers**: CLI (legacy), Web SPA, WebSocket (server) — all share the same `core/`

---

## Multiplayer (PvP)

### Protocol

| Direction | Type | Payload |
|-----------|------|---------|
| Client → Server | `create_room` | — |
| Server → Client | `room_created` | `{ roomId, playerId }` |
| Client → Server | `join_room` | `{ roomId }` |
| Server → Client | `room_joined` | `{ roomId, playerId }` |
| Server → Client | `opponent_joined` | — |
| Server → Client | `preset_request` | `{ playerId }` |
| Client → Server | `select_preset` | `{ preset }` |
| Server → Client | `action_request` | `{ playerId, allowedActions }` |
| Client → Server | `select_action` | `{ action }` |
| Server → Client | `game_state` | `{ phase, player, opponent, ... }` |
| Client → Server | `rematch` | — |

### Running PvP

```bash
# Terminal 1: Start server
npm run server

# Terminal 2: Start client
npm run dev

# Open http://localhost:5173 in TWO browser tabs
# Tab 1: Click "PvP Mode" → "Create Room" → share Room ID
# Tab 2: Click "PvP Mode" → enter Room ID → "Join"
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start SPA + server simultaneously |
| `npm run dev` | Start Vite dev server (SPA only) |
| `npm run build` | Production build (tsc + Vite) |
| `npm run preview` | Preview production build |
| `npm run server` | Start WebSocket game server (port 3000) |
| `npm run cli` | Legacy CLI game mode |
| `npm run test` | Run 344 Jest tests |
| `npm run coverage` | Test coverage report |

---

## Standalone / GitHub Pages

Production build (`npm run build`) uses `.env` with `VITE_DISABLE_MULTIPLAYER=true`, producing a static SPA with PvE only — no server needed. Deploy `dist/` to any static host including GitHub Pages.

### Deploy to GitHub Pages
```bash
npm run build
# push dist/ to gh-pages branch, or use GitHub Actions
```

### Local development (with multiplayer)
```bash
npm run dev    # loads .env.development → multiplayer enabled
npm start      # SPA + server simultaneously
```

---

## Development

### Tech Stack
- **Runtime**: Node.js 22
- **Frontend**: React 19, React Router 7, Tailwind CSS 4
- **Build**: Vite 6, TypeScript 5.7
- **Server**: ws (WebSocket), tsx (runner)
- **Testing**: Jest 29, ts-jest (344 tests, 7 suites)

### Project Setup
```bash
nvm use 22.22.3
npm install
npm run dev
```

---

## License

ISC

---

Сгенерировано с помощью DeepSeek V4 Flash Free и OpenCode
