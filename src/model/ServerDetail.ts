
import type { Match } from "./Match";
import type { ServerStatus } from "./ServerStatus";
import type { TeamMatch } from "./TeamMatch";

export type MapStat = {map: string, percent: number}
export interface ServerDetail {
  match?: Match | TeamMatch
  status: ServerStatus,
  mapStats: MapStat[]
}