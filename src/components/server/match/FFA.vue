<script lang="ts" setup>
import {duration} from '@/helpers/date'
import type {Match} from '@/model/Match'
import {defineProps, computed, inject} from 'vue'
import type { Writer } from '@/helpers/charmap'
import type { Player } from '@/model/Player'
import PlayersTooltip from '@/components/PlayersTooltip.vue'
import { matchTimeSeconds } from '@/helpers/player'
import type { MatchPlayer } from '@/model/MatchPlayer'

const props = defineProps<{match: Match}>()

const charWriter = inject<Writer>('charWriter')
const topThree = computed(() => [...props.match.players].sort((a, b) => b.frags - a.frags).slice(0,3))
const playTime = (player: MatchPlayer) => Math.ceil(matchTimeSeconds(player) / 60)

</script>

<template lang="pug">
.ffa-match
  .player-list
    .list-head
      .ch.title Top Three
      .ch Time
    .list-body
      .row(style="line-height: 1;" v-for="player in topThree")
        .col(style="text-align:right;")
          img(:src="charWriter.writeScore(14, player.frags, player.shirtColor, player.pantColor)" style="display:inline;")
        .col.name(style="padding-left: 1rem; text-align: left")
          img(:src="charWriter.write(12, player.nameRaw)" style="display:inline;")
        .col.play-time
          span.bright {{playTime(player)}} 
          span  mins
  .remaining(v-if="props.match.players.length > 3")
    PlayersTooltip(:players="props.match.players") {{props.match.players.length - 3}} more
</template>

<style lang="scss" scoped>
.player-list {
  margin-top: 1rem;
}
.play-time {
  border-left: 1px solid $grey-2;
  text-align: right;
}
.list-head {
  display: grid;
  grid-template-columns: auto 5rem;
  background-color: $grey-2;
  font-weight: bold;
  .ch {
    text-align: center;
  }
}
.list-body {
  display: grid;
  .row {
    display: contents;
    .col.name {
      overflow: hidden;
    }
  }
  grid-template-columns: min-content auto 5rem;
}
</style>