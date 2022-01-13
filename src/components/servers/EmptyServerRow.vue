<template lang="pug">
tr
  td
    .cell-row
      div.bright {{serverStatus.serverName}}
      div.bright {{gameType}}
    .cell-row
      ServerAddress(:address="serverStatus.dNS" :port="serverStatus.port")
      div {{serverStatus.location || 'Unknown'}}
  td.text-end {{serverStatus.map}}
  td.text-end {{serverStatus.modificationCode}}
  td.text-end {{serverStatus.players.length}}/{{serverStatus.maxPlayers}}
  td.text-end {{serverStatus.currentStatus}}
</template>

<script lang="ts">
import { ServerStatus } from '@/model/ServerStatus'
import ServerAddress from '../ServerAddress.vue'
import {PropType, defineComponent, computed} from 'vue'

const gameTypeMap: Record<number, string> = {
  0: "Net Quake",
  1: "QuakeWorld",
  2: "Quake II",
  3: "Quake 3",
  4: "Quake IV",
  5: "Quake Enhanced"
}

export default defineComponent({
  components: {ServerAddress},
  props: {
    serverStatus: {
      type: Object as PropType<ServerStatus>,
      required: true
    }
  },
  setup(props) {
    return {
      gameType: computed(() => gameTypeMap[props.serverStatus.gameId] || 'unknown')
    }
  }
})
</script>