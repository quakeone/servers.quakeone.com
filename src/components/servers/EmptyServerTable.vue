<template lang="pug">
.empty-server-table
  .row-container(
    :class="{'is-down': server.currentStatus !== 0}"
    v-for="(server, index) in sortedServers")
    EmptyServerRow(
      :key="server.serverId" 
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
.empty-server-table {
  border: 1px solid #363330;
  .row-container {
    &.is-down {
      &:nth-child(even) {
        background-color: rgba(104, 24, 24, .4);
      }
      &:nth-child(odd) {
        background-color: rgba(104, 24, 24, .2);
      }
    }
    &:nth-child(even) {
      background-color: #2d2b29;
    }
    &:nth-child(odd) {
      background-color: #363330;
    }
  }
}
table {
  border-collapse: collapse;
}
td {
  border-left: 1px $grey-2 solid;
}
th {
  text-align: left;
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