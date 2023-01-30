import { ApiMatch } from "./ApiMatch"

export interface ApiPlayerStatus {
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
export interface ApiServerStatus {
  serverDataId: number;
  serverId: number;
  timestamp: string;
  currentStatus: number;
  lastQuery: Date;
  hostname: string;
  address: string;
  port: number;
  gameId: number;
  country: string;
  locality: string;
  mod: string;
  mode: string;
  map: string;
  fraglimit: number,
  timelimit: number,
  matchStatus: number,
  serverSettings: {setting: string, value: string}[];
  players: ApiPlayerStatus[];
  maxPlayers: number;
  parameters: string;
  lastMatchStart: string;
  lastMatchEnd: string;

}
export interface ApiServerDetail {
  match: ApiMatch
  status: ApiServerStatus,
  mapStats: any
}