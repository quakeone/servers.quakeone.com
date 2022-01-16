<template lang="pug">
.active-server
  .game-image
    MapWithPlayerList(
      :map="serverStatus.map", 
      :playerList="serverStatus.players")
  .details
    .title
      h3 {{serverStatus.serverName}}
      div {{gameType}}
    .bright 
      ServerAddress(:address="serverStatus.dNS" :port="serverStatus.port")
    div 
      span mod: 
      span.bright {{serverStatus.modificationCode}}
    div 
      span Location 
      span.bright  {{serverStatus.location || 'unknown'}}
    div(v-if="serverStatus.currentStatus === 0")
      span map: 
      span.bright {{serverStatus.map}}
      span.vert-divide |

      span.bright(v-tippy="{allowHTML: true}"
        :content="playerTooltipHtml") {{playerCount}} 
      span  players
    div(v-else) {{serverStatusString}}
    div.match-status {{matchStatus}} {{matchTime}}

</template>

<script lang="ts">
import { ServerStatus } from '@/model/ServerStatus'
import { defineComponent, PropType, computed, watch, ref, inject } from 'vue'
import {dateToUtc, duration} from '@/helpers/date'
import ServerAddress from '../ServerAddress.vue'
import { PlayerStatus } from '@/model/PlayerStatus'
import { Writer } from '@/helpers/charmap'
import MapWithPlayerList from '../MapWithPlayerList.vue'

const gameTypeMap: Record<number, string> = {
  0: "Net Quake",
  1: "QuakeWorld",
  2: "Quake II",
  3: "Quake 3",
  4: "Quake IV",
  5: "Quake Enhanced"
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
      if (!props.serverStatus.recentMatchStart) {
        return 'No previous match recorded'
      } else if (!props.serverStatus.recentMatchEnd) {
        return "Match in progress - "
      } else if (props.serverStatus.recentMatchStart < props.serverStatus.recentMatchEnd) {
        return "Last match " + duration(dateToUtc(new Date()).getTime() - new Date(props.serverStatus.recentMatchEnd).getTime()) + " ago"
      }
      return  ''
    })
    const matchTime = computed(() => {
      if (!props.serverStatus.recentMatchStart || props.serverStatus.recentMatchStart < props.serverStatus.recentMatchEnd) {
        return ""
      }
      return duration(dateToUtc(new Date()).getTime() - new Date(props.serverStatus.recentMatchStart).getTime())
    })
    const serverStatusString = computed(() => {
      return serverStatusMap[props.serverStatus.currentStatus] || 'Unknown'
    })
    const playerTooltipHtml = ref('')
    const gameType = computed(() => gameTypeMap[props.serverStatus.gameId] || 'Unknown Game')
    const sortedPlayers = computed(() => [...props.serverStatus.players].sort((a, b) => b.currentFrags - a.currentFrags))

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
            <img src="${charWriter.writeScore(14, player.currentFrags, player.shirt, player.pant)}" style="display:inline;">
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
      players: computed(() => [...props.serverStatus.players].sort((a, b) => b.currentFrags - a.currentFrags)),
      playerTooltipHtml
    }
  }
})
</script>

<style lang="scss">
.active-server {
  display: grid;
  grid-gap: 1em;
  @media only screen {
    grid-template-areas:
    "map"
    "details";
  }
  @media only screen and (min-width: 500px)  {
    grid-template-columns: 400px auto;
    grid-template-areas:
    "map   details";
  }
  .game-image {
    grid-area: map;
  }
  .details {
    grid-area: details;
    .title {
      margin-bottom: 1.5rem;
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