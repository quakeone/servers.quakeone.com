<script lang="ts" setup>
import {duration} from '@/helpers/date'
import type {Match} from '@/model/Match'
import {defineProps, computed, inject} from 'vue'
import type { Writer } from '@/helpers/charmap'
import type { Player } from '@/model/Player'
import PlayersTooltip from '@/components/PlayersTooltip.vue'
import { matchTimeSeconds } from '@/helpers/player'
import type { MatchPlayer } from '@/model/MatchPlayer'
import { differenceInSeconds } from 'date-fns'
import ProgressGraph from './ProgressGraph.vue'

const props = defineProps<{
  match: Match,
  expanded: boolean
}>()

const charWriter = inject<Writer>('charWriter')
const players = computed(() => {
  const sorted = [...props.match.players].sort((a, b) => b.frags - a.frags)
  if (!props.expanded) {
    return sorted.slice(0,3)
  }
  return sorted
})
const playTime = (player: MatchPlayer) => {
  const dbEnd = player.playerMatchEnd || props.match.matchEnd
  const end = dbEnd ? new Date(dbEnd) : new Date()
  
  return Math.ceil(differenceInSeconds(end, new Date(player.playerMatchStart)) / 60)
}
</script>

<template lang="pug">
.ffa-match(:class="{expanded: props.expanded}")
  .player-list 
    .list-head
      .ch.title Top Three
      .ch Time
    .list-body
      .row(style="line-height: 1;" v-for="player in players")
        .col(style="text-align:right;")
          img(:src="charWriter.writeScore(14, player.frags, player.shirtColor, player.pantColor)" style="display:inline;")
        .col.name(style="padding-left: 1rem; text-align: left")
          img(:src="charWriter.write(12, player.nameRaw)" style="display:inline;")
        .col.play-time
          span.bright {{playTime(player)}} 
          span  mins
  .progress(v-if="props.expanded")
    .list-head
      .ch.title Progress

    ProgressGraph(:match="props.match" :height="75" :width="300")
  .remaining(v-if="props.match.players.length > 3 && !props.expanded")
    PlayersTooltip(:players="props.match.players") {{props.match.players.length - 3}} more
</template>

<style lang="scss" scoped>
.ffa-match {
  display: grid;
  grid-template-columns: auto;
  grid-template-areas:
    "players"
    "remaining";
  .progress {
    grid-area: progress;
  }
  .remaining {
    grid-area: remaining;
  }
  &.expanded {
    grid-template-areas:
      "players progress";
    .list-body {
      
      grid-template-columns: min-content auto 5rem;

    }
  }
  .list-head {
      background-color: $grey-2;
      font-weight: bold;
  }
  .player-list {
    grid-area: players;
    .list-head {
      display: grid;
      grid-template-columns: auto 5rem;
      .ch {
        text-align: center;
      }
    }
    .list-body {
      display: grid;
      grid-template-columns: min-content auto 5rem;
      .row {
        display: contents;
        .col.name {
          overflow: hidden;
        }
        col.play-time {
          border-left: 1px solid $grey-2;
          text-align: right;
        }
        // .col.progress {
        //   grid-row: 1/-1;

        // }
      }
    }
  }
}
.status-container {
  margin-top: 1rem;
  display: flex;
  align-items: flex-start;
}
</style>