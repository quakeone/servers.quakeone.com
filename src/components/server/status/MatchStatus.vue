<template lang="pug">
.match-status
  .header
    h3 Server Status
  .current-status
    .status-string {{matchStatus}}
    .status-time 
      .time {{matchTime.time}}
      .suffix {{matchTime.duration}}
  .content
    component(:is="subStatus" :server="props.server" :match="props.match")
  
</template>

<script lang="ts" setup>
import FFA from './FFA.vue'
import Down from './Down.vue'
import Team from './Team.vue'
import {defineProps, computed} from 'vue'
import * as matchHelper from '@/helpers/match'
import type { ServerStatus } from '@/model/ServerStatus'
import type { TeamMatch } from '@/model/TeamMatch'
import type { Match } from '@/model/Match'

const props = defineProps<{
  server: ServerStatus,
  match: Match | TeamMatch
}>()
const matchStatus = computed(() => {
  return matchHelper.status(props.server.lastMatchStart, props.server.lastMatchEnd)
})
const matchTime = computed(() => {
  const [time, duration] = matchHelper.time(props.server.lastMatchStart, props.server.lastMatchEnd).split(' ')
  return {time, duration}
})
const subStatus = computed(() => {
  if (props.server.currentStatus === 0) {
    if (props.match && 'matchType' in props.match) {
      return Team
    }
    return FFA
  } else {
    return Down
  }
})
</script>

<style lang="scss" scoped>
.header h3 {
  border-bottom: 1px solid $grey-2;
  padding-bottom: .5rem;
}

.current-status {
  display: flex;
  justify-content: space-between;
  .status-string {
    font-size: 1.2rem;
  }
  .status-time {
    display: flex;
    flex-direction: column;
    align-items: center;
    .time {
      font-size: 1.5rem;
    }
    .suffix {

    }
  }
}
.content {
  display: flex;
  justify-content: center;
}
</style>