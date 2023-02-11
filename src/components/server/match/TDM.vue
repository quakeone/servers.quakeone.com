<script lang="ts" setup>
import {duration} from '@/helpers/date'
import {defineProps, computed, inject} from 'vue'
import type { Writer } from '@/helpers/charmap'
import type { Player } from '@/model/Player'
import PlayersTooltip from '@/components/PlayersTooltip.vue'
import {parseTeams} from  '@/helpers/teams'
import type {TeamMatch} from '@/model/TeamMatch'
import type {Teams} from '@/model/Teams'

const charWriter = inject<Writer>('charWriter')
const props = defineProps<{
  match: TeamMatch,
  expanded: boolean
}>()
const playTime = player => duration(player.playerStayDuration * 1000)

const toBase64 = (str: string) => window.btoa(str)

const teamSize = computed(() => props.match.teams.size)
const matchType = computed(() => props.match.matchType)
const teams = computed(() => [...props.match.teams.teams].sort((a,b) => b.totalFrags - a.totalFrags))
const observers = computed(() => props.match.teams.observers)
const topPlayers = computed(() => {
  const inLead = teams.value[0]
  const topFrags = inLead.players.reduce((max, p) => p.frags > max ? p.frags : max, 0)
  return inLead.players.filter(p => p.frags === topFrags)
})

const mvp = computed(() => topPlayers.value[0])
</script>

<template lang="pug">

.tdm-match
  .header
    .list-body
      .row
        .col.match-type-col
          span.match-type  {{matchType}}&nbsp;
          span.match-size  {{teamSize}}v{{teamSize}}
        .col
        .col Match MVP
  
  PlayersTooltip(:players="props.match.players") 
    .player-list
      .list-body
        .row(style="line-height: 1;" v-for="(team, idx) in teams")
          .col.star
            FontAwesome(v-if="idx === 0" :icon="['fas', 'star']" )
          .col(style="text-align:right;")
            img(:src="charWriter.writeScore(14, team.totalFrags, team.color, team.color)" style="display:inline;")
          .col.name(style="padding-right: 1rem; padding-left: 1rem; text-align: left")
            img(:src="charWriter.write(12, toBase64(team.name))" style="display:inline;")

          .col.mvp.icon-content(v-if="idx === 0")
            .icon
              FontAwesome(:icon="['fas', 'trophy']")
            img(:src="charWriter.write(12, mvp.nameRaw)" style="display:inline;")
          .col.mvp(v-else)

      template(v-if="props.expanded")
        .divider
        .list-body(v-for="(team, idx) in teams")
          .row(v-for="player in team.players")
            .col 
            .col(style="text-align:right;")
              img(:src="charWriter.writeScore(14, player.frags, player.shirtColor, player.pantColor)" style="display:inline;")
            .col.name(style="padding-left: 1rem; text-align: left")
              img(:src="charWriter.write(12, player.nameRaw)" style="display:inline;")
            .col 
            

  .remaining(v-if="observers.length > 3") {{observers.length}} observers

</template>

<style lang="scss" scoped>
.icon-content {
  display: flex;
  .icon{
    text-align: center;
    width: 3rem;
  }
}
.divider {
  margin: .5rem 0;
  border-top: 1px solid $grey-2;
  text-align: center;
}
.header {
  margin-top: .5rem;
}
.player-list {
  // margin-top: .5rem;
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
    .col.star {
      text-align: center;
    }
    .col.name {
      overflow: hidden;
    }
  }
  grid-template-columns: 2rem 4rem 9rem  auto ;
}
.header{
  .list-body {
    grid-template-columns: 6rem 9rem auto ;
    .col {
      span {
        display: inline;
      }
      
      @media only screen and (min-width: $tablet-breakpoint)  {
        span {
          
        display: none;
        }
      }
    }
  }
}

</style>