import type {MatchPlayer} from './MatchPlayer'

export interface Match {
  gameId: number,
  matchId: number,
  serverId: number,
  dns: string,
  port: number,
  name: string,
  map: string,
  mode: string
  mod: string,
  matchStart: string,
  matchEnd: string,
  duration: number,
  players: MatchPlayer[]
}