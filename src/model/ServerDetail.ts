
import type { Match } from "./Match";
import type { ServerStatus } from "./ServerStatus";
import type { TeamMatch } from "./TeamMatch";

export interface ServerDetail {
  match?: Match | TeamMatch
  status: ServerStatus,
  mapStats: any
}