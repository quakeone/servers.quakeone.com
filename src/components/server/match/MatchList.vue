<template lang="pug">
.match-list
  .match-container(v-for="match in sortedMatches")
    MatchInstance(
      :key="match.serverMatchId"
      :match="match" 
      @requestExpand="matchId => model.expandedItem = matchId" 
      @requestCollapse="() => model.expandedItem = -1" 
      :expanded="match.serverMatchId === model.expandedItem")

  .match-pager
    Pager(:currentPage="props.pageNum" :pageCount="matchPages" @newPage="emits('newPage', $event)")

</template>


<script setup lang="ts">
import Pager from '@/components/Pager.vue'
import type {PagedResult} from '@/model/PagedResult'
import MatchInstance from '@/components/server/match/MatchInstance.vue'
import {parseApiMatch} from '@/helpers/match'
import {getServerMatches} from '@/services/serversApi'
import type {Match as MatchModel} from '@/model/Match'
import { reactive , computed } from 'vue'

const props = defineProps<{
  matches: PagedResult<MatchModel>,
  pageNum: number
}>()

const emits = defineEmits<{
  (e: 'newPage', pageNum: number): void
}>()

const expandRequested = (matchId: number) => {
  model.expandedItem = matchId
}
const model = reactive<{
  pageLength: number,
  expandedItem: number
}>({pageLength: 10, expandedItem: -1});

const matchPages = computed(() => Math.ceil((props.matches ? props.matches.totalResults : 0) / model.pageLength))
const sortedMatches = computed(() => (props.matches ? [...props.matches.results] : []).sort((b, a) => 
  new Date(a.matchStart).getTime() - new Date(b.matchStart).getTime()))

</script>
<style lang="scss">

.match-container {
  margin: 1rem 0;
  padding-top: 1rem;
  border-top: 1px solid $grey-2;
}
</style>