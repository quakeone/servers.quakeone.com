<template lang="pug">
.active-server-grid
  Active.active(
    v-for="activeServer in servers" 
    :key="activeServer.serverId"
    :serverStatus="activeServer")
</template>

<!-- <script lang="ts" setup>
import Active from './Active.vue'
import {defineProps} from 'vue'
import { ServerStatus } from "@/model/ServerStatus";

defineProps<{
  servers: ServerStatus[]
}>()
</script> -->

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import { ServerStatus } from "@/model/ServerStatus";
import Active from './Active.vue'

export default defineComponent({
  components: {Active},
  props: {
    servers: {
      type: Array as PropType<ServerStatus[]>,
      required: true
    }
  }
})
</script>

<style lang="scss">
.active-server-grid {
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr; 

  @media only screen and (min-width: $tablet-breakpoint)  {
    grid-template-columns: 1fr 1fr;
  }
    // @media only screen and (min-width: $large-breakpoint)  {
    //   grid-template-columns: 1fr 1fr 1fr; 
    // }
}
</style>