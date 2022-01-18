import type {MatchPlayer} from './MatchPlayer'

export interface Match {
  gameId: number,
  matchId: number,
  serverId: number,
  dns: string,
  port: number,
  name: string,
  map: string,
  modification: string,
  matchStart: string,
  matchEnd: string,
  duration: number,
  players: MatchPlayer[]
}