<template lang="pug">
.servers
  ActiveServerGrid.section(:servers="servers.active")
  EmptyServerTable.section(:servers="servers.empty")

</template>

<script lang="ts">
import { getStatus } from '../services/serversApi'
import { defineComponent, Ref, ref, onBeforeUnmount, computed } from 'vue'
import {ServerStatus} from '@/model/ServerStatus'
import {partition, sort} from 'ramda'
import ActiveServerGrid from '@/components/servers/ActiveServerGrid.vue'
import EmptyServerTable from '@/components/servers/EmptyServerTable.vue'

const lastActiveTime = (server: ServerStatus) => new Date(server.recentMatchStart).getTime()
const sortEmpty = sort((a: ServerStatus, b: ServerStatus) => lastActiveTime(b) -lastActiveTime(a))
const sortActive = sort((a: ServerStatus, b: ServerStatus) => b.players.length - a.players.length)

export default defineComponent({
  name: 'Servers',
  components: {
    ActiveServerGrid,
    EmptyServerTable
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
.servers {
  .section {
    margin-top: 1rem;
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