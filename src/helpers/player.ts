import { MatchPlayer } from "@/model/MatchPlayer"
import { PlayerStatus } from "@/model/PlayerStatus"
import { differenceInSeconds } from "date-fns"

export const connectedTimeSeconds = (player: PlayerStatus) => {
  return differenceInSeconds(new Date(), new Date(player.joinTime))
}

export const matchTimeSeconds = (player: MatchPlayer) => {
  const end = player.playerMatchEnd ? new Date(player.playerMatchEnd) : new Date();
  return differenceInSeconds(end, new Date(player.playerMatchStart))
}