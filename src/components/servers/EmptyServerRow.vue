<template lang="pug">
.empty-row
  .game-type 
    .game-type-text
      GameType(:gameId="serverStatus.gameId")
  .details
    h3(:class="{'is-down': serverStatus.currentStatus !== 0}")
      router-link(:to="'/server/' + serverStatus.serverId") {{serverStatus.serverName}}
      FontAwesome(
        v-if="serverStatus.currentStatus !== 0" 
        :icon="['fas', 'exclamation-circle']"
        v-tippy :content="serverStatusMap[serverStatus.currentStatus]")
    ServerAddressInline.bright(:address="serverStatus.dNS" :port="serverStatus.port")
    div  
    .mod(v-if="serverStatus.modificationCode")
      span.bright {{serverStatus.modificationCode}}
      span.vert-divide |
      span
        FontAwesome.map-icon(:icon="['fas', 'map-marker-alt']")
      span.bright {{serverStatus.location || 'Unknown'}}
    .bottom
      span map  
      span.bright {{serverStatus.map}}
      span.vert-divide |
      span players 
      span.bright 0/{{serverStatus.maxPlayers}}
      span.vert-divide | 
      span {{matchStatus}}
  .map-image
    MapImage(:map="serverStatus.map")
      .map-text {{serverStatus.map}}
</template>

<script lang="ts">
import MapImage from '../MapImage.vue'
import { ServerStatus } from '@/model/ServerStatus'
import ServerAddressInline from '../ServerAddressInline.vue'
import {PropType, defineComponent, computed} from 'vue'
import GameType from '../GameType.vue'
import * as match from '@/helpers/match'

const serverStatusMap: Record<number, string> = {
  0: 'Running',
  1: 'Not Responding',
  2: 'Server not found',
  3: 'Query Error'
}

export default defineComponent({
  components: {GameType,ServerAddressInline, MapImage },
  props: {
    serverStatus: {
      type: Object as PropType<ServerStatus>,
      required: true
    }
  },
  setup(props) {
    return {
      serverStatusMap,
      matchStatus: computed(() => match.status(props.serverStatus.recentMatchStart, props.serverStatus.recentMatchEnd)),
    }
  }
})
</script>

<style lang="scss" scoped>
.empty-row {
  display: grid;
  .vert-divide {
    margin: 0.5rem;
  }

  .game-type {
    padding: .5rem 0;
    grid-area: gametype;
    font-weight: bold;
    .game-type-text {
      text-align: right;
      border-left: solid 1px $grey-2;
      width: 100%;
    }
  }
  .details {
    padding: .5rem 0;
    grid-area: details;
    .map-icon {
      margin-right: .5rem;
    }
    .is-down {
      color: $light-brown;
      .fa-exclamation-circle {
        color: $error;
        margin-left: 1rem;
      }
    }
  }

  .map-image {
    grid-area: map;
    display: none;
    background-position: right;
    position: relative;
    height: 100%;

    .map-text {
      padding: 4px;
      text-shadow: 2px 2px rgba(0,0,0,.9);
      //background-color: rgba(0,0,0,.4);
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }

  grid-template-areas: 
    "details gametype";
  grid-template-columns: auto 2rem;
  
  @media only screen and (min-width: $phone-breakpoint)  {
    .map-image {
      display: block;
    }
    .details {
      margin-left: 1rem;
    }
    
    .game-type {
      border-right: 1px $grey-2 solid;
      .game-type-text {
        text-align: left;
        border: 0;
      }
    }
    grid-template-columns: 2rem auto 150px;
    grid-template-areas: 
      "gametype details map";
  }
}
</style>