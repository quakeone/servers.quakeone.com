import type { PlayerStatus } from "@/model/PlayerStatus"
import type { ServerStatus } from "@/model/ServerStatus";
import { connectedTimeSeconds } from "./player";

const IDLE_SECONDS = 3600 // 1 hour

export const isIdlePlayer = (player: PlayerStatus) => {
  if (player.type === 2) return true
  const upTime = connectedTimeSeconds(player)
  if (upTime < IDLE_SECONDS) {    
    return false
  } else {
    const fragRatio = player.totalFrags / upTime;
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