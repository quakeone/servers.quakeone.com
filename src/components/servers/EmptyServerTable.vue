<template lang="pug">
table.table.table-striped
  thead
    th(scope="col") Server Name
    th(scope="col") Map
    th(scope="col") Mod
    th(scope="col") Max Players
  tbody
    tr(v-for="server in serverStatuses" :key="server.serverId")
      td
        div.bright {{server.dNS}}:{{server.port}}
        div.text-ellipsis {{server.serverName}}
      td.text-end {{server.map}}
      td.text-end {{server.modificationCode}}
      td.text-end {{server.maxPlayers}}
    
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