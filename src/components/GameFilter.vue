<template lang="pug" scoped>
.tab-container
  ul.tab-list 
    li(v-for="idx in showIndex" :class="{'active': idx===gameId }")
      router-link(v-if="idx === ''" :to="{ name: 'servers'}" replace) {{ games[idx] }}
      router-link(v-else :to="{ name: 'servers', query: { gameId: idx }}" replace) {{ games[idx] }}
      ServerTypeIcon(v-if="idx !== ''" :type="{gameId: idx}" logoType="clean")
    
</template>

<script lang="ts" setup>
import {defineProps} from 'vue'
import ServerTypeIcon from '@/components/ServerTypeIcon.vue'

const props = defineProps<{
  gameId: string
}>()

const games = {
  '': 'All Servers',
  '0': 'NetQuake',
  '1': 'QuakeWorld',
  '2': 'Quake II',
  '3': 'Quake 3',
  '4': 'Quake IV',
  '5': 'Quake Enhanced',
}
const showIndex = ['', '0', '5', '1']

</script>

<style lang="scss" scoped>
ul {
  padding: 0;
  display: flex;
  flex-direction: row
}
li {
  a {
    text-decoration: none;
    color: $grey-3;
  };
  gap: 10px;
  display: flex;
  font-size: 16px;
  line-height: 36px;
  text-align: center;
  margin-right: 1rem;
  padding-bottom: .2rem;
  position: relative;
  transition: 0.25s background ease;
  cursor: pointer;
  &::after {
    content: "";
    height: 2px;
    width: 100%;
    position: absolute;
    display: block;
    background: $whitish;
    bottom: 0;
    opacity: 0;
    left: 0;
    transition: 0.25s ease;
  }
  &.active {
    a {
      color: $whitish;
    }
    &::after {
      background: $tan;
      opacity: 1;
    }
  }
  &:hover::after {
    opacity: 1;
  }
}
.line {
  position: absolute;
  height: 2px;
  background: #1E88E5;
  width: 25%;
  top: 34px;
  left: 0;
  transition: 0.25s ease;
}
</style>