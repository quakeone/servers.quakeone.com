export type MatchPlayerDatapoint {
  timestamp: string;
  frags: number;
  pantColor: number;
  shirtColor: number;
  skin?: string;
  model?: string;
}
export type MatchPlayerProgress = {
  playerMatchId: number;
  name: string;
  nameRaw: string;
  pantColor: string
  progression: MatchPlayerDatapoint[]
}