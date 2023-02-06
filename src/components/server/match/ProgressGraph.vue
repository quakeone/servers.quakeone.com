<template lang="pug">
svg.match-progress(v-if="domainX != null"
  ref="svg" 
  height="100%" 
  width="100%" 
  :viewBox="`0 0 ${width} ${height}`")
  text.svg-match__progress(x="20" y="35") 
  g
    g
      rect.svg-match__timeline-full(
        x="0" 
        :y="height - 6" 
        :width="rangeX[1]"
        height="6")
      rect.svg-match__timeline-progress(
        x="0" 
        :y="height - 5" 
        :width="timelineProgress"
        height="4")
      rect.svg-match__timeline-text-bg(
          :x="x(domainX[1])" 
          :y="height - 14"
          width="35px"
          height="14px")
    g(transform="translate(33, 7)")
      text.svg-match__timeline-text(
          text-anchor="end"
          :x="x(domainX[1])" 
          :y="y(0)"
          ) {{ matchLength }}
    path.svg-match__line(v-for="playerProgress in sortedProgression"
      :d="progressLine(playerProgress)" 
      :stroke="playerColors[playerProgress.pantColor]")

    g(v-for="playerProgress in sortedProgression" transform="translate(5, -2)")
      text.svg-match__name-text(
        :x="x(new Date(lastPoint(playerProgress).timestamp))" 
        :y="y(lastPoint(playerProgress).frags)"
        :fill="playerColors[playerProgress.pantColor]") {{ lastPoint(playerProgress).frags }} -  {{playerProgress.name}}


</template>

<script lang="ts" setup>
import {playerColors} from '@/helpers/playerColors'
import * as d3 from 'd3'
import type {Match} from '@/model/Match'
import type {MatchPlayerDatapoint, MatchPlayerProgress} from '@/model/MatchProgress'
import {computed, reactive, watch, onBeforeUnmount, ref} from 'vue'
import { addMinutes, addSeconds,differenceInSeconds } from 'date-fns'
import { match } from 'ramda'

const nameLabelsWidth = 50;
const props = defineProps<{
  match: Match,
  width: number,
  height: number
}> ()

const model = reactive<{padding: number, matchLengthSeconds: number}>({
  padding: 10,
  matchLengthSeconds: 0
})

const sortedProgression = computed(() => 
  props.match.progress!
    .sort(
      (a,b) => a.progression[a.progression.length - 1].frags == b.progression[b.progression.length - 1].frags 
        ? 0
        : a.progression[a.progression.length - 1].frags < b.progression[b.progression.length - 1].frags  ? -1 : 1 ))
const rangeX  = computed(() => {
  const width = props.width - model.padding - nameLabelsWidth;
  return [0, width];
})

const rangeY  = computed(() => {
  const height = props.height - model.padding;
  return [model.padding, height];
})

const domainX = computed(() => {
  let start = new Date(props.match.matchStart)
  let end = null
  if (props.match.matchEnd) {
    end = new Date(props.match.matchEnd)
  } else {
    const now = new Date()
    const timeLimit = addMinutes(start, props.match.timelimit)
    end = timeLimit > now ? timeLimit : now;
  }
  return [start, end]  
})

const domainY = computed(() => {
  if (props.match.fraglimit > 0) {
    return [props.match.fraglimit, 0]
  } else {
    const maxFrag = props.match.players.reduce((max, player) => max < player.frags ? player.frags : max, 0)
    return [maxFrag < 10 ? 15 : maxFrag + 5, 0]
  }
})

const svg = ref<HTMLOrSVGElement | null>(null)


const x = computed(() => {
  return d3.scaleLinear()
    .domain(domainX.value)
    .range(rangeX.value);
})

const y = computed(() => {
  return d3.scaleLinear()
    .domain(domainY.value)
    .range(rangeY.value);
})

const progressLine = (progress: MatchPlayerProgress) => {
  const progression = progress.progression.sort(
      (a1, a2) => a1.timestamp == a2.timestamp ? 0 : a1.timestamp > a2.timestamp ? -1 : 1)

  return d3.line<MatchPlayerDatapoint>()
  
    .x((d, i) => x.value(new Date(d.timestamp)))
    .y(d => y.value(d.frags))(progression);
}

let id = 0
if (!props.match.matchEnd) {
  id = setInterval(() => model.matchLengthSeconds += 1, 1000)
  onBeforeUnmount(() => clearInterval(id))
}

const lastPoint = (progress: MatchPlayerProgress) => {
  const progression = progress.progression.sort(
      (a1, a2) => a1.timestamp == a2.timestamp ? 0 : a1.timestamp > a2.timestamp ? -1 : 1)

  return progression[0]
}

const currentMaxTime = computed(() => {
  let maxTime = props.match.matchEnd
  if (!maxTime) {
    maxTime = props.match.progress!.reduce(
      (max, progress) => {
        const test = progress.progression.reduce(
          (max2, pr) => pr.timestamp > max2 ? pr.timestamp : max2,
          max) 
        return test > max ? test : max
      }, '2020-01-01')
  }
  return new Date(maxTime)
})

const matchLength = computed(() => {
  const mins = Math.floor(model.matchLengthSeconds / 60)
  const secs = Math.floor(model.matchLengthSeconds % 60).toString().padStart(2, '0')

  return `${mins}:${secs}`
})

const timelineProgress = computed(() => x.value(currentMaxTime.value))

model.matchLengthSeconds = differenceInSeconds(currentMaxTime.value, new Date(props.match.matchStart))
watch(props, (newProps, oldProps) => {
  if (newProps.match.matchEnd && newProps.match.matchEnd != oldProps.match.matchEnd) {
    clearInterval(id)
    model.matchLengthSeconds = differenceInSeconds(new Date(newProps.match.matchEnd), new Date(props.match.matchStart))
  }
  if (newProps.match.serverMatchId != oldProps.match.serverMatchId) {
    model.matchLengthSeconds = differenceInSeconds(currentMaxTime.value, new Date(props.match.matchStart))
  }
})
</script>

<style lang="scss">
$background: $grey-2;
.svg-match  {
  margin: 25px;
  &__line {
    fill: none;
    stroke-width: 1px;
  }
  &__name-text {
    font-size: 8px;
    font-weight: bold;;
  }
  &__timeline-progress {
    fill: $tan;
  }
  &__timeline-full {
    fill: $background;
  }
  &__timeline-text-bg {
    fill: $background;
  }
  &__timeline-text {
    background-color: $background;
    fill: $tan;
    font-size: 12px;
  }
}

</style>