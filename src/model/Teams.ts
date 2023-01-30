import type { MatchPlayer } from "./MatchPlayer"
import type { PlayerStatus } from "./PlayerStatus"

export type Team = {
  color: number,
  totalFrags: number,
  name: string,
  players: (MatchPlayer | PlayerStatus)[]
}

export type Teams = {
  teams: Team[]
  size: number
  observers: (MatchPlayer | PlayerStatus)[]
}
