<template lang="pug">
.game-type(v-tippy :content="gameType") {{gameTypeAbbrv}}
</template>

<script setup lang="ts">
import {defineProps, computed} from 'vue'

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

const props = defineProps<{gameId: number}>()
const gameTypeAbbrv = computed(() => gameTypeMapAbbrv[props.gameId] || 'N/A')
const gameType = computed(() => gameTypeMap[props.gameId] || 'Unknown')
</script>