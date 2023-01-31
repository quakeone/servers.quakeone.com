<template lang="pug">
.location 
  FontAwesome.map-icon(:icon="['fas', 'map-marker-alt']")
  span.flag(v-if="props.country" :class="`fi fi-${props.country.toLowerCase()}`")
  span.bright {{props.location || 'unknown'}}
</template>
<script lang="ts" setup>
import {defineProps, computed} from 'vue'
const props = defineProps<{
  country: string,
  location: string
}>()
</script>
<style lang="scss" scoped>
.location {
  display: flex;
  align-items: center;
}
span {
  margin-left: .3rem;
}
span.flag {
  height: .7rem;
}
</style>