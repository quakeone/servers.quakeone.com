<template lang="pug">

svg.match-progress(:viewBox="`0 0 ${width} ${height}`")
  text.svg-match__progress(x="20" y="35") 
  g(transform="translate(0, 5)")
    path.svg-match__line(v-for="playerProgress in props.match.progress"
      :d="path(playerProgress)" 
      :stroke="playerColors[playerProgress.pantColor]")

</template>

<script lang="ts" setup>
import {playerColors} from '@/helpers/playerColors'
import * as d3 from 'd3'
import type {Match} from '@/model/Match'
import type {MatchPlayerProgress} from '@/model/MatchProgress'
import {computed, reactive} from 'vue'
import { addMinutes } from 'date-fns'
const props = defineProps<{
  match: Match,
  width: number,
  height: number
}> ()


const model = reactive({
  padding: 5
})

const rangeX  = computed(() => {
  const width = props.width - model.padding;
  return [0, width];
})

const rangeY  = computed(() => {
  const height = props.height - model.padding;
  return [0, height];
})

const x = computed(() => {
  const x = d3.scaleLinear().range(rangeX.value);
  x.domain([
    new Date(props.match.matchStart), 
    addMinutes(new Date(props.match.matchStart), 10)
  ]);
  d3.axisLeft(x)
  return x
})

const y = computed(() => {
  const y = d3.scaleLinear().range(rangeY.value);
  const maxFrag = props.match.players.reduce((max, player) => max < player.frags ? player.frags : max, 0)
  d3.axisTop(y)
  y.domain([
    maxFrag < 10 ? 10 : maxFrag, 0]);
  return y
})

const path = (progress: MatchPlayerProgress) => {
  const progression = progress.progression.sort(
      (a1, a2) => a1.timestamp == a2.timestamp ? 0 : a1.timestamp > a2.timestamp ? -1 : 1)
  
  return d3.line()
    .x((d, i) => x.value(new Date(d.timestamp)))
    .y(d => y.value(d.frags))(progression);
}
</script>

<style lang="scss">
.svg-match  {
  margin: 25px;
  &__line {
    fill: none;
    stroke-width: 1px;
  }
}
</style>