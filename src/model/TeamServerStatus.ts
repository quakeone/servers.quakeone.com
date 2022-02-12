import { ServerStatus } from './ServerStatus';
import { Teams } from './Teams';

type MatchType = 'TDM' | 'CTF'

export interface TeamServerStatus extends ServerStatus {
  matchType: MatchType
  teams: Teams
}