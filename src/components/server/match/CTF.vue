<script lang="ts" setup>
import {duration} from '@/helpers/date'
import {defineProps, computed, inject} from 'vue'
import type { Writer } from '@/helpers/charmap'
import type { Player } from '@/model/Player'
import PlayersTooltip from '@/components/PlayersTooltip.vue'
import {parseTeams} from  '@/helpers/teams'
import type {TeamMatch} from '@/model/TeamMatch'
import type {Teams} from '@/model/Teams'
import InlineScore from '../../InlineScore.vue'

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

.ctf-match(:class="{expanded: props.expanded}")
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
        .col
          InlineScore(:playerOrTeam="team")
    .list-body.mvp(v-if="!props.expanded")
      .row
        .col.icon
          FontAwesome(:icon="['fas', 'trophy']")
        .col(style="text-align:right;")
          InlineScore(:playerOrTeam="mvp")

    template(v-if="props.expanded")
      .players
        .list-body.team-players(v-for="(team, tidx) in teams")
          .row(v-for="(player, pidx) in team.players")
            .col.icon
              FontAwesome(v-if="tidx === 0 && pidx === 0" :icon="['fas', 'trophy']")
            .col(style="text-align:right;")
              InlineScore(:playerOrTeam="player")
        .list-body.observers
          .row.observers(v-for="(player, pidx) in observers")
            .col.icon
            .col
              InlineScore(:playerOrTeam="player")

  .remaining(v-if="observers.length > 3") {{observers.length}} observers

</template>

<style lang="scss" scoped>
.team-players, .observers {
  padding-top: .5rem;
}
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


.divider {
  margin: .5rem 0;
  border-top: 1px solid $grey-2;
  text-align: center;
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
  grid-template-columns: 2rem 16rem;
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