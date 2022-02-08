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
import {ServerDetail} from '@/model/ServerDetail'
import {PlayerStatus} from '@/model/PlayerStatus'
import * as matchHelper from '@/helpers/match'
import {partition} from 'ramda'

const props = defineProps<{server: ServerDetail}>()
const players = computed(() => {
  const [observer, active] = partition((p: PlayerStatus) => 
    p.shirt === 0 && p.pant === 0 && p.frags === -99
  , props.server.players)
  return {active, observer}
})
</script>