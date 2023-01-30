import {dateToUtc, duration} from '@/helpers/date'
import type { Match } from '@/model/Match'
import type { ServerStatus } from '@/model/ServerStatus'
import type { TeamMatch } from '@/model/TeamMatch'
import type { TeamServerStatus } from '@/model/TeamServerStatus'
import { parseTeams } from './teams'

export const status = (lastStart: string, lastEnd: string) => {
  if (!lastStart) {
    return 'No previous match recorded'
  } else if (!lastEnd) {
    return "Match in progress"
  } else if (lastStart < lastEnd) {
    return "Last match " + duration(dateToUtc(new Date()).getTime() - new Date(lastEnd).getTime()) + " ago"
  }
  return  ''
}

export const time = (lastStart: string, lastEnd: string) => {
  
  if (!lastStart || lastStart < lastEnd) {
    return ""
  }
  return duration(dateToUtc(new Date()).getTime() - new Date(lastStart).getTime())
}

export const parseMatch = (match: Match) : (Match | TeamMatch) => {
  const teams = parseTeams(match.players)
  if (match.mod === 'CRMod' && match.mode === 'match') {
    return {
      ...match,
      matchType: 'TDM',
      teams
    } 
  } else if (match.mod === 'CRCTF' && match.mode !== 'practice') {
    return {
      ...match,
      matchType: 'CTF',
      teams
    } 
  } 
  return match
}

export const parseServerStatus = (match: ServerStatus) : (ServerStatus | TeamServerStatus) => {
  const teams = parseTeams(match.players)
  if (match.mod === 'CRMod' && match.mode === 'match') {
    return {
      ...match,
      matchType: 'TDM',
      teams
    } 
  } else if (match.mod === 'CRCTF' && match.mode !== 'practice') {
    return {
      ...match,
      matchType: 'CTF',
      teams
    } 
  }
  return match
}