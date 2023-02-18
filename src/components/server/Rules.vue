<template lang="pug">
.rules(@click="model.showMore = !model.showMore")
  .scrollable-wrapper
    table
      tbody
        tr(v-for="rule in rules")
          td.setting {{rule.setting}}
          td.value {{rule.value}}

  .toggle(v-if="enableToggle" @click.stop="model.showMore = !model.showMore") {{ toggleText }}
</template>

<script lang="ts" setup>
import type {ServerSetting} from '@/model/ServerSetting'
import {reactive, computed} from 'vue'
const filterNames = ['teamplay', 'fraglimit', 'timelimit', 'deathmatch', ]

const props = defineProps<{
  rules: ServerSetting[]
}>()

const model = reactive<{showMore: boolean}>({showMore: false})
const filteredRules = computed(() => 
  props.rules.filter(rule => filterNames.some(fn => fn === rule.setting)))
  
const rules = computed(() => model.showMore 
  ? props.rules 
  : filteredRules.value
)
const enableToggle = computed(() => filteredRules.value.length < props.rules.length)
const toggleText = computed(() => model.showMore ? 'Less' : 'More')
</script>

<style scoped lang="scss">
// .scrollable-wrapper {
//   max-height: 200px;
//   overflow-y: auto;
//   scrollbar-color: green;
// }
.rules {
  &:hover {
    cursor: pointer;
    background-color: lighten($dark-grey, 3%);
  }
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
  .toggle {
    margin-top: .5rem;
    font-size: .8rem;
    text-decoration: underline;
  }
}
</style>