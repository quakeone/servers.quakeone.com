<template lang="pug">
.card.server-card
  h4.server-name {{ serverStatus.hostname }} - {{playerCount}}
  .player-list
    .player-list__player(v-for="player in players")
      .player__name {{player.name}}
      .player__frags {{player.frags}}
</template>

<script lang="ts">
import { ServerStatus } from '@/model/ServerStatus'
import { defineComponent, PropType, computed } from 'vue'

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
      players: computed(() => [...props.serverStatus.players].sort((a, b) => b.frags - a.frags))
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
