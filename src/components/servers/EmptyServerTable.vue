<template lang="pug">
table.table.table-striped
  thead
    th(scope="col") Server
    th(scope="col") Map
    th(scope="col") Mod
    th(scope="col") Players
  
  tbody
    EmptyServerRow(
      v-for="server in sortedServers" 
      :key="server.serverId" 
      :class="{'is-down': server.currentStatus !== 0}"
      :serverStatus="server")

</template>

<script lang="ts">
import { ServerStatus } from '@/model/ServerStatus'
import { defineComponent, PropType } from 'vue'
import EmptyServerRow from './EmptyServerRow.vue'

export default defineComponent({
  components: {
    EmptyServerRow
  },
  props: {
    serverStatuses: {
      type: Array as PropType<ServerStatus[]>,
      default:() => []
    }
  },
  computed: {
    sortedServers(): ServerStatus[] {
      return [...this.serverStatuses].sort((a:ServerStatus, b: ServerStatus) => 
        a.currentStatus === b.currentStatus
          ? a.recentMatchStart === b.recentMatchStart 
            ? 0 
            :  a.recentMatchStart > b.recentMatchStart ? -1 : 1
          :a.currentStatus < b.currentStatus ? -1 : 0)
    }
  }
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
.cell-row {
  display: flex;
  justify-content: space-between;
}
.text-end {
  text-align: right;
}
.table {
  .is-down {
    &:nth-child(even) {
      --bs-table-accent-bg: rgba(104, 24, 24, .4);
    }
    &:nth-child(odd) {
      --bs-table-accent-bg: rgba(104, 24, 24, .2);
    }
  }
}
</style>