<template lang="pug">
.home
  .container
    .row
      .col.active-list
        h2.border-divider ACTIVE QUAKE SERVERS
        .active-row.border-divider(v-for="activeServer in servers.active" :key="activeServer.serverId")
          Active(:serverStatus="activeServer")
      .col.empty-list
        h2.border-divider EMPTY Quake Servers
        EmptyServerTable(:serverStatuses="servers.empty")
</template>

<script lang="ts">
import { getStatus } from '../services/serversApi'
import { defineComponent, Ref, ref, onBeforeUnmount, computed } from 'vue'
import {ServerStatus} from '@/model/ServerStatus'
import {partition, sort} from 'ramda'
import Active from '@/components/servers/Active.vue'
import EmptyServerTable from '@/components/servers/EmptyServerTable.vue'

const lastActiveTime = (server: ServerStatus) => new Date(server.recentMatchStart).getTime()
const sortEmpty = sort((a: ServerStatus, b: ServerStatus) => lastActiveTime(b) -lastActiveTime(a))
const sortActive = sort((a: ServerStatus, b: ServerStatus) => b.players.length - a.players.length)

export default defineComponent({
  name: 'Home',
  components: {
    Active, EmptyServerTable
  },
  setup() {
    const serverStatuses: Ref<ServerStatus[]> = ref([])
    const update = () => getStatus().then(servers => {
      serverStatuses.value = servers
    })
    
    const servers = computed(() => {
      const [active, empty] = partition((server: ServerStatus) => server.currentStatus === 0 && server.players.length > 0, serverStatuses.value)
      return {
        active: sortActive(active), 
        empty: sortEmpty(empty)
      }
    })

    var id = setInterval(update, 5000)
    onBeforeUnmount(() => clearInterval(id))
    update()

    return {
      servers
    }
  }
});
</script>

<style lang="scss">
.home {
  margin: 1rem;
  .servers-list {
    display: flex;
    width: 100%;
  }
  h2 {
    padding: .5rem 0;
  }
  .active-row {
    padding: 1rem 0;
  }
  .border-divider {
    border-bottom: 1px solid $grey-2;
  }
}
</style>