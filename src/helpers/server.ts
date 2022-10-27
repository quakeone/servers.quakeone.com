import { PlayerStatus } from "@/model/PlayerStatus"

const IDLE_SECONDS = 3600 // 1 hour

export const isIdlePlayer = (player: PlayerStatus) => {
  if (player.upTime < IDLE_SECONDS) {    
    return false
  } else {
    const fragRatio = player.totalFrags / player.upTime;
    return fragRatio < (3/3600) // 3 frags an hour to be labeled as "active" seems reasonable enough.
  }
}