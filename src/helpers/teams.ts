import type { PlayerStatus } from '@/model/PlayerStatus'
import {groupBy} from 'ramda'
import type { Teams } from '@/model/Teams'
import type { MatchPlayer } from '@/model/MatchPlayer'
import { ApiMatchPlayer } from '@/services/types/ApiMatch'

const teamName: Record<number, string> = {
  13: 'Team Blue',
  12: 'Team Yellow',
  3: 'Team Green',
  4: 'Team Red',
}

export const parseTeams = (players: MatchPlayer[] | PlayerStatus[]): Teams => {
  const playerGroups = groupBy<MatchPlayer | PlayerStatus>(p => p.pantColor.toString(), players)
  let maxTeamSize = 0
  const teams = Object.keys(playerGroups)
    .filter(c => c !== '0')
    .map(t => {
      const teamColor = parseInt(t)
      const players = [...playerGroups[t]].sort((a,b) => b.frags - a.frags)
      if (players.length > maxTeamSize) {
        maxTeamSize = players.length;
      }
      
      return {
        color: teamColor,
        totalFrags: players.reduce((acc,p) => acc + p.frags, 0),
        name: teamName[teamColor] || 'Team ' + players[0],
        players
      }
    })
  
  return {
    teams,
    size: maxTeamSize,
    observers: playerGroups['0'] ?? []
  }
}