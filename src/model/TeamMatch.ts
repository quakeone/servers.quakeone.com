import type { Match } from './Match';
import type { Teams } from './Teams';

type MatchType = 'TDM' | 'CTF'

export interface TeamMatch extends Match {
  matchType: MatchType
  teams: Teams
}