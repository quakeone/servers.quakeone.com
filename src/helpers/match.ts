import {dateToUtc, duration} from '@/helpers/date'
import type { Match } from '@/model/Match'
import type { MatchPlayer } from '@/model/MatchPlayer'
import type { MatchPlayerProgress } from '@/model/MatchProgress'
import type { ServerStatus } from '@/model/ServerStatus'
import type { TeamMatch } from '@/model/TeamMatch'
import { ApiMatch, ApiMatchPlayer } from '@/services/types/ApiMatch'
import { stringifyExpression } from '@vue/compiler-core'
import { formatDistance } from 'date-fns'
import { groupBy } from 'ramda'
import { parseTeams } from './teams'

export const status = (lastStart: string, lastEnd: string) => {
  if (!lastStart) {
    return 'No previous match recorded'
  } else if (!lastEnd) {
    return "Match in progress"
  } else if (lastStart < lastEnd) {
    return "Last match " + formatDistance(new Date(lastStart), new Date(), {
      addSuffix: true
    })
  }
  return  ''
}

export const time = (lastStart: string, lastEnd: string) => {
  if (!lastStart || lastStart < lastEnd) {
    return ""
  }
  return duration(dateToUtc(new Date()).getTime() - new Date(lastStart).getTime())
}

export const parseApiMatch = (apiMatch: ApiMatch) : (Match | TeamMatch) => {
  const match = {
    ...apiMatch,
    progress: parseMatchProgress(apiMatch)
  } as Match
  const teams = parseTeams(match.players)
  if (match.mode === 'tdm') {
    return {
      ...match,
      matchType: 'TDM',
      teams
    } 
  } else if (match.mode == 'ctf' || match.mod == 'CRCTF') {
    return {
      ...match,
      matchType: 'CTF',
      teams
    } 
  } 
  return match
}

export const parseMatchProgress = 
  (apiMatch: ApiMatch): MatchPlayerProgress[] => {
    if (!apiMatch.progress) {
      return []
    }
    const playerMap = apiMatch.players
      .reduce((aggr, player) => ({ ...aggr, [player.playerMatchId]: player}), {} as Record<number, ApiMatchPlayer>)
    const dataMap = apiMatch.progress.cols
      .reduce((aggr, col, idx) => ({ ...aggr,  [col]: idx }), {} as Record<string, number>)
    
    const matchProgressMap = apiMatch.progress.data
      .reduce((aggr, dataPoint) => {
        const playerMatchId = dataPoint[dataMap['playerMatchId']]
        if (!aggr[playerMatchId]) {
          aggr[playerMatchId] = {
            playerMatchId,
            pantColor: dataPoint[dataMap['pantColor']],
            name: playerMap[playerMatchId].name,
            nameRaw: playerMap[playerMatchId].nameRaw,
            progression: []
          }
        }
        aggr[playerMatchId].progression.push({
          timestamp: dataPoint[dataMap['timestamp']],
          frags: dataPoint[dataMap['frags']],
          pantColor: dataPoint[dataMap['pantColor']],
          shirtColor: dataPoint[dataMap['shirtColor']],
          model: dataPoint[dataMap['model']],
          skin: dataPoint[dataMap['skin']],
        })
        return aggr
      }, {} as Record<number, MatchPlayerProgress>)
      
    return Object.values(matchProgressMap)
}