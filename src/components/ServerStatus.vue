<template lang="pug">
.card.server-card
  h4.server-name {{ serverStatus.ServerName }} - {{playerCount}}
  .player-list
    .player-list__player(v-for="player in players")
      .player__name {{player.Name}}
      .player__frags {{player.CurrentFrags}}
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
      playerCount: computed(() => `${props.serverStatus.PlayerData.length}/${props.serverStatus.MaxPlayers}`),
      players: computed(() => [...props.serverStatus.PlayerData].sort((a, b) => b.CurrentFrags - a.CurrentFrags))
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
