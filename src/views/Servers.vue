<template lang="pug">
.servers
  .header
    .tabs 
      GameFilter(:gameId="gameId")
    .links
      p.text-small
        a(href="/about") About
  .active(v-if="loading === 'IDLE'")
    template(v-if="servers.active.length === 0")
      h3 There are currently no active players
      h4 Join a server or find a player on discord ( 
        a(href="https://discord.quakeone.com/" title='Net Quake Community Discord') NQ
        |  | 
        a(href="https://discord.gg/HWes2p9gXG" title="Quake:Enhanced Community Discord") QE
        |  )
    template(v-else)
      ActiveServerGrid.section(:servers="servers.active")
  .empty(v-if="loading === 'IDLE'")
    EmptyServerTable.section(:servers="servers.empty")

</template>

<script lang="ts">
import GameFilter from '@/components/GameFilter.vue'
import {LoadingState} from '@/model/LoadingState'
import { getStatus } from '../services/serversApi'
import { defineComponent, Ref, ref, onBeforeUnmount, computed } from 'vue'
import {ServerStatus} from '@/model/ServerStatus'
import {partition, sort, filter, pipe} from 'ramda'
import ActiveServerGrid from '@/components/servers/ActiveServerGrid.vue'
import EmptyServerTable from '@/components/servers/EmptyServerTable.vue'
import {isIdlePlayer, isFteServer} from '@/helpers/server'

const lastActiveTime = (server: ServerStatus) => new Date(server.lastMatchStart).getTime()
const sortEmpty = sort((a: ServerStatus, b: ServerStatus) => b.currentStatus === 0 
  ? lastActiveTime(b) - lastActiveTime(a)
  : -1)

const sortActive = sort((a: ServerStatus, b: ServerStatus) => b.players.length - a.players.length)

export default defineComponent({
  name: 'Servers',
  components: {
    ActiveServerGrid,
    EmptyServerTable,
    GameFilter
  },
  props: {
    gameId: {
      type: String,
      default: () => ''
    }
  },
  setup(props) {
    const loading = ref<LoadingState>('LOADING')
    const serverStatuses: Ref<ServerStatus[]> = ref([])
    const update = () => getStatus().then(servers => {
      serverStatuses.value = servers
      loading.value = 'IDLE'
    })
    
    const servers = computed(() => {
      const filtered = filter((s:ServerStatus) => 
          props.gameId === '' || isFteServer(s) || s.gameId.toString() === props.gameId)(serverStatuses.value)

      const [active, empty] = partition((server: ServerStatus) => {
        return server.currentStatus === 0 && server.players.filter(p => !isIdlePlayer(p)).length > 0
      }, filtered)
      return {
        active: sortActive(active), 
        empty: sortEmpty(empty)
      }
    })

    var id = setInterval(update, 5000)
    onBeforeUnmount(() => clearInterval(id))
    update()

    return {
      servers,
      loading
    }
  }
});
</script>

<style lang="scss">
.servers {
  .header {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .links {
    font-size: .9rem;
  }
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