<template lang="pug">
.active-server
  .title
    h3 {{serverStatus.serverName}}
    h3.game-type {{gameType}}
  .game-image
    MapWithPlayerList(
      :map="serverStatus.map", 
      :playerList="serverStatus.players")
      .map-lower-right
        .map-players {{playerCount}}
        .map-text {{serverStatus.map}}
  .details
    div  
      span.bright {{serverStatus.modificationCode}}
    .divider  
    ServerAddress(:address="serverStatus.dNS" :port="serverStatus.port")
    .divider
    FontAwesome.map-icon(:icon="['fas', 'map-marker-alt']")
    span.bright  {{serverStatus.location || 'unknown'}}
    div(v-if="serverStatus.currentStatus === 0")
      span Map: 
      span.bright {{serverStatus.map}}
    div.players(v-if="serverStatus.currentStatus === 0")
      span Players: 
      span.bright(v-tippy="{allowHTML: true}"
        :content="playerTooltipHtml") {{playerCount}} 
    div(v-else) {{serverStatusString}}
    div.match-status {{matchStatus}} {{matchTime}}

</template>

<script lang="ts">
import { ServerStatus } from '@/model/ServerStatus'
import { defineComponent, PropType, computed, watch, ref, inject } from 'vue'
import * as match from '@/helpers/match'
import ServerAddress from '../ServerAddress.vue'
import { PlayerStatus } from '@/model/PlayerStatus'
import { Writer } from '@/helpers/charmap'
import MapWithPlayerList from '../MapWithPlayerList.vue'

const gameTypeMap: Record<number, string> = {
  0: "NQ",
  1: "QW",
  2: "Q2",
  3: "Q3",
  4: "Q4",
  5: "QE"
}
const serverStatusMap: Record<number, string> = {
  0: 'Running',
  1: 'Not Responding',
  2: 'Server not found',
  3: 'Query Error'
}

export default defineComponent({
  components: { ServerAddress, MapWithPlayerList },
  props: {
    serverStatus: {
      type: Object as PropType<ServerStatus>,
      required: true
    }
  },
  setup(props) {
    const charWriter = inject<Writer>('charWriter')
    const matchStatus = computed(() => {
      return match.status(props.serverStatus.recentMatchStart, props.serverStatus.recentMatchEnd)
    })
    const matchTime = computed(() => {
      return match.time(props.serverStatus.recentMatchStart, props.serverStatus.recentMatchEnd)
    })
    const serverStatusString = computed(() => {
      return serverStatusMap[props.serverStatus.currentStatus] || 'Unknown'
    })
    const playerTooltipHtml = ref('')
    const gameType = computed(() => gameTypeMap[props.serverStatus.gameId] || 'Unknown Game')
    const sortedPlayers = computed(() => [...props.serverStatus.players].sort((a, b) => b.frags - a.frags))

    watch(props, (newValue) => {
      if (!charWriter) {
        return
      }
      const server = newValue.serverStatus
      if (server.currentStatus !== 0) {
        return ''
      }
      const body = sortedPlayers.value.map((player: PlayerStatus) => {
          return `<tr style="line-height: 1;">
          <td style="text-align:right;">
            <img src="${charWriter.writeScore(14, player.frags, player.shirt, player.pant)}" style="display:inline;">
          </td>
          <td style="padding-left: 1rem; text-align: left">
            <img src="${charWriter.write(12, btoa(player.name))}" style="display:inline;">
          </td>
          </tr>`;
        })
        .join('');

      playerTooltipHtml.value = `<table><tbody>${body}</tbody></table>`;

    }, {immediate: true})

    return {
      matchTime,
      matchStatus,
      gameType,
      serverStatusString,
      playerCount: computed(() => `${props.serverStatus.players.length}/${props.serverStatus.maxPlayers}`),
      players: computed(() => [...props.serverStatus.players].sort((a, b) => b.frags - a.frags)),
      playerTooltipHtml
    }
  }
})
</script>

<style lang="scss" scoped>
.active-server {
  border-top: 1px solid $grey-2;
  display: grid;
  
  .title {
    margin-top: 1rem;
    grid-area: title;
    display: flex; 
    justify-content: space-between;
    h3, h2 {
      // padding-top: rem;
      padding: 0;
      margin: 0;
    }
    .game-type {
      padding-left: 1rem;
      // padding-bottom: .5rem;
      border-left: 1px solid $grey-2;
    }
  }
  .details {
    grid-area: details;
  }
  .game-image {
    grid-area: image;
  }
  .map-lower-right {
    text-align: right;
    padding: 4px;
    color: $grey-3;
    font-weight:  700;
    text-shadow: 2px 2px rgba(0,0,0,.9);
    //background-color: rgba(0,0,0,.4);
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
  grid-template-areas:
    "title  title"
    "image  details";
  grid-gap: 1em;
  grid-template-columns: 60% auto;

  .details {
    .divider {
      margin: 1rem 0;
      border-top: 1px solid $grey-2;
    }
    .title {
      margin-bottom: 1.5rem;
    }
    .map-icon {
      margin-right: .5rem;
    }
    .vert-divide {
      margin: 0.5rem;
    }
    .match-status {
      margin-top: .4rem;
    }
  }
}
</style>