<script lang="ts" setup>
import {duration} from '@/helpers/date'
import type {Match} from '@/model/Match'
import {defineProps, computed, inject} from 'vue'
import type { Writer } from '@/helpers/charmap'
import type { Player } from '@/model/Player'
import PlayersTooltip from '@/components/PlayersTooltip.vue'
import {parseTeams} from  '@/helpers/teams'
import type {TeamMatch} from '@/model/TeamMatch'
import type {Teams} from '@/model/Teams'

const charWriter = inject<Writer>('charWriter')
const props = defineProps<{match: TeamMatch}>()
const playTime = player => duration(player.playerStayDuration * 1000)
const btoa = (str: string) => window.btoa(str)

const teamSize = computed(() => props.match.teams.size)
const matchType = computed(() => props.match.matchType)
const teams = computed(() => [...props.match.teams.teams].sort((a,b) => b.totalFrags - a.totalFrags))
const observers = computed(() => props.match.teams.observers)
</script>

<template lang="pug">
.tdm-match
  .header
    .match-type {{matchType}} 
    .match-size {{teamSize}}x{{teamSize}}
  PlayersTooltip(:players="props.match.players") 
    .player-list
    
      .list-body
        .row(style="line-height: 1;" v-for="team in teams")
          .col(style="text-align:right;")
            img(:src="charWriter.writeScore(14, team.totalFrags, team.color, team.color)" style="display:inline;")
          .col.name(style="padding-left: 1rem; text-align: left")
            img(:src="charWriter.write(12, team.nameRaw)" style="display:inline;")

  .remaining(v-if="observers.length > 3") {{observers.length}} observers
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  border-bottom: 1px solid $grey-2;
}
.player-list {
  margin-top: 1rem;
}
.play-time {
  border-left: 1px solid $grey-2;
  text-align: right;
}
.list-head {
  display: grid;
  grid-template-columns: auto;
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
  grid-template-columns: min-content auto ;
}

@media only screen and (min-width: $tablet-breakpoint)  {
  .header {
    div {
      display: none;
    }
  }
}
</style>