<script setup lang="ts">
import {range} from 'ramda'
import {computed, defineProps, defineEmits} from 'vue'

const PAGE_BETWEEN = 2

const props = defineProps<{
  currentPage: number,
  pageCount: number
}>()

const emits = defineEmits<{
  (e: 'newPage', pageNum: number): void
}>()

const pages = computed<number[]>(() => {
  if (props.pageCount < 10) {
    return range(1, props.pageCount + 1)
  }
  if (props.currentPage <= PAGE_BETWEEN + 2) {
    return [
      ...range(1, (PAGE_BETWEEN * 2) +3),
      props.pageCount
    ]
  } else if (props.currentPage >= (props.pageCount -( PAGE_BETWEEN + 1))) {
    return [
      1,
      ...range(props.pageCount - (PAGE_BETWEEN * 2 + 1), props.pageCount + 1) 
    ]
  } else {
    return [
      1, 
      ...range(props.currentPage - PAGE_BETWEEN, props.currentPage + PAGE_BETWEEN + 1),
      props.pageCount
    ]
  }
})
</script>

<template lang="pug">
ul
  li(:class="{'disabled': props.currentPage === 1}") 
    div(v-if="props.currentPage === 1") &lt;
    a(v-else href="#" @click.prevent="$emit('newPage', props.currentPage - 1)") &lt;
  li(v-for="page in pages" :class="{'active': page === props.currentPage}") 
    div(v-if="props.currentPage === page")  {{page}}
    a(v-else href="#" @click.prevent="$emit('newPage', page)") {{page}}
  li(:class="{'disabled': props.currentPage === props.pageCount}") 
    div(v-if="props.currentPage === props.pageCount") &gt;
    a(v-else href="#" @click.prevent="$emit('newPage', props.currentPage + 1)") &gt;
</template>

<style lang="scss" scoped> 
li {
  display: inline-block;
  text-align: center;
  margin-right: .7rem;
  a {
    color: $whitish;
    text-decoration: none;
  }
  &.active {
    color: $tan;
    font-weight: bold;
  }
}
</style>