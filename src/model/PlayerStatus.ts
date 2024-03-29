import { Player } from "./Player";

export interface PlayerStatus extends Player {
  name: string
  nameRaw: string
  frags: number
  joinTime: number
  model: string
  pantColor: number
  shirtColor: number
  skin: string
  totalFrags: number
}