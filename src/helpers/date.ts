export const dateToUtc = (date: Date) => {
  const date_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds())

  return new Date(date_utc)
}

export const duration = (milliseconds: number) => {
  const total_seconds = milliseconds / 1000

  const mins = Math.floor(total_seconds / 60)
  const secs = Math.floor(total_seconds % 60)

  if (mins > 0) {
    return `${mins} mins` 
  }
  return `${secs} secs`
}