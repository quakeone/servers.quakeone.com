
<template lang="pug">
.map-image(ref="image")
  PlayerScoreList.player-list(:players="playerList")
</template>

<script lang="ts">
import { defineComponent , onMounted, ref, PropType} from 'vue'
import { PlayerStatus } from '@/model/PlayerStatus'
import PlayerScoreList from './PlayerScoreList.vue'

export default defineComponent({
  props: {
    map: {
      type: String,
      required: true
    },
    playerList: {
      type: Array as PropType<PlayerStatus[]>,
      required: true
    }
  },
  components: {PlayerScoreList},
  setup (props) {
    const imageExists = ref(true)
    const image = ref<HTMLImageElement|null>(null)
    const base = 'https://quakedemos.blob.core.windows.net/maps/thumbnails/'
    const generic = base + '_generic.png'
    const map = base + props.map + '.jpg'

    onMounted(() => {
      if (image.value) {
        image.value.style.backgroundImage = `url(${map}), url(${generic})`
      }
    })

    return {
      image
    }
  }
})
</script>
<style lang="scss">
.map-image {
  background-repeat: no-repeat;
  background-size: 100%;
  padding: 1rem;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;

}
</style>