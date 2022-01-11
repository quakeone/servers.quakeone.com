<template lang="pug">
table.table.table-striped
  thead
    th(scope="col") Server Name
    th(scope="col") Map
    th(scope="col") Mod
    th(scope="col") Players
  
  tbody
    tr(v-for="server in sortedServers" :key="server.serverId")
      td
        div.bright {{server.dNS}}:{{server.port}}
        div.text-ellipsis {{server.serverName}}
      td.text-end {{server.map}}
      td.text-end {{server.modificationCode}}
      td.text-end {{server.players.length}}/{{server.maxPlayers}}

</template>
<script lang="ts">
import { ServerStatus } from '@/model/ServerStatus'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  props: {
    serverStatuses: {
      type: Array as PropType<ServerStatus[]>,
      default:() => []
    }
  },
  computed: {
    sortedServers(): ServerStatus[] {
      return [...this.serverStatuses].sort((a:ServerStatus, b: ServerStatus) => 
        a.recentMatchStart === b.recentMatchStart 
          ? 0 
          :  a.recentMatchStart > b.recentMatchStart ? -1 : 1)
    }
  },
  setup() {
    return {}
  },
})
</script>

<style lang="scss">
table {
  border-collapse: collapse;
}
td {
  border-left: 1px $grey-2 solid;
}
th {
  color: $whiteish;
}
.text-end {
  text-align: right;
}
</style>