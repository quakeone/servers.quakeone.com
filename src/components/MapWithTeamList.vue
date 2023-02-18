
<template lang="pug">
MapImage(:map="map")
  .table-backdrop
    .team-listing
      .player-list(v-for="team in teams.teams")
        InlineScore(v-for="player in teams.teams" :playerOrTeam="team")
      .observer-list
        InlineScore(v-for="player in teams.observers" :playerOrTeam="player")
  slot
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Player } from '@/model/Player'
import MapImage from './MapImage.vue'
import type {Teams} from '@/model/Teams'
import InlineScore from './InlineScore.vue'

const props = defineProps<{
  map: string,
  playerList: Teams
}>()

</script>
<style lang="scss" scoped>
.table-backdrop {
  // background-color: rgba(0,0,0,.2);
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(to bottom,  black 80%, transparent 98%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 98%);
  padding-top: 68%;
  //width: 100%;
  table {
    position: absolute;
    top: 0;
    margin: 1rem;
    table-layout:fixed;
    td {
      white-space: nowrap
    }
  }
.map-image {
  position: relative;
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
    
 
  }
}
</style>