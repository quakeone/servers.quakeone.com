import { Match } from './Match';
import { Teams } from './Teams';

type MatchType = 'TDM' | 'CTF'

export interface TeamMatch extends Match {
  matchType: MatchType
  teams: Teams
}