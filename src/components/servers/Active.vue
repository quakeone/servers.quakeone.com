<template lang="pug">
.active-server
  .server-title.bright 
    h4 {{serverStatus.serverName}}
    h4 {{gameType}}
  .server-body
    .thumbnail
      MapImage(:map="serverStatus.map")

    .details
      .left-part
        h4 {{serverStatus.dNS}}:{{serverStatus.port}}
        div 
          span Location 
          span.bright  {{serverStatus.location}}
        div
          span map: 
          span.bright {{serverStatus.map}}
          span.vert-divide |
          span.bright(v-tippy="{allowHTML: true,showOnCreate: true}"
            :content="playerTooltipHtml") {{playerCount}} 
          span  players
        div match in progress - {{matchTime}}
      .right-part
        h4 {{serverStatus.modificationCode}}
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
export default defineComponent({
  components: {MapImage},
  props: {
    serverStatus: {
      type: Object as PropType<ServerStatus>,
      required: true
    }
  },
  setup(props) {
    const matchTime = computed(() => duration(dateToUtc(new Date()).getTime() - new Date(props.serverStatus.recentMatchStart).getTime()))
    const playerTooltipHtml = ref('')
    const gameType = computed(() => gameTypeMap[props.serverStatus.gameId] || 'Unknown Game')
    // https://quakedemos.blob.core.windows.net/maps/thumbnails/_generic.png
    watch(props, (newValue) => {
      createWriter()
        .then((writer: Writer) => {
          const server = newValue.serverStatus
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
      gameType,
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
  flex-direction: column;
  .server-title {
    display: flex;
    justify-content: space-between;
  }
  .server-body {
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
      display: flex;
      justify-content: space-between;
      .vert-divide {
        margin: 0.5rem;
      }
      padding-left: 1.5rem;
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