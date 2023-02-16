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

.tdm-match(:class="{expanded: props.expanded}")
  .header
    .list-body
      .row
        .col.match-type-col
          span.match-type  {{matchType}}&nbsp;
          span.match-size  {{teamSize}}v{{teamSize}}
        .col

  .player-list
    .list-body.teams
      .row(style="line-height: 1;" v-for="(team, idx) in teams")
        .col.icon
          FontAwesome(v-if="idx === 0" :icon="['fas', 'star']" )
        .col(style="text-align:right;")
          img(:src="charWriter.writeScore(14, team.totalFrags, team.color, team.color)" style="display:inline;")
        .col
        .col.name
          img(:src="charWriter.write(12, toBase64(team.name))" style="display:inline;")

    .list-body.mvp(v-if="!props.expanded")
      .row
        .col.icon
          FontAwesome(:icon="['fas', 'trophy']")
        .col(style="text-align:right;")
          img(:src="charWriter.writeScore(14, mvp.frags, mvp.shirtColor, mvp.pantColor)" style="display:inline;")
        .col.icon.player-type
          FontAwesome(v-if="mvp.type === 2" :icon="['fas', 'robot']")
          FontAwesome(v-if="mvp.type === 1" :icon="['fas', 'crown']")
        .col.name
          img(:src="charWriter.write(12, mvp.nameRaw)" style="display:inline;")


    template(v-if="props.expanded")
      .list-body.players
        template(v-for="(team, tidx) in teams")
          .row(v-for="(player, pidx) in team.players")
            .col.icon
              FontAwesome(v-if="tidx === 0 && pidx === 0" :icon="['fas', 'trophy']")
            .col(style="text-align:right;")
              img(:src="charWriter.writeScore(14, player.frags, player.shirtColor, player.pantColor)" style="display:inline;")
            .col.icon.player-type
              FontAwesome(v-if="player.type === 2" :icon="['fas', 'robot']")
              FontAwesome(v-if="player.type === 1" :icon="['fas', 'crown']")
            .col.name(style="text-align: left")
              img(:src="charWriter.write(12, player.nameRaw)" style="display:inline;")

            

  .remaining(v-if="observers.length > 3") {{observers.length}} observers

</template>

<style lang="scss" scoped>
.mvp {
  grid-area: mvp;
}
.teams {
  grid-area: teams;
  margin-bottom: .5rem;
}
.players {
  grid-area: players;
}
.expanded {
  .list-body.teams {
    padding-bottom: .5rem;
    border-bottom: 1px solid $grey-2
  }
}

.header {
  margin-top: .5rem;
}
.player-list {
  display: grid;
  align-items: flex-start;
  grid-template-columns: auto;
  grid-template-areas: 
    "teams"
    "mvp"
    "players";
  @media only screen and (min-width: $phone-breakpoint)  {
  grid-template-columns: max-content auto;
  grid-template-areas: 
    "teams mvp"
    "players players";
  }
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
    .col.icon {
      text-align: center;
    }
    .col.player-type {
      padding: 0 .3rem;
      width: 8px;
      font-size: 0.7rem;
      color: #a19c97;
      vertical-align: top;
    }
    .col.name {
      overflow: hidden;
      padding-right: 1rem; 
      padding-left: .5rem; 
      text-align: left;
    }
  }
  
  grid-template-columns: 2rem 4rem 14px auto;
}
.header{
  .list-body {
    grid-template-columns: 6rem 9rem auto ;
    .col {
      span {
        display: inline;
      }
      
      @media only screen and (min-width: $phone-breakpoint)  {
        span {
          display: none;
        }
      }
    }
  }
}

</style>