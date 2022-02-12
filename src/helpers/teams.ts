import { PlayerStatus } from '@/model/PlayerStatus'
import {groupBy} from 'ramda'
import { Teams } from '@/model/Teams'
import { MatchPlayer } from '@/model/MatchPlayer'

export const parseTeams = (players: MatchPlayer[] | PlayerStatus[]): Teams => {
  const playerGroups = groupBy<MatchPlayer | PlayerStatus>(p => p.pant.toString(), players)
  let maxTeamSize = 0
  const teams = Object.keys(playerGroups)
    .filter(c => c !== '0')
    .map(t => {
      const players = [...playerGroups[t]].sort((a,b) => a.frags - b.frags)
      if (players.length > maxTeamSize) {
        maxTeamSize = players.length;
      }
      
      return {
        color: parseInt(t),
        totalFrags: players.reduce((acc,p) => acc + p.frags, 0),
        name: 'Team ' + players[0].name,
        players: playerGroups[t]
      }
    })
  
  return {
    teams,
    size: maxTeamSize,
    observers: playerGroups['0'] ?? []
  }
}