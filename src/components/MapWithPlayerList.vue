
<template lang="pug">
MapImage(:map="map")
  PlayerScoreList.player-list(:players="playerList")
</template>

<script lang="ts">
import { defineComponent , onMounted, ref, PropType, computed, watch} from 'vue'
import PlayerScoreList from './PlayerScoreList.vue'
import { Player } from '@/model/Player'
import MapImage from './MapImage.vue'

export default defineComponent({
  props: {
    map: {
      type: String,
      required: true
    },
    playerList: {
      type: Array as PropType<Player[]>,
      required: true
    }
  },
  components: { PlayerScoreList, MapImage }
})
</script>
<style lang="scss" scoped>
.map-image {
  padding: 1rem;
  box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
}
</style>