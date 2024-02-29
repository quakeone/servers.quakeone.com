<template lang="pug">
img(
  :src="`/${serverTypeImageMap[serverType][props.logoType]}`" 
  :alt="serverTypeAltMap[serverType]")
</template>
    
<script setup lang="ts">
export type LogoType = "clean" | "withLabel"
import { ServerType, serverToServerType } from '@/model/ServerType'
import {defineProps, computed} from 'vue'

const gameTypeMapAbbrv: Record<number, string> = {
  0: "NQ",
  1: "QW",
  2: "Q2",
  3: "Q3",
  4: "Q4",
  5: "QE"
}

const serverTypeImageMap: Record<ServerType, {withLabel: string, clean: string}> = {
    [ServerType.NetQuake]: {withLabel: "netquake.png", clean: "netquake-clean.png"},
    [ServerType.QuakeWorld]: {withLabel: "quakeworld.png", clean: "quakeworld-clean.png"},
    [ServerType.Quake2]: {withLabel: "quake2.png", clean: "quake2-clean.png"},
    [ServerType.Quake3]: {withLabel: "quake3.png", clean: "quake3-clean.png"},
    [ServerType.Quake4]: {withLabel: "quake4.png", clean: "quake4-clean.png"},
    [ServerType.QuakeEnhanced]: {withLabel: "quake-enhanced.png", clean: "quake-enhanced-clean.png"},
    [ServerType.Hybrid]: {withLabel: "hybrid.png", clean: "hybrid-clean.png"}
}

const serverTypeAltMap: Record<ServerType, string> = {
  [ServerType.NetQuake]: "Net Quake",
  [ServerType.QuakeWorld]: "QuakeWorld",
  [ServerType.Quake2]: "Quake II",
  [ServerType.Quake3]: "Quake 3",
  [ServerType.Quake4]: "Quake IV",
  [ServerType.QuakeEnhanced]: "Quake Enhanced",
  [ServerType.Hybrid]: "Hybrid Server"
}

const props = withDefaults(defineProps<{
  type: ServerType | {gameId: number, parameters: string},
  logoType: LogoType
}>(), {logoType: 'clean'})


const serverType = computed(() => {
  return typeof props.type === 'number'
    ? props.type
    : serverToServerType({gameId: props.type.gameId, parameters: props.type.parameters})
})
</script>