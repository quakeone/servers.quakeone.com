<template lang="pug">
.rules
  h3 Rules
  table
    tr(v-for="rule in props.rules")
      td.setting {{rule.setting}}
      td.value {{rule.value}}
</template>

<script lang="ts" setup>
import {ServerSetting} from '@/model/ServerSetting'
import {defineProps} from 'vue'

const props = defineProps<{rules: ServerSetting[]}>()
</script>

<style scoped lang="scss">
table {
  width: 100%;
  border-top: 1px solid $grey-2;
  td.setting {
    width: 20%;
    border-right: 1px solid $grey-2;
  }
  td.value {
    padding-left: 1rem;
  } 
}
</style>