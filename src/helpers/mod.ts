export type ModInfo = {
  full: string,
  abbv: string
}
const map: Record<string, ModInfo> = {
  'ffa': {abbv: 'FFA', full: 'Free For All'},
  'ctf': {abbv: 'CTF', full: 'Capture The Flag'},
  'match': {abbv: 'TDM', full: 'Team Deathmatch'},
  'tdm': {abbv: 'TDM', full: 'Team Deathmatch'},
  'ca': {abbv: 'CA', full: 'Clan Arena'},
  'cax': {abbv: 'CA', full: 'Clan Arena'},
  'ra': {abbv: 'RA', full: 'Rocket Arena'},
  'rq': {abbv: 'RQ', full: 'Rune Quake'},
  'tf': {abbv: 'TF', full: 'Team Fortress'},
  'practice': {abbv: 'PR', full: 'Practice'}
}
export const getModInfo = (mod: string, mode?: string): ModInfo => {
  return (mode && map[mode]) || map[mod && mod.toLowerCase()] || {abbv: mod, full: mod}
}