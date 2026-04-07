<template lang="pug">
template(v-if="props.mode")
  span.bright {{modInfo.full}} 
  span  · 
  span.mod-small {{ props.mod }}
template(v-else)
  span.bright {{ modInfo.full }}
</template>
<script lang="ts" setup>
import {computed} from 'vue'
import { getModInfo } from '@/helpers/mod';
const modInfo = computed(() => getModInfo(props.mod, props.mode));
const props = defineProps<{mod: string | null, mode?: string | null}>();

</script>
<style lang="scss">
.mod-small {
  font-size: .8rem;
}
</style>