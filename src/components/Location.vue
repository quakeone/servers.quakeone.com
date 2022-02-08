<template lang="pug">
.location 
  FontAwesome.map-icon(:icon="['fas', 'map-marker-alt']")
  span.bright  {{props.location || 'unknown'}}
</template>
<script lang="ts" setup>
import {defineProps} from 'vue'
const props = defineProps<{
  location: string
}>()
</script>