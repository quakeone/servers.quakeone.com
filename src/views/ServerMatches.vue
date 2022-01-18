<template lang="pug">
.home
  .match-list.grid-area-matches
    h2.border-divider SERVER MATCHES
    .matches-row.border-divider(v-for="match in matches" :key="match.matchId")
      MatchRow(:match="match")
</template>

<script lang="ts">
import { getServerMatches } from '../services/serversApi'
import { defineComponent, Ref, ref, onBeforeUnmount, computed } from 'vue'
import {ServerStatus} from '@/model/ServerStatus'
import MatchRow from '@/components/matches/Match.vue'
import { Match } from '@/model/Match'

const lastActiveTime = (server: ServerStatus) => new Date(server.recentMatchStart).getTime()

export default defineComponent({
  props: {
    serverId: {
      type: Number,
      required: true
    }
  },
  name: 'Home',
  components: {
    MatchRow
  },
  setup(props) {
    const totalRecords = ref(0);
    const matches = ref<Match[]>([])
    const update = () => getServerMatches(props.serverId).then(_matches => {
      matches.value = _matches.results
      totalRecords.value = _matches.totalResults
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