<script lang="ts" setup>
import { differenceInSeconds, format, formatDistanceStrict } from 'date-fns'
import {defineProps, computed, reactive, watch} from 'vue'
import type {Match} from '@/model/Match'
import MapImage from '../../MapImage.vue'
import TDM from './TDM.vue'
import CTF from './CTF.vue'
import FFA from './FFA.vue'
import {parseApiMatch, time as parseTime} from '@/helpers/match'
import type { TeamMatch } from '@/model/TeamMatch'
import {getMatchDetail} from '@/services/serversApi'
import ProgressGraph from './ProgressGraph.vue'
import Loading from '@/components/Loading.vue'

type ExpandState = 'NotExpanded' | 'Loading' | 'Expanded'
const fullDateTime = 'LLL dd, yyyy h:mmbb'

const props = defineProps<{
  match: (Match | TeamMatch),
  expanded: boolean
}>()

const emits = defineEmits<{
  (e: 'requestExpand'): void,
  (e: 'requestCollapse'): void
}>()

const model = reactive<{
  expandState: ExpandState,
  match: (Match | TeamMatch)
}>({
  expandState: 'NotExpanded',
  match: props.match 
})

const startDate =  computed(() => new Date(model.match.matchStart))
const fullMatchDate = computed(() => format(startDate.value, fullDateTime))
const matchTimeAgo = computed(() => formatDistanceStrict(startDate.value, new Date(), {
  addSuffix: true
}))
const matchDuration = computed(() => differenceInSeconds(new Date(model.match.matchEnd), new Date(model.match.matchStart)))
const matchMonth = computed(() => format(startDate.value, "LLL"))
const matchDay = computed(() => format(startDate.value, "d"))
const isTeam = computed(() => 'matchType' in model.match)
const detail = computed(() => {
  if (isTeam.value) {
    return model.match.matchType === 'CTF' ? CTF : TDM
  }
  return FFA
})
const teamSize = computed(() => isTeam.value ? model.match.teams.size : '')

const matchType = computed(() => isTeam.value ? model.match.matchType : '')
const title = computed(() => isTeam.value ? 
  model.match.teams.teams.reduce<string>((aggr, team) => {
  if (aggr) {
    aggr += ' vs '
  }
  return aggr += team.name
},'') : '')

const loadShowMore = () =>{
  model.expandState = 'Loading'
  return getMatchDetail(model.match.serverMatchId)
    .then(match => {
      model.match = parseApiMatch(match)
      model.expandState = 'Expanded'
    })
}
watch(props, (newProps, oldProps) => {
  if (newProps.expanded) {
    if (model.expandState === 'NotExpanded')
      loadShowMore()
  } else {
    model.expandState = 'NotExpanded'
  }
}, {immediate: true})
</script>

<template lang="pug">
.match-instance
  .match(:class="{expanded: model.expandState==='Expanded'}")
    .date
      .date-day {{matchDay}}
      .date-month {{matchMonth}}
      .match-type(v-if="isTeam") {{matchType}}
      .match-size(v-if="isTeam") {{teamSize}}x{{teamSize}}

    .title
      h3(v-if="isTeam") {{title}}
      .subtitle
        span.bright(v-tippy :content="fullMatchDate")  {{matchTimeAgo}}  
        span.vert-divide  | 
        span.bright  {{Math.ceil(matchDuration/60)}} 
        span  minutes 
        span.vert-divide  | 
        span map: 
        span.bright  {{model.match.map}}
    .detail
      component(:is="detail" :match="model.match" :expanded="model.expandState==='Expanded'")
      .buttons
        Loading.loading(v-if="model.expandState === 'Loading'")
        a(v-else-if="model.expandState === 'NotExpanded'" @click="emits('requestExpand', props.match.serverMatchId)") Show More  
        a(v-else @click="emits('requestCollapse')") Hide  

    .graphics
      MapImage(:map="model.match.map")
        .stuff
        .map-text {{model.match.map}}

    .progress(v-if="model.expandState==='Expanded'")
      ProgressGraph(:match="model.match" :height="150" :width="475")


</template>

<style lang="scss" scoped>
.stuff {
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 98%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 98%);
  padding-top: 68%;
}
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
  grid-area: title;
  padding: 0 1rem;
}
.detail {
  grid-area: detail;
}
.graphics {
  display: none;
  grid-area: map;
  .map-image {
    position: relative;

    .map-text {
      padding: 4px;
      text-shadow: 2px 2px rgba(0,0,0,.9);
      //background-color: rgba(0,0,0,.4);
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
  }
}

.match {
  display: grid;
  .match-size, .match-type {

  }
  grid-template-areas: 
    "big-date title"
    "detail detail";
  grid-template-columns: 3rem auto;

  &.expanded {
      grid-template-areas: 
        "big-date title map"
        "detail detail map"
        "progress progress progress";
      grid-template-columns: 3rem auto 200px;
    }
  @media only screen and (min-width: $tablet-breakpoint)  {
    .match-type {
      margin-top: .5rem;
    }
    .graphics {
      display: block;
    }
    .progress {
      width: 475px;
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
    grid-template-columns: 3rem auto 200px;

    &.expanded {
      grid-template-areas: 
        "big-date title map"
        "big-date detail map"
        "big-date detail progress";
      grid-template-columns: 3rem auto 475px;
    }
  }
  .loading {
    height:1.5rem;
  }
}
.date { 
  
  font-weight: bold;
  .date-day {
    font-size: 2rem;
    line-height: 1;
  }
  padding: 0 .5rem;
  border-right: 1px solid $grey-2;
}
</style>