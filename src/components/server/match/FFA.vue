<script lang="ts" setup>
import {duration} from '@/helpers/date'
import MatchShell from './MatchShell.vue'
import Match from '@/model/Match'
import {defineProps, computed, inject} from 'vue'
import { Writer } from '@/helpers/charmap'
import { Player } from '@/model/Player'
import PlayersTooltip from '@/components/PlayersTooltip.vue'

const charWriter = inject<Writer>('charWriter')
const props = defineProps<{match: Match}>()
const topThree = computed(() => [...props.match.players].sort((a, b) => b.frags - a.frags).slice(0,3))
const playTime = player => duration(player.playerStayDuration * 1000)
const btoa = (str: string) => window.btoa(str)
</script>

<template lang="pug">
MatchShell(:match="props.match")
  template(v-slot:standing)
    .player-list
      .list-head
        .ch.title Top Three
        .ch Time
      .list-body
        .row(style="line-height: 1;" v-for="player in topThree")
          .col(style="text-align:right;")
            img(:src="charWriter.writeScore(14, player.frags, player.shirt, player.pant)" style="display:inline;")
          .col.name(style="padding-left: 1rem; text-align: left")
            img(:src="charWriter.write(12, btoa(player.name))" style="display:inline;")
          .col.play-time
            span.bright {{Math.floor(player.playerStayDuration / 60)}} 
            span mins
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