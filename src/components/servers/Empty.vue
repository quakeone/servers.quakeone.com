<template lang="pug">
.empty-server
  h4.server-name {{ serverStatus.serverName }} - {{playerCount}}
  .player-list
    .player-list__player(v-for="player in players")
      .player__name {{player.name}}
      .player__frags {{player.currentFrags}}
</template>

<script lang="ts">
import { ServerStatus } from '@/model/ServerStatus'
import { defineComponent, PropType, computed } from 'vue'

const gameTypeMap: Record<number, string> = {
  0: "Net Quake",
  1: "QuakeWorld",
  2: "Quake II",
  3: "Quake 3",
  4: "Quake IV",
  5: "Quake Enhanced"
}

export default defineComponent({
  props: {
    serverStatus: {
      type: Object as PropType<ServerStatus>,
      required: true
    }
  },
  setup(props) {
    return {
      playerCount: computed(() => `${props.serverStatus.players.length}/${props.serverStatus.maxPlayers}`),
      players: computed(() => [...props.serverStatus.players].sort((a, b) => b.currentFrags - a.currentFrags))
    }
  }
})
</script>

<style lang="scss">
.server-card {
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
