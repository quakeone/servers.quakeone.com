<template lang="pug">
.empty-row(@click="rowClick")
  .game-type 
    .game-type-text
      GameType(
            size="Abbreviated"
            :serverParams="props.serverStatus.parameters"
            :gameId="props.serverStatus.gameId")
  .details

    h3(:class="{'is-down': props.serverStatus.currentStatus !== 0}") {{props.serverStatus.hostname}}
      FontAwesome(
        v-if="props.serverStatus.currentStatus !== 0" 
        :icon="['fas', 'exclamation-circle']"
        v-tippy :content="serverStatusMap[props.serverStatus.currentStatus]")
    .address-line
      ServerAddressInline.bright(:address="props.serverStatus.address" :port="props.serverStatus.port")
      span.vert-divide |
      Location(:location="props.serverStatus.locality", :country="props.serverStatus.country")
    .mid
      ModMode(v-if="props.serverStatus.mod" :mod="props.serverStatus.mod" :mode="props.serverStatus.mode")
      span.vert-divide(v-if="props.serverStatus.mod") |
      span map
      span.bright {{props.serverStatus.map}}
      span.vert-divide |
      span players
      span.bright {{props.serverStatus.players.length}}/{{props.serverStatus.maxPlayers}}
    .bottom
      span {{matchStatus}}
  .map-image
    MapImage(:map="props.serverStatus.map")
      .map-text {{props.serverStatus.map}}
</template>

<script lang="ts" setup>
import MapImage from '../MapImage.vue'
import type { ServerStatus } from '@/model/ServerStatus'
import ServerAddressInline from '../ServerAddressInline.vue'
import {computed} from 'vue'
import GameType from '../GameType.vue'
import * as match from '@/helpers/match'
import ModMode from '@/components/ModMode.vue'
import Location from '@/components/Location.vue'
import {useRouter} from 'vue-router'

const router = useRouter();
const serverStatusMap: Record<number, string> = {
  0: 'Running',
  1: 'Server is down',
  2: 'Server not found',
  3: 'Query Error'
}

const props = defineProps<{serverStatus: ServerStatus}>()

const matchStatus = computed(() => 
  props.serverStatus.currentStatus !== 0 
  ? serverStatusMap[props.serverStatus.currentStatus]
  : match.status(props.serverStatus.lastMatchStart, props.serverStatus.lastMatchEnd));
const rowClick = () => {
  router.push('/server/' + props.serverStatus.serverId)
}
</script>

<style lang="scss" scoped>
.empty-row {
  display: grid;
  padding: .5rem 0;
  &:hover {
    cursor: pointer;
    background-color: color.adjust($dark-grey, $lightness: 3%);
  }

  .game-type {
    padding: .5rem 0;
    grid-area: gametype;
    font-weight: bold;
    overflow: hidden;
    display: flex;
    justify-content: center;
    border-left: solid 1px $grey-2;
    .game-type-text {
      text-align: center;
      padding: 0 .25rem;
    }
  }
  .details {
    padding: .5rem 0;
    grid-area: details;
    min-width: 0;
    h3 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .address-line {
      display: flex;
      align-items: center;
      gap: .25rem;
      min-width: 0;
      overflow: hidden;
    }
    .mid {
      display: flex;
      align-items: center;
      gap: .25rem;
    }
    .is-down {
      a {
        color: $light-brown;
      }
      .fa-circle-exclamation {
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
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }

  grid-template-areas:
    "details gametype";
  grid-template-columns: auto 3.5rem;
  
  @media only screen and (min-width: $phone-breakpoint)  {
    .map-image {
      display: block;
    }
    .details {
      margin-left: 1rem;
    }
    
    .game-type {
      border-right: 1px $grey-2 solid;
      border-left: 0;
      .game-type-text {
        text-align: left;
      }
    }
    grid-template-columns: 3rem auto 150px;
    grid-template-areas: 
      "gametype details map";
  }
}
</style>
