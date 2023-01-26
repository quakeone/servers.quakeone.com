<template lang="pug">
span(v-tippy="{allowHTML: true}"
  :content="playerTooltipHtml") 
  slot
</template>

<script lang="ts" setup>
import {watch, defineProps, inject, ref} from 'vue'
import type { PlayerStatus } from '@/model/PlayerStatus'
import type { Writer } from '@/helpers/charmap'

const charWriter = inject<Writer>('charWriter')
const props = defineProps<{
  players: PlayerStatus[]
}>()
const playerTooltipHtml = ref('')

watch(props, (newValue) => {
  if (!charWriter) {
    return
  }
  const sortedPlayers = [...newValue.players].sort((a, b) => b.frags - a.frags)

  const body = sortedPlayers.map((player: PlayerStatus) => {
      return `<tr style="line-height: 1;">
      <td style="text-align:right;">
        <img src="${charWriter.writeScore(14, player.frags, player.shirtColor, player.pantColor)}" style="display:inline;">
      </td>
      <td style="padding-left: 1rem; text-align: left">
        <img src="${charWriter.write(12, player.nameRaw)}" style="display:inline;">
      </td>
      </tr>`;
    })
    .join('');

  playerTooltipHtml.value = `<table><tbody>${body}</tbody></table>`;

}, {immediate: true})

</script>