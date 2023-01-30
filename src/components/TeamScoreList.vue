<template lang="pug">
template(v-if="!loading && charWriter")
  table
    tbody(v-for="team in teams.teams")
      tr(style="line-height: 1;" v-for="player in team.players")
        td(style="text-align:right;")
          img(:src="charWriter.writeScore(14, player.frags, player.shirtColor, player.pantColor)" style="display:inline;")
        td(style="padding-left: 1rem; text-align: left")
          img(:src="charWriter.write(12, btoa(player.name))" style="display:inline;")
    tbody(v-if="teams.observers && teams.observers.length > 0")
      tr(style="line-height: 1;" v-for="player in teams.observers")
        td(style="text-align:right;")
          img(:src="charWriter.writeScore(14, player.frags, player.shirtColor, player.pantColor)" style="display:inline;")
        td(style="padding-left: 1rem; text-align: left")
          img(:src="charWriter.write(12, player.nameRaw)" style="display:inline;")

</template>

<script lang="ts">
import { Teams } from '@/model/Teams'
import { Writer } from '@/helpers/charmap'
import { defineComponent, PropType, inject, onMounted, ref } from 'vue'

export default defineComponent({
  props: {
    teams: {
      type: Object as PropType<Teams>,
      required: true
    }
  },
  setup(_props) { 
    const charWriter = inject<Writer>('charWriter')
    const loading = ref(true)
    onMounted(() => {
      loading.value = false
    })
    return {
      charWriter,
      loading,
      btoa
    }
  }
})
</script>
<style lang="scss" scoped>
table {
  border-collapse: collapse;
}
.team-summary {

  td {

   background-color: rgba(0,0,0,.4);
  }
}
tbody::before
{
  content: '';
  display: block;
  height: .5rem;

}
</style>