<template lang="pug">
template(v-if="!loading && charWriter")
  table
    tbody
      tr(style="line-height: 1;" v-for="player in sortedByScore")
        td(style="text-align:right;")
          img(:src="charWriter.writeScore(14, player.frags, player.shirt, player.pant)" style="display:inline;")
        td(style="padding-left: .2rem; text-align: left") 
          span.player-type(v-if="player.playerType === 2") 
            FontAwesome(:icon="['fas', 'robot']")
          span.player-type(v-if="player.playerType === 1") 
            FontAwesome(:icon="['fas', 'crown']")
        td(style="padding-left: .2rem; text-align: left")
          img(:src="charWriter.write(12, btoa(player.name))" style="display:inline;")

</template>

<script lang="ts">
import { Writer } from '@/helpers/charmap'
import { Player } from '@/model/Player'
import { defineComponent, PropType, inject, onMounted, ref, computed } from 'vue'

export default defineComponent({
  props: {
    players: {
      type: Array as PropType<Player[]>,
      required: true
    }
  },
  setup(props) {
    const sortedByScore = computed(() => [...props.players].sort((a, b) => b.frags - a.frags))
    const charWriter = inject<Writer>('charWriter')
    const loading= ref(true)
    onMounted(() => {
      loading.value = false
    })
    const btoa = (str: string) => window.btoa(str)
    const playerType = (player: Player) => {
      if (player.playerType === 2) {
        return 'bot';
      }
      return ''
    }
    return {
      charWriter,
      loading,
      btoa,
      sortedByScore,
      playerType
    }
  },
})
</script>
<style lang="scss">
.player-type {

  font-size: .7rem;
  color: $whitish;
  vertical-align: top;
}
</style>