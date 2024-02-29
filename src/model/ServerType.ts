import { GameId } from "./ServerStatus"

export enum ServerType {
    NetQuake,
    QuakeWorld,
    Quake2,
    Quake3,
    Quake4,
    QuakeEnhanced,
    Hybrid,
}

const gameIdMap: Record<GameId, ServerType> = {
    [GameId.NetQuake]: ServerType.NetQuake,
    [GameId.QuakeWorld]: ServerType.QuakeWorld,
    [GameId.Quake2]: ServerType.Quake2,
    [GameId.Quake3]: ServerType.Quake3,
    [GameId.Quake4]: ServerType.Quake4,
    [GameId.QuakeEnhanced]: ServerType.QuakeEnhanced,
}
export const serverToServerType= ({
    gameId, 
    parameters
}: {gameId: GameId, parameters: string}): ServerType  => {
    try {
        const isFte = parameters && JSON.parse(parameters).Engine === 'fte'
        if (isFte) return ServerType.Hybrid
    }catch {

    }
    return gameIdMap[gameId] || ServerType.NetQuake
}