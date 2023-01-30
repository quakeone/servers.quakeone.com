export type ModInfo = {
  tooltip: string,
  label: string
}
const map: Record<string, ModInfo> = {
  'ffa': {label: 'FFA', tooltip: 'Free For All'},
  'ctf': {label: 'CTF', tooltip: 'Capture The Flag'},
  'match': {label: 'TDM', tooltip: 'Team Deathmatch'},
  'tdm': {label: 'TDM', tooltip: 'Team Deathmatch'},
  'ca': {label: 'CA', tooltip: 'Clan Arena'},
  'ra': {label: 'RA', tooltip: 'Rocket Arena'},
  'rq': {label: 'RQ', tooltip: 'Rune Quake'},
  'tf': {label: 'TF', tooltip: 'Team Fortress'}
}
export const getModInfo = (mod: string, mode: string): ModInfo => {
  return map[mode] || map[mod.toLowerCase()] || {label: mod, tooltip: mod}
}