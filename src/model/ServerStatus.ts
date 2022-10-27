import {PlayerStatus} from './PlayerStatus'
import { ServerSetting } from './ServerSetting';

export interface ServerStatus {
  serverDataId: number;
  serverId: number;
  customName?: string;
  customNameShort?: string;
  dNS: string;
  port: number;
  gameId: number;
  publicSiteUrl?: string;
  mapDownloadUrl?: string;
  location: string;
  queryInterval: number;
  failedQueryAttempts: number;
  region: string;
  modificationCode: string;
  category?: string;
  currentStatus: number;
  customModificationName?: string;
  serverName: string;
  parameters: string;
  map: string;
  mode: string,
  serverSettings: ServerSetting[];
  modification?: string;
  players: PlayerStatus[];
  timestamp: string;
  maxPlayers: number;
  ipAddress: string;
  recentMatchEnd: string;
  recentMatchMap: string;
  recentMatchPlayers: string;
  recentMatchStart: string;
}
