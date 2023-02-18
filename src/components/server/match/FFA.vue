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
import InlineScore from '../../InlineScore.vue'

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
.ffa-match
  .player-list
    .list-head
      .ch.title(v-if="props.expanded") Players
      .ch.title(v-else) Top Three
      .ch Time
    .list-body
      .row(style="line-height: 1;" v-for="(player,idx) in players")
        .col.icon
          FontAwesome(v-if="idx === 0" :icon="['fas', 'trophy']" )
        .col(style="text-align:right;")
          InlineScore(:playerOrTeam="player")
        .col.play-time
          span.bright {{playTime(player)}} 
          span  mins

  .remaining(v-if="props.match.players.length > 3 && !props.expanded")
    PlayersTooltip(:players="props.match.players") {{props.match.players.length - 3}} more
</template>

<style lang="scss" scoped>
.player-list {
  margin-top: .5rem;
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
      text-align: left;
      padding-left: .4rem;
    }
    .col.type {
      padding-left: .4rem;
    }
    .col.icon {
      text-align: center;
    }
  }
  grid-template-columns: 2rem auto 5rem;
}
</style>