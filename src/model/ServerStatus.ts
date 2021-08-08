import {PlayerStatus} from './PlayerStatus'
import { ServerSetting } from './ServerSetting';

export interface ServerStatus {
  ServerDataId: number;
  ServerId: number;
  CustomName?: string;
  CustomNameShort?: string;
  DNS: string;
  Port: number;
  GameId: number;
  PublicSiteUrl?: string;
  MapDownloadUrl?: string;
  Location: string;
  QueryInterval: number;
  FailedQueryAttempts: number;
  Region: string;
  ModificationCode: string;
  Category?: string;
  CurrentStatus: number;
  CustomModificationName?: string;
  ServerName: string;
  Map: string;
  ServerSettings: ServerSetting[];
  Modification?: string;
  PlayerData: PlayerStatus[];
  Timestamp: string;
  MaxPlayers: number;
  IpAddress: string;
  RecentActivity: string;
}
