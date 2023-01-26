<template lang="pug">
.down
  .status 
    FontAwesome( :icon="['fas', 'exclamation-circle']") 
    |  {{status}}
  .seen
    span.seen__text Last seen running 
    span.seen-time.bright {{lastSeen}} ago


</template>

<script setup lang="ts">
import {dateToUtc, duration} from '@/helpers/date'

import {defineProps, computed} from 'vue'
import PlayersTooltip from '@/components/PlayersTooltip.vue'
import type {ServerDetail} from '@/model/ServerDetail'
import type {PlayerStatus} from '@/model/PlayerStatus'
import * as matchHelper from '@/helpers/match'
import {partition} from 'ramda'

const serverStatusMap: Record<number, string> = {
  0: 'Running',
  1: 'Not Responding',
  2: 'Server not found',
  3: 'Query Error'
}

const status = computed(() => serverStatusMap[props.server.status.currentStatus] || 'Unknown')
const props = defineProps<{server: ServerDetail}>()
const lastSeen = computed(() => duration(dateToUtc(new Date()).getTime() - new Date(props.server.status.timestamp).getTime()))
</script>

<style lang="scss" scoped>
.status {
  padding: .5rem 0;
  color: $error;
  font-weight: bold
}
</style>