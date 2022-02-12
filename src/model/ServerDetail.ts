import { ServerStatus } from "./ServerStatus";
import { TeamServerStatus } from "./TeamServerStatus";

export interface ServerDetail {
  status: ServerStatus | TeamServerStatus,
  mapStats: any
}