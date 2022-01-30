import { Match } from "@/model/Match"
import { PagedResult } from "@/model/PagedResult"
import { ServerStatus } from "@/model/ServerStatus"
import axios from "axios"

const apiHost = process.env.VUE_APP_SERVERS_API

export const getStatus = (): Promise<ServerStatus[]> => {
  return axios
    .get(`${apiHost}/status`)
    .then(response => response.data)
}

export const getRecentMatches = (): Promise<Match[]> => {
  return axios
    .get(`${apiHost}/match`)
    .then(response => response.data)
}

export const getServerMatches = (serverId: number): Promise<PagedResult<Match>> => {
  return axios
    .get(`${apiHost}/server/${serverId}/match`)
    .then(response => response.data)
}
