import { Player } from "./Player";

export interface PlayerStatus extends Player {
  name: string
  frags: number
  fragsPerMinute: number
  joinTime: number
  model: string
  pant: number
  playerId: number
  shirt: number
  skin: string
  totalFrags: number
  upTime: number
}