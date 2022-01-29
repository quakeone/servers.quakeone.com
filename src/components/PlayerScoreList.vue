<template lang="pug">
template(v-if="!loading && charWriter")
  .table-backdrop
    table
      tbody
        tr(style="line-height: 1;" v-for="player in sortedByScore")
          td(style="text-align:right;")
            img(:src="charWriter.writeScore(14, player.frags, player.shirt, player.pant)" style="display:inline;")
          td(style="padding-left: 1rem; text-align: left")
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
    return {
      charWriter,
      loading,
      btoa,
      sortedByScore
    }
  },
})
</script>
<style lang="scss">

.table-backdrop {
  // background-color: rgba(0,0,0,.2);
  overflow: hidden;
  position: relative;
  -webkit-mask-image: linear-gradient(to bottom,  black 80%, transparent 98%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 98%);
  padding-top: 68%;
  //width: 100%;
  table {
    position: absolute;
    top: 0;
    margin: 1rem;
    table-layout:fixed;
    td {
      white-space: nowrap
    }
  }
}
</style>