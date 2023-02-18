<template lang="pug">
.inline-score(v-if="charWriter")
  .inline-score__score(style="text-align: right;")
    img(:src="charWriter.writeScore(14, frags, topColor, bottomColor)" style="display:inline;")
  .inline-score__type
    FontAwesome(v-if="type === 2" :icon="['fas', 'robot']")
    FontAwesome(v-if="type === 1" :icon="['fas', 'crown']")
  .inline-score__name
    img(:src="charWriter.write(12, name)" style="display:inline;")

</template>

<script lang="ts" setup>
import type { Writer } from '@/helpers/charmap'
import type { Player } from '@/model/Player';
import type { Team } from '@/model/Teams';
import {computed, inject} from 'vue'

const props = defineProps<{
  playerOrTeam: Team | Player
}>()

const charWriter = inject<Writer>('charWriter')
const topColor = computed(() => 'shirtColor' in props.playerOrTeam ? props.playerOrTeam.shirtColor : props.playerOrTeam.color)
const bottomColor = computed(() => 'pantColor' in props.playerOrTeam ? props.playerOrTeam.pantColor : props.playerOrTeam.color)
const name = computed(() => 'nameRaw' in props.playerOrTeam ? props.playerOrTeam.nameRaw : btoa(props.playerOrTeam.name))
const frags = computed(() => {
  const score = 'frags' in props.playerOrTeam ? props.playerOrTeam.frags : props.playerOrTeam.totalFrags
  return score
})
const type = computed(() => 'type' in props.playerOrTeam ? props.playerOrTeam.type : 0)
</script>

<style lang="scss" scoped>
.inline-score {
  display: flex;
  &__type {
    text-align: center;
    width: 1.3rem;
    font-size: .7rem;
    color: $whitish;
    vertical-align: middle;
  }
}
</style>