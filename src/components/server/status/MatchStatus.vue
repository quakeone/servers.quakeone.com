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
    component(:is="subStatus" :server="props.server")
    
</template>

<script lang="ts" setup>
import FFA from './FFA.vue'
import Down from './Down.vue'
import {defineProps, computed} from 'vue'
import * as matchHelper from '@/helpers/match'
import  type { ServerStatus } from '@/model/ServerStatus'

const props = defineProps<{server: ServerStatus}>()
const matchStatus = computed(() => {
  return matchHelper.status(props.server.lastMatchStart, props.server.lastMatchEnd)
})
const matchTime = computed(() => {
  const [time, duration] = matchHelper.time(props.server.lastMatchStart, props.server.lastMatchEnd).split(' ')
  return {time, duration}
})
const subStatus = computed(() => {
  if (props.server.currentStatus === 0) {
    return FFA
  } else {
    return Down
  }
})
</script>

<style lang="scss" scoped>
.header h3 {
  border-bottom: 1px solid $grey-2;
  padding-bottom: 1rem;
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
</style>