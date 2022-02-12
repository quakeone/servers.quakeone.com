
<template lang="pug">
MapImage(:map="map")
  .table-backdrop
    TeamScoreList.player-list(:teams="teams")
  slot
</template>

<script lang="ts">
import { defineComponent , onMounted, ref, PropType, computed, watch} from 'vue'
import PlayerScoreList from './PlayerScoreList.vue'
import { Player } from '@/model/Player'
import MapImage from './MapImage.vue'
import TeamScoreList from './TeamScoreList.vue'
import {Teams} from '@/model/Teams'

export default defineComponent({
  props: {
    map: {
      type: String,
      required: true
    },
    teams: {
      type: Object as PropType<Teams>,
      required: true
    }
  },
  components: { TeamScoreList, MapImage }
})
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