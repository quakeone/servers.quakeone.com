import { Player } from "./Player";

export interface MatchPlayer extends Player {
  name : string,
  playerStayDuration: number,
  playerMatchStart: number,
  playerMatchEnd: number,
  pantColor: number,
  shirtCOlor: number,
  frags: number
}