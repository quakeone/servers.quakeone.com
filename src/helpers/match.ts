import {dateToUtc, duration} from '@/helpers/date'

export const status = (lastStart: string, lastEnd: string) => {
  if (!lastStart) {
    return 'No previous match recorded'
  } else if (!lastEnd) {
    return "Match in progress"
  } else if (lastStart < lastEnd) {
    return "Last match " + duration(dateToUtc(new Date()).getTime() - new Date(lastEnd).getTime()) + " ago"
  }
  return  ''
}

export const time = (lastStart: string, lastEnd: string) => {
  
  if (!lastStart || lastStart < lastEnd) {
    return ""
  }
  return duration(dateToUtc(new Date()).getTime() - new Date(lastStart).getTime())
}