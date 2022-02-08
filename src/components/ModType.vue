<template lang="pug">
.mod-type {{props.mod}}
</template>

<script setup lang="ts">
import {defineProps} from 'vue'

const props = defineProps<{mod: string}>()
</script>