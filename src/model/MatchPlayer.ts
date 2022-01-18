import { Player } from "./Player";

export interface MatchPlayer extends Player {
  name : string,
  playerStayDuration: number,
  playerMatchStart: number,
  playerMatchEnd: number,
  pant: number,
  shirt: number,
  frags: number
}