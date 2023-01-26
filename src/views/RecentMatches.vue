<template lang="pug">
.home
  .match-list.grid-area-matches
    h2.border-divider RECENT MATCHES
    .matches-row.border-divider(v-for="match in matches" :key="match.matchId")
      MatchRow(:match="match")


</template>

<script lang="ts">
import { getRecentMatches } from '../services/serversApi'
import { defineComponent, Ref, ref, onBeforeUnmount, computed } from 'vue'
import {ServerStatus} from '@/model/ServerStatus'
import MatchRow from '@/components/matches/Match.vue'
import { Match } from '@/model/Match'

const lastActiveTime = (server: ServerStatus) => new Date(server.lastMatchStart).getTime()

export default defineComponent({
  name: 'Home',
  components: {
    MatchRow
  },
  setup() {
    const matches = ref<Match[]>([])
    const update = () => getRecentMatches().then(_matches => {
      matches.value = _matches
    })

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