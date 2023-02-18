<template lang="pug">
.players
  PlayersTooltip(:players="props.server.players")
    .participating(v-if="players.active.length > 0")
      span.bright {{players.active.length}}  
      span  Active Player(s)
    .observers(v-if="players.observer.length > 0")
      span.bright {{players.observer.length}}  
      span  Observers
</template>

<script setup lang="ts">
import {defineProps, computed} from 'vue'
import PlayersTooltip from '@/components/PlayersTooltip.vue'
import type {PlayerStatus} from '@/model/PlayerStatus'
import * as matchHelper from '@/helpers/match'
import {partition} from 'ramda'
import type { Match } from '@/model/Match'
import type { MatchPlayer } from '@/model/MatchPlayer'
import type { ServerStatus } from '@/model/ServerStatus'

const props = defineProps<{match: Match, server: ServerStatus}>()
const players = computed(() => {
  const [observer, active] = partition((p: PlayerStatus) => 
    p.shirtColor === 0 && p.pantColor === 0 && p.frags === -99
  , props.server.players)
  return {active, observer}
})
</script>

<style lang="scss" scoped>
.players {
  width: 100%;
}
</style>