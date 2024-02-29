import type { PlayerStatus } from './PlayerStatus'
import type { ServerSetting } from './ServerSetting';

export enum GameId {
  NetQuake = 0,
  QuakeWorld,
  Quake2,
  Quake3,
  Quake4,
  QuakeEnhanced
}
export interface ServerStatus {
  serverDataId: number;
  serverId: number;
  timestamp: string;
  currentStatus: number;
  lastQuery: Date;
  hostname: string;
  address: string;
  port: number;
  gameId: GameId;
  country: string;
  locality: string;
  mod: string;
  mode: string;
  map: string;
  serverSettings: ServerSetting[];
  players: PlayerStatus[];
  maxPlayers: number;
  parameters: string;
  lastMatchStart: string;
  lastMatchEnd: string;
}
