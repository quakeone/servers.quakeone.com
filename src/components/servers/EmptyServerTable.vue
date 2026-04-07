<template lang="pug">
.empty-server-table
  .row-container(
    :class="{'is-down': server.currentStatus !== 0}"
    v-for="(server, index) in servers")
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
    servers: {
      type: Array as PropType<ServerStatus[]>,
      default:() => []
    }
  }
})
</script>

<style lang="scss" scoped>
.empty-server-table {
  .row-container {
    border-top: 1px solid $grey-2;
    border-left: 3px solid transparent;
    &.is-down {
      border-left-color: $error;
    }
  }
}
</style>