<template lang="pug">
.client-download
  div Play using a client
  template(v-for="(link, idx) in links" )
    a(:href="link.link" target="_blank") {{ link.title }}
    span(v-if="idx < links.length - 1")   · 
</template>

<script setup lang="ts">
import {computed} from 'vue'

type GameLink = {
  title: string,
  link: string
}
const props = defineProps<{
  gameId: number,
  params: string
  }>()

const isFte = computed(() => {
  try {
  return props.params && JSON.parse(props.params).Engine === 'fte'
  } catch {}
})

const links = computed(() => {
  const _links: GameLink[] = []
  if (props.gameId === 1 || isFte.value) {
    _links.push({title: 'QSS-M', link: 'https://qssm.quakeone.com/'})
    _links.push({title: 'QRack', link: 'https://github.com/Novum/vkQuake/release'})
    _links.push({title: 'vkQuake', link: 'https://github.com/Novum/vkQuake/releases'})
  }
  if (props.gameId === 1){
    _links.push({title:'nQuake', link: 'https://nquake.com/'})
    _links.push({title:'ezQuake', link: 'https://ezquake.com/'})
  }
  if (props.gameId === 5){
    _links.push({title:'QE (Steam)', link: 'https://store.steampowered.com/app/2310/Quake/'})
    _links.push({title:'QE (GoG)', link: 'https://www.gog.com/en/game/quake_the_offering'})
  }
  return _links
})
</script>
<style lang="scss">
.client-download {
  font-size: .8rem;
}
</style>