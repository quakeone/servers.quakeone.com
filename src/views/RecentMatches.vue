<template lang="pug">
.home
  .match-list.grid-area-matches
    h2.border-divider RECENT MATCHES
    .active-row.border-divider(v-for="match in matches" :key="match.matchId")
      Match(:serverStatus="match")


</template>

<script lang="ts">
import { getStatus } from '../services/serversApi'
import { defineComponent, Ref, ref, onBeforeUnmount, computed } from 'vue'
import {ServerStatus} from '@/model/ServerStatus'
import {partition, sort} from 'ramda'
import Active from '@/components/servers/Active.vue'
import EmptyServerTable from '@/components/servers/EmptyServerTable.vue'
import { Match } from '@/model/Match'

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
    
    const matches: Match[] = []

    var id = setInterval(update, 5000)
    onBeforeUnmount(() => clearInterval(id))
    update()

    return {
      matches
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