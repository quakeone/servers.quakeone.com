<template lang="pug">
.active-server
  .thumbnail
    img(:src="`https://quakedemos.blob.core.windows.net/maps/thumbnails/${serverStatus.map}.jpg`")

  .details
    h4 {{serverStatus.dNS}}
    div.bright {{serverStatus.serverName}}
    div
      span port: 
      span.bright {{serverStatus.port}}
      span.vert-divide |
      span.bright {{playerCount}} 
      span  players
    div
      span map: 
      span.bright {{serverStatus.map}}
    div match in progress - {{matchTime}}
  .model
    h4 {{serverStatus.modificationCode}}
</template>

<script lang="ts">
import { ServerStatus } from '@/model/ServerStatus'
import { defineComponent, PropType, computed } from 'vue'
import {dateToUtc, duration} from '@/helpers/date'

export default defineComponent({
  props: {
    serverStatus: {
      type: Object as PropType<ServerStatus>,
      required: true
    }
  },
  setup(props) {
    const matchTime = computed(() => duration(dateToUtc(new Date()).getTime() - new Date(props.serverStatus.recentMatchStart).getTime()))
    return {
      matchTime,
      playerCount: computed(() => `${props.serverStatus.playerData.length}/${props.serverStatus.maxPlayers}`),
      players: computed(() => [...props.serverStatus.playerData].sort((a, b) => b.currentFrags - a.currentFrags))
    }
  }
})
</script>

<style lang="scss">
.active-server {
  display: flex;

  .thumbnail {
    img {
      width: 200px;
    }
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 120px;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  }
  .details {
    h4 {
      margin: 0 0 .5rem 0 ;
    }
    .vert-divide {
      margin: 0.5rem;
    }
    padding-left: 1.5rem;
  }
}
.active-server-card {
  border: 1px solid grey;

  padding: 2rem;
  margin: 1rem;
  width: 10rem;
  .player-list {
    .player-list__player {
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>