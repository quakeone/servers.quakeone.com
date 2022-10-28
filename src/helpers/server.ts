import { PlayerStatus } from "@/model/PlayerStatus"
import { ServerStatus } from "@/model/ServerStatus";

const IDLE_SECONDS = 3600 // 1 hour

export const isIdlePlayer = (player: PlayerStatus) => {
  if (player.playerType === 2) return true
  if (player.upTime < IDLE_SECONDS) {    
    return false
  } else {
    const fragRatio = player.totalFrags / player.upTime;
    return fragRatio < (3/3600) // 3 frags an hour to be labeled as "active" seems reasonable enough.
  }
}

export const isFteServer = (server: ServerStatus) => {
  if (!server.parameters) return false;
  try {
    const params = JSON.parse(server.parameters);
    return params.Engine === 'fte'
  }
  catch (e) {
    return false
  }
}