<template lang="pug">
template(v-if="!loading && charWriter")
  table
    tbody
      tr(style="line-height: 1;" v-for="player in players")
        td(style="text-align:right;")
          img(:src="charWriter.writeScore(14, player.currentFrags, player.shirt, player.pant)" style="display:inline;")
        td(style="padding-left: 1rem; text-align: left")
          img(:src="charWriter.write(12, btoa(player.name))" style="display:inline;")
</template>

<script lang="ts">
import { Writer } from '@/helpers/charmap'
import { PlayerStatus } from '@/model/PlayerStatus'
import { defineComponent, PropType, inject, onMounted, ref } from 'vue'

export default defineComponent({
  props: {
    players: {
      type: Array as PropType<PlayerStatus[]>,
      required: true
    }
  },
  setup() {
    const charWriter = inject<Writer>('charWriter')
    const loading= ref(true)
    onMounted(() => {
      loading.value = false
    })
    const btoa = (str: string) => window.btoa(str)
    return {
      
      charWriter,
      loading,
      btoa
    }
  },
})
</script>
