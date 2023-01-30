import { Player } from "./Player";

export interface MatchPlayer extends Player {
  playerMatchId: number,
  name : string,
  nameRaw: string,
  type: number,
  playerMatchStart: number,
  playerMatchEnd: number,
  skin: string,
  model: string,
  pantColor: number,
  shirtColor: number,
  frags: number
}