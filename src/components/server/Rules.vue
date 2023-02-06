<template lang="pug">
.rules
  h3 Rules
  table
    tr(v-for="rule in props.rules")
      td.setting {{rule.setting}}
      td.value {{rule.value}}
</template>

<script lang="ts" setup>
import type {ServerSetting} from '@/model/ServerSetting'
import {defineProps} from 'vue'

const props = defineProps<{rules: ServerSetting[]}>()
</script>

<style scoped lang="scss">
table {
  width: 100%;
  border-top: 1px solid $grey-2;
        border-collapse: collapse;
  
  td.setting {
    width: 20%;
    border-right: 1px solid $grey-2;
    font-size: .8rem;
    padding-right: 1rem;
  }
  td.value {
    padding-left: 1rem;
    font-size: .8rem;
  } 
}
</style>