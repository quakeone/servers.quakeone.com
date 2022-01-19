<template lang="pug">
.empty-row
  MapImage(:map="serverStatus.map")
    .grid
      .detail
        H3 {{serverStatus.serverName}}
        ServerAddress.bright(:address="serverStatus.dNS" :port="serverStatus.port")
        div  {{gameType}}


      .secondary
        .mod(v-if="serverStatus.modificationCode")
          span Game Type:  
          span.bright {{serverStatus.modificationCode}}
        .location
          span Location:  
          span.bright {{serverStatus.location || 'Unknown'}}
    .map-text {{serverStatus.map}}
</template>

<script lang="ts">
import MapImage from '../MapImage.vue'
import { ServerStatus } from '@/model/ServerStatus'
import ServerAddress from '../ServerAddress.vue'
import {PropType, defineComponent, computed} from 'vue'

const gameTypeMap: Record<number, string> = {
  0: "Net Quake",
  1: "QuakeWorld",
  2: "Quake II",
  3: "Quake 3",
  4: "Quake IV",
  5: "Quake Enhanced"
}

export default defineComponent({
  components: {ServerAddress, MapImage },
  props: {
    serverStatus: {
      type: Object as PropType<ServerStatus>,
      required: true
    }
  },
  setup(props) {
    return {
      gameType: computed(() => gameTypeMap[props.serverStatus.gameId] || 'unknown')
    }
  }
})
</script>

<style lang="scss" scoped>
.empty-row {
  .map-image {
    background-position: right;
    background-size: 50%;
    position: relative;

    .map-text {
      padding: 4px;
      text-shadow: 2px 2px rgba(0,0,0,.9);
      //background-color: rgba(0,0,0,.4);
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
  @media only screen and (min-width: $phone-breakpoint)  {
    .map-image {
      background-size: 150px;
    }
  }
  .grid {
    display: grid;
    @media only screen {
      grid-template-areas: 
        "detail"
        "secondary";
      grid-template-columns: auto;
      .map-image {
        height: 140px;
      }
      .secondary{
        padding-top: 0;
      }
      .detail{
        padding-bottom: 0;
      }
    }
    .detail {
      padding: .5rem;
      grid-area: detail
    }
    .secondary {
      padding: .5rem;
      grid-area: secondary;
    }
    @media only screen and (min-width: $phone-breakpoint)  {
      grid-template-areas: "detail secondary map";
      grid-template-columns: auto 250px 150px;
    }
  }
}
</style>