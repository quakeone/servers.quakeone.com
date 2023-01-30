export type ApiMatchPlayer = {
  playerMatchId: number,
  name : string,
  nameRaw: string,
  type: number,
  playerMatchStart: number,
  playerMatchEnd: number,
  skin: string,
  model: string,
  pantColor: number,
  shirtColor: number,
  frags: number
}

export type ApiMatch = {
  matchId: number,
  serverId: number,
  map: string,
  mode: string
  mod: string,
  fraglimit: number,
  timelimit: number,
  matchStart: string,
  matchEnd: string,
  players: ApiMatchPlayer[]
  progress?: { data: any[][], cols: string[]}
}