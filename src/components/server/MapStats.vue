<template lang="pug">
svg.map-stats-svg(
  ref="svg" 
  :viewBox="`0 0 ${width} ${height}`")
  g(v-for="(item, index) in dataSet" :key="index")
    rect.bar(
      :class="{highlight: item === model.hoverItem}"
      :key="index"
      :x="scaleX(item.map)"
      :y="scaleY(item.percent)"
      :width="scaleX.bandwidth()"
      :height="(props.height- axisPadding) - scaleY(item.percent)"
    )
    rect.bar-hover-area( 
      @mouseover="onMouseOver(item, $event)"
      @mouseleave="onMouseOut"
      :x="scaleX(item.map)"
      :y="0"
      :width="scaleX.bandwidth()"
      :height="props.height"
    )
    g(transform="translate(-5, -5)" v-if="item === model.hoverItem")
      text.map-stats_percent(
        text-anchor="end"
        :x="scaleX(item.map) + scaleX.bandwidth()" 
        :y="scaleY(item.percent)"
        ) {{ round(item.percent) }}%


</template>

<script setup lang="ts">
import * as d3 from 'd3'
import {computed, ref, watch, reactive} from 'vue'
import type { MapStat } from '@/model/ServerDetail';

const model = reactive<{
  hoverItem: (MapStat | null)
}>({
  hoverItem: null
})

const topPadding = 20
const axisPadding = 50
const barCount = 10

const props = defineProps<{
  mapStats: MapStat[],
  width: number,
  height: number
}>()

const dataSet = computed(() => {
  // if (props.mapStats.length >= 15) {
  //   return props.mapStats.slice(0,15)
  // }
  return props.mapStats
})
const svg = ref<HTMLOrSVGElement | null>(null)
const updateAxis = (_svg: HTMLOrSVGElement) => {
  const d3svg = d3.select(_svg)
  
  d3svg.append("g") 
    .attr("transform", "translate(0," + (props.height - axisPadding) + ")") 
    .call(
      d3.axisBottom(scaleX.value)
        .tickSize(0)
    ) 
    .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.2em")
        .attr("dy", ".70em")
        .attr("transform", "rotate(-45)" );
  // d3svg.append('g')
  //   .attr("transform", `translate(${axisPadding},0)`) 
  //   .attr('class', 'axis axis--y')
  //   .call(d3.axisLeft(scaleY.value))
}
watch(svg, () => {
  if (svg.value) {
    updateAxis(svg.value)
  }
})



const scaleX = computed(() => {
  return d3.scaleBand()
    .padding(.1)
    .rangeRound(rangeX.value)
    .domain(dataSet.value.map(m => m.map)) 
})
    
const scaleY = computed(() =>{
  const max =  Math.max(...dataSet.value.map(m => m.percent))
  return d3.scaleLinear()
    .rangeRound(rangeY.value)
    .domain([0, max])
})
const rangeX  = computed(() => {
  const width = props.width;
  return [0, width];
})


const rangeY  = computed(() => {
  const height = props.height - axisPadding - topPadding;
  return [height, topPadding];
})

const onMouseOver = (item:MapStat, _e: any) => {
  model.hoverItem = item
}
const onMouseOut = (_e: any) => {
  model.hoverItem = null
}

const round = (n: number) => {
  if (n < 1) {
    return '<1'
  }
  return Math.round(n)
}

// const onMouseOUt = () => {
//   model
// }
// function onMouseOver(item, e){

// var tooltipDiv = d3.select("#myTooltip"); 

// tooltipDiv.transition()        
//    .duration(200)      
//    .style("opacity", 1);    

// tooltipDiv.html( "your Content")
//    .style("left", (parseFloat(widthScale(d))) + "px") 
//    .style("cursor", "pointer")
//    .style("top", function(d){
//        return d3.event.pageY - this.offsetHeight - 17  + "px"
//     })
//     .style("color", "#333333");        
// }

// function onMouseOut(d){
//   var tooltipDiv = d3.select("#myTooltip"); 
//   tooltipDiv.transition()        
//         .duration(500)      
//         .style("opacity", 0);  
// }
</script>

<style lang="scss">
rect.bar {
  stroke: none;
  fill: $grey-2;
}

rect.highlight {
  transition: all .2s;
  fill: $tan;
}
.bar-hover-area {
  fill: blue;
  opacity: 0;
}
.map-stats_percent {
  font-size: .8rem;
  font-weight: bold;
  fill: $tan;
}
.tick {
  font-size: .8rem;
}
</style>