# quake-servers-app

A real-time server browser and match tracker for classic Quake games. Browse active game servers, view live player counts and match status, and explore detailed match history and statistics.

## Supported Games

- **NetQuake (NQ)** — Original 1996 release and faithful ports
- **QuakeWorld (QW)** — Multiplayer-optimized version with competitive-focused network code and physics
- **Quake II (Q2)**
- **Quake III (Q3)**
- **Quake IV (Q4)**
- **Quake Enhanced (QE)** — Bethesda/Nightdive Kex engine re-release with cross-play support
- **Hybrid (FTE)** — Servers accepting connections from multiple Quake clients

## Features

- **Live server list** with active player counts, current map, and match status (auto-refreshes every 5 seconds)
- **Server detail pages** showing hostname, location, game type, mod, rules, and connection info
- **Match history** per server with pagination
- **Match detail views** for FFA, TDM, and CTF game modes with player/team stats and MVP highlights
- **Match progress graphs** showing frag progression over time (D3)
- **Map popularity charts** per server
- **Recent matches** feed across all tracked servers
- **Game version filtering** to narrow the server list
- **Responsive layout** for desktop and mobile

## Setup

```
npm install
```

### Development

```
npm run dev
```

### Production build

```
npm run build
```

### Configuration

The app requires a `VITE_SERVERS_API` environment variable pointing to the backend API.

## Tech Stack

Vue 3, TypeScript, Vite, Vue Router, D3, Axios, Sass, Pug
