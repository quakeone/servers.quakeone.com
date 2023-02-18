<template lang="pug">
.status-team
  .match-type {{ props.match.matchType }} {{ size }}
  .teams
    .team(:class="'team_' + indexes[idx]" v-for="(team, idx) in teams")
      .team__name {{ team.name }}
      .team__score {{ team.totalFrags }}
</template>

<script setup lang="ts">
import {defineProps, computed} from 'vue'
import PlayersTooltip from '@/components/PlayersTooltip.vue'
import type {PlayerStatus} from '@/model/PlayerStatus'
import * as matchHelper from '@/helpers/match'
import {match, partition} from 'ramda'
import type { ServerStatus } from '@/model/ServerStatus'
import type {TeamMatch} from '@/model/TeamMatch'

const indexes = ['one', 'two', 'three', 'four']
const props = defineProps<{match  : TeamMatch}>()
const teams = computed(() => props.match.teams.teams)
const size = computed(() => `${props.match.teams.size}v${props.match.teams.size}`)
</script>
<style lang="scss" scoped>
.status-team {
  width: 20rem;
  .match-type {
    text-align: center;;
  }
  .teams {
    display: grid;
    .team_one {
      grid-area: team-one;
      border-right: 1px solid $grey-2;
    }
    .team_two {
      grid-area: team-two;
    }
    .team_three {
      grid-area: team-three;
      border-right: 1px solid $grey-2;
    }
    .team_three {
      grid-area: team-four;
    }
    .team__name {  
      padding: .5rem;
      text-align: center;;
      border-bottom: 1px solid $grey-2;
      color: $whitish;
    }
    .team__score {  
      padding: .5rem;
      text-align: center;;
      font-size: 2rem;
    }
    grid-template-areas: 
      "team-one team-two"
      "team-three team-four";
  }
}
</style>