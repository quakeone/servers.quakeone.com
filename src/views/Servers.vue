<template lang="pug">
.servers
  .header
    .tabs
      GameFilter(:gameId="gameId")
    .links
      p.text-small
        a(href="/about") About
  .loading-container(v-if="loading === 'LOADING'")
    Loading
  .error-container(v-else-if="loading === 'ERROR'")
    h3 Unable to reach the server list
    h4
      a(@click.prevent="retry") Try again
  template(v-else)
    .active
      template(v-if="servers.active.length === 0")
        h3 There are currently no active players
        h4 Join a server or find a player on discord (
          a(href="https://discord.quakeone.com/" title='Net Quake Community Discord') NQ
          |  |
          a(href="https://discord.gg/HWes2p9gXG" title="Quake:Enhanced Community Discord") QE
          |  )
      template(v-else)
        ActiveServerGrid.section(:servers="servers.active")
    .empty
      EmptyServerTable(:servers="servers.empty")

</template>

<script lang="ts">
import GameFilter from '@/components/GameFilter.vue'
import Loading from '@/components/Loading.vue'
import {LoadingState} from '@/model/LoadingState'
import { getStatus } from '../services/serversApi'
import { defineComponent, Ref, ref, onBeforeUnmount, computed } from 'vue'
import {ServerStatus} from '@/model/ServerStatus'
import {partition, sort, filter} from 'ramda'
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
    GameFilter,
    Loading
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
    }).catch(() => {
      if (loading.value !== 'IDLE') loading.value = 'ERROR'
    })
    const retry = () => {
      loading.value = 'LOADING'
      update()
    }

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

    let id = setInterval(update, 5000)
    const onVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(id)
      } else {
        update()
        id = setInterval(update, 5000)
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)
    onBeforeUnmount(() => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    })
    update()

    return {
      servers,
      loading,
      retry
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
    gap: .5rem;
    margin-bottom: .5rem;
    @media only screen and (max-width: $phone-breakpoint) {
      flex-wrap: wrap;
    }
  }
  .links {
    font-size: .9rem;
  }
  .empty {
    margin-top: 2.5rem;
  }

  h2 {
    padding: .5rem 0;
  }
}
</style>