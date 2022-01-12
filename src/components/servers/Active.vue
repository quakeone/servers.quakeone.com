<template lang="pug">
.active-server
  .thumbnail
    MapImage(:map="serverStatus.map")

  .details
    .space-between-row
      h4 {{serverStatus.serverName}}
      h4 {{gameType}}
    .space-between-row.hostname
      
      .bright {{serverStatus.dNS}}:{{serverStatus.port}}
      
      .bright {{serverStatus.modificationCode}}
    div 
      span Location 
      span.bright  {{serverStatus.location || 'unknown'}}
    div(v-if="serverStatus.currentStatus === 0")
      span map: 
      span.bright {{serverStatus.map}}
      span.vert-divide |

      span.bright(v-tippy="{allowHTML: true,showOnCreate: true}"
        :content="playerTooltipHtml") {{playerCount}} 
      span  players
    div(v-else) {{serverStatusString}}
    div {{matchStatus}} {{matchTime}}
</template>

<script lang="ts">
import { ServerStatus } from '@/model/ServerStatus'
import { defineComponent, PropType, computed, watch, ref } from 'vue'
import {dateToUtc, duration} from '@/helpers/date'
import MapImage from '../MapImage.vue'
import { createWriter, Writer } from '@/helpers/charmap'
import { PlayerStatus } from '@/model/PlayerStatus'

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
  components: {MapImage},
  props: {
    serverStatus: {
      type: Object as PropType<ServerStatus>,
      required: true
    }
  },
  setup(props) {
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

    watch(props, (newValue) => {
      createWriter()
        .then((writer: Writer) => {
          const server = newValue.serverStatus
          if (server.currentStatus !== 0) {
            return ''
          }
          const body = [...server.players]
            .sort((a, b) => b.currentFrags - a.currentFrags)
            .map((player: PlayerStatus) => {
              return `<tr style="line-height: 1;">
              <td style="text-align:right;">
                <img src="${writer.writeScore(14, player.currentFrags, player.shirt, player.pant)}" style="display:inline;">
              </td>
              <td style="padding-left: 1rem; text-align: left">
                <img src="${writer.write(12, btoa(player.name))}" style="display:inline;">
              </td>
              </tr>`;
            })
            .join('');

          playerTooltipHtml.value = `<table><tbody>${body}</tbody></table>`;
        })
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
  width: 100%;
  h4 {
    margin: 0 0 .5rem 0;
  }
  display: flex;
  .thumbnail {
    img {
      max-width:100%;
      max-height:100%;
    }
    max-width: 180px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
  }
  .details {
    display: flex;
    justify-content: space-between;
    min-width: 400px;;
    .vert-divide {
      margin: 0.5rem;
    }
    padding-left: 1.5rem;
    display: flex; 
    flex-direction: column;
    justify-content: flex-start;
    .space-between-row {
      display: flex;
      justify-content: space-between;
      &.hostname {
        margin-bottom: .4rem;
      }
    }
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