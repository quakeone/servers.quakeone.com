<template lang="pug">
template(v-if="props.size == 'Abbreviated'")
  .game-type-icon
    ServerTypeIcon(:type="{gameId: props.gameId, parameters: props.serverParams}" logoType="withLabel")
template(v-else)
  .game-type {{gameType}}
</template>

<script setup lang="ts">
import ServerTypeIcon from '@/components/ServerTypeIcon.vue'
import {defineProps, computed} from 'vue'

export type Size = 'Abbreviated' | 'Full'
const gameTypeMapAbbrv: Record<number, string> = {
  0: "NQ",
  1: "QW",
  2: "Q2",
  3: "Q3",
  4: "Q4",
  5: "QE"
}

const gameTypeImageMap: Record<number, string> = {
  0: "netquake.png",
  1: "quakeworld.png",
  5: "quake-enhanced.png"
}

const hybridGameType = {
  image: 'hybrid.png',
  gameType: 'Hybrid Server',
  abbrv: 'HY'
}
const gameTypeMap: Record<number, string> = {
  0: "Net Quake",
  1: "QuakeWorld",
  2: "Quake II",
  3: "Quake 3",
  4: "Quake IV",
  5: "Quake Enhanced"
}

const props = defineProps<{
  gameId: number,
  size: Size,
  serverParams: string
}>()


const isFte = computed(() => {
  try {
  return props.serverParams && JSON.parse(props.serverParams).Engine === 'fte'
  } catch {}
})
const gameTypeImage = computed(() => isFte.value ? hybridGameType.image : gameTypeImageMap[props.gameId])
const gameTypeAbbrv = computed(() => isFte.value ? hybridGameType.abbrv : gameTypeMapAbbrv[props.gameId] || 'N/A')
const gameType = computed(() => isFte.value ? hybridGameType.gameType : gameTypeMap[props.gameId] || 'Unknown')
</script>