<template lang="pug">
template(v-if="props.size == 'Abbreviated'")
  .game-type-abbv(
    v-tippy 
    :content="gameType") {{gameTypeAbbrv}}
template(v-else)
  .game-type {{gameType}}
</template>

<script setup lang="ts">
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
  size: Size
}>()

const gameTypeAbbrv = computed(() => gameTypeMapAbbrv[props.gameId] || 'N/A')
const gameType = computed(() => gameTypeMap[props.gameId] || 'Unknown')
</script>