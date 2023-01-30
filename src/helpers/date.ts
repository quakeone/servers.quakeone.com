import { differenceInSeconds } from "date-fns"

export const dateToUtc = (date: Date) => {
  const date_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())

  return new Date(date_utc)
}

export const duration = (milliseconds: number) => {
  const total_seconds = milliseconds / 1000

  const days = Math.floor(total_seconds / 86400)
  const hours = Math.floor(total_seconds / 3600)
  const mins = Math.floor(total_seconds / 60)
  const secs = Math.floor(total_seconds % 60)

  if (days > 0) {
    return `${days} days` 
  }
  if (hours > 0) {
    return `${hours} hours` 
  }
  if (mins > 0) {
    return `${mins} mins` 
  }
  return `${secs} secs`
}

export const difference = (start: Date, end: Date) => {
  if (!end) {
    return -1
  }
  return differenceInSeconds(start, end)
}

