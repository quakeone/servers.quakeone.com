<template lang="pug">
svg.match-progress(v-if="domainX != null"
  ref="svg" 
  height="100%" 
  width="100%" 
  :viewBox="`0 0 ${width} ${height}`")
  text.svg-match__progress(x="20" y="35") 
  g
    rect.svg-match__timeline-full(
      x="0" 
      :y="height - 8" 
      :width="rangeX[1]"
      height="8")
    rect.svg-match__timeline-progress(
      x="0" 
      :y="height - 8" 
      :width="timelineProgress"
      height="8")
    rect.svg-match__timeline-text-bg(
      :x="x(domainX[1])" 
      :y="height - model.progressAreaHeight"
      width="50px"
      :height="model.progressAreaHeight")
    g(transform="translate(46, 16)")
      text.svg-match__timeline-text(
        text-anchor="end"
        :x="x(domainX[1])" 
        :y="y(0)"
        ) {{ matchLength }}

    g(v-for="playerProgress in sortedProgression")        
      path.svg-match__overlay_line(:id="'overlay-' + playerProgress.playerMatchId"
        :d="progressLine(playerProgress)"
        :player-id="playerProgress.playerMatchId"
        stroke-width="20"
        stroke="#fff"
        fill="none"
        @mouseover="highlightOn"
        @mouseleave="highlightOff"
        stroke-opacity="0")
      path.svg-match__line(
        :class=`{
          highlight: model.playerIdHighlight === playerProgress.playerMatchId,
          lowlight: model.playerIdHighlight !== 0 && model.playerIdHighlight !== playerProgress.playerMatchId,
        }`
        :d="progressLine(playerProgress)" 
        :stroke="playerColors[playerProgress.pantColor]")

      g(transform="translate(5, -2)")
        text.svg-match__name-text(
          :class=`{
            highlight: model.playerIdHighlight === playerProgress.playerMatchId,
            lowlight: model.playerIdHighlight !== 0 && model.playerIdHighlight !== playerProgress.playerMatchId,
          }`
          :player-id="playerProgress.playerMatchId"
          @mouseover="highlightOn"
          @mouseleave="highlightOff"
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

const nameLabelsWidth = 75;
const props = defineProps<{
  match: Match,
  width: number,
  height: number
}> ()

const model = reactive<{
  padding: number, 
  progressAreaHeight: number,
  matchLengthSeconds: number,
  playerIdHighlight: number
}>({
  padding: 10,
  progressAreaHeight: 20,
  matchLengthSeconds: 0,
  playerIdHighlight: 0
})

const maxPlayerTime = computed(() => {
  return props.match.progress!.reduce(
      (max, progress) => {
        const test = progress.progression.reduce(
          (max2, pr) => pr.timestamp > max2 ? pr.timestamp : max2,
          max) 
        return test > max ? test : max
      }, '2020-01-01')
})

const maxPlayerFrags = computed(() => {
  return props.match.progress!.reduce(
      (max, progress) => {
        const test = progress.progression.reduce(
          (max2, pr) => pr.frags > max2 ? pr.frags : max2,
          max) 
        return test > max ? test : max
      }, 0)
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
  const height = props.height - model.progressAreaHeight;
  return [model.progressAreaHeight, height];
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
  const maxFrag = maxPlayerFrags.value
  const ceiling = props.match.fraglimit || 20;

  return [maxFrag < ceiling ? ceiling : maxFrag + 5, 0]
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
    maxTime = maxPlayerTime.value
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

const highlightOn = (d) => {
  console.log('on')
  const overlayPath = d.currentTarget as HTMLElement
  const id  = parseInt(overlayPath.getAttribute('player-id') || '0')
  model.playerIdHighlight = id
}
const highlightOff = (d) => {
  console.log('off')
  model.playerIdHighlight = 0
}
</script>

<style lang="scss">
$background: $grey-2;
.svg-match  {
  margin: 25px;
  &__line {
    fill: none;
    stroke-width: 2px;
    transition: all .4s;
    &.lowlight {
      opacity: .2;
    }
    &.highlight {
      stroke-width: 4px;
    }
  }
  &__name-text {
    transition: all .4s;
    font-size: 12px;
    font-weight: bold;;
    &.lowlight {
      opacity: .2;
    }
    &.highlight {
    font-size: 14px;
    }
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
    font-size: 16px;
    font-weight: bold;
  }
}

</style>