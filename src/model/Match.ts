import type {MatchPlayer} from './MatchPlayer'
import { MatchPlayerProgress } from './MatchProgress'

export interface Match {
  serverMatchId: number,
  serverId: number,
  map: string,
  mode: string
  mod: string,
  timelimit: number,
  fraglimit: number,
  matchStart: string,
  matchEnd: string,
  players: MatchPlayer[]
  progress?: MatchPlayerProgress[]
}