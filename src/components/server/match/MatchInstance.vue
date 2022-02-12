<script lang="ts" setup>
import { format } from 'date-fns'
import {defineProps, computed} from 'vue'
import Match from '@/model/Match'
import MapImage from '../../MapImage.vue'
import TDM from './TDM.vue'
import CTF from './CTF.vue'
import FFA from './FFA.vue'
import {parseMatch} from '@/helpers/match'
const fullDateTime = 'LLL dd, yyyy h:mmbb'
const props = defineProps<{match: Match}>()

const startDate =  computed(() => new Date(props.match.matchStart))
const fullMatchDate = computed(() => format(startDate.value, fullDateTime))
const matchMonth = computed(() => format(startDate.value, "LLL"))
const matchDay = computed(() => format(startDate.value, "dd"))
const match = computed(() => parseMatch(props.match))
const isTeam = computed(() => 'matchType' in match.value)
const detail = computed(() => {
  if (isTeam.value) {
    return match.value.matchType === 'CTF' ? CTF : TDM
  }
  return FFA
})
const teamSize = computed(() => isTeam.value ? match.value.teams.size : '')
const matchType = computed(() => isTeam.value ? match.value.matchType : '')
</script>

<template lang="pug">
.match
  .date
    .date-day {{matchDay}}
    .date-month {{matchMonth}}
    .match-type(v-if="isTeam") {{matchType}}
    .match-size(v-if="isTeam") {{teamSize}}x{{teamSize}}
    
  .title
    h3 {{props.match.name}}
    .subtitle
      span.bright  {{fullMatchDate}}  
      span.vert-divide  | 
      span.bright  {{Math.floor(props.match.duration/60)}} 
      span  minutes 
      span.vert-divide  | 
      span map: 
      span.bright  {{props.match.map}}
  .detail
    component(:is="detail" :match="match")
  .map-image
    MapImage(:map="props.match.map")
      .map-text {{props.match.map}}
</template>

<style lang="scss" scoped>
.match-type, .match-size {
  display: none;
}
.date {
  grid-area: big-date;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  gird-area: title;
  padding: 0 1rem;
}
.detail {
  grid-area: detail;
}
.map-image {
  display: none;
  grid-area: map;
  position: relative;
  height: 100%;

  .map-text {
    padding: 4px;
    text-shadow: 2px 2px rgba(0,0,0,.9);
    //background-color: rgba(0,0,0,.4);
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
.match {
  display: grid;
  
  grid-template-areas: 
    "big-date title"
    "detail detail";
  grid-template-columns: 3rem auto;
  @media only screen and (min-width: $tablet-breakpoint)  {
    .match-type {
      margin-top: .5rem;
    }
    .map-image {
      display: block;
    }
    .detail {
      padding: 0 1rem;
    }
    .match-type, .match-size {
      display: block;
    }
  
    grid-template-areas: 
      "big-date title map"
      "big-date detail map";
    grid-template-columns: 3rem auto 250px;
  }
}
.date { 
  font-weight: bold;
  .date-day {
    font-size: 2rem;
  }
  padding: 0 .5rem;
  border-right: 1px solid $grey-2;
}
</style>