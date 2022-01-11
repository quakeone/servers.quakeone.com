import { ServerStatus } from "@/model/ServerStatus"
import axios from "axios"

const apiHost = process.env.VUE_APP_SERVERS_API

export const getStatus = (): Promise<ServerStatus[]> => {
  return axios
    .get(`${apiHost}/status`)
    .then(response => response.data)
}
