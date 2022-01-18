<template lang="pug">
.active-server
  .game-image
    MapWithPlayerList(
      :map="match.map", 
      :playerList="match.players")
  .details
    .title
      h3 {{match.name}}
      div {{gameType}}
    .bright 
      ServerAddress(:address="match.dns" :port="match.port")
    div 
      span mod: 
      span.bright {{match.modification}}
    div 
      span @: 
      span.bright {{match.matchStart}}
      span.vert-divide |
      span.bright {{Math.floor(match.duration / 60)}} mins

</template>

<script lang="ts">
import { defineComponent, PropType, computed, watch, ref, inject } from 'vue'
import {dateToUtc, duration} from '@/helpers/date'
import ServerAddress from '../ServerAddress.vue'
import { PlayerStatus } from '@/model/PlayerStatus'
import { Writer } from '@/helpers/charmap'
import MapWithPlayerList from '../MapWithPlayerList.vue'
import { Match } from '@/model/Match'
import { MatchPlayer } from '@/model/MatchPlayer'

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
    match: {
      type: Object as PropType<Match>,
      required: true
    }
  },
  setup(props) {
    const charWriter = inject<Writer>('charWriter')
    const playerTooltipHtml = ref('')
    const gameType = computed(() => gameTypeMap[props.match.gameId] || 'Unknown Game')
    const sortedPlayers = computed(() => [...props.match.players].sort((a, b) => b.frags - a.frags))

    watch(props, (newValue) => {
      if (!charWriter) {
        return
      }
      const match = newValue.match
      const body = sortedPlayers.value.map((player: MatchPlayer) => {
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
      gameType,
      players: computed(() => [...props.match.players].sort((a, b) => b.frags - a.frags)),
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