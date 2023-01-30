
import type { PagedResult } from "@/model/PagedResult"
import type { ServerStatus } from "@/model/ServerStatus"
import axios from "axios"
import { ApiMatch } from "./types/ApiMatch"
import { ApiServerDetail } from "./types/ApiServerDetail"

const apiHost = import.meta.env.VITE_SERVERS_API

export const getStatus = (): Promise<ServerStatus[]> => {
  return axios
    .get(`${apiHost}/status`)
    .then(response => response.data)
}

export const getRecentMatches = (): Promise<ApiMatch[]> => {
  return axios
    .get(`${apiHost}/match`)
    .then(response => response.data)
}

export const getServerMatches = (serverId: number, pageNum: number): Promise<PagedResult<ApiMatch>> => {
  return axios
    .get(`${apiHost}/server/${serverId}/match?page=${pageNum}`)
    .then(response => response.data)
}

export const getServerDetails = (serverId: number): Promise<ApiServerDetail> => {
  return axios
    .get(`${apiHost}/server/${serverId}`)
    .then(response => response.data)
}
