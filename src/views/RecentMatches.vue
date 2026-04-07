<template lang="pug">
.home
  .match-list.grid-area-matches
    h2.border-divider RECENT MATCHES
    .loading-container(v-if="loading === 'LOADING'")
      Loading
    .error-container(v-else-if="loading === 'ERROR'")
      h3 Unable to load recent matches
      h4
        a(@click.prevent="retry") Try again
    template(v-else-if="matches.length === 0")
      h4 No recent matches found
    template(v-else)
      .matches-row.border-divider(v-for="match in matches" :key="match.matchId")
        MatchRow(:match="match")


</template>

<script lang="ts">
import { getRecentMatches } from '../services/serversApi'
import { defineComponent, Ref, ref, onBeforeUnmount } from 'vue'
import MatchRow from '@/components/matches/Match.vue'
import Loading from '@/components/Loading.vue'
import { Match } from '@/model/Match'
import type { LoadingState } from '@/model/LoadingState'

export default defineComponent({
  name: 'RecentMatches',
  components: {
    MatchRow,
    Loading
  },
  setup() {
    const loading = ref<LoadingState>('LOADING')
    const matches = ref<Match[]>([])
    const update = () => getRecentMatches().then(_matches => {
      matches.value = _matches
      loading.value = 'IDLE'
    }).catch(() => {
      if (loading.value !== 'IDLE') loading.value = 'ERROR'
    })
    const retry = () => {
      loading.value = 'LOADING'
      update()
    }

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
      matches,
      loading,
      retry
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