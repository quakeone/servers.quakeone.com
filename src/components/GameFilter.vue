<template lang="pug" scoped>
.tab-container
  ul.tab-list 
    li(v-for="idx in showIndex" :class="{'active': idx===gameId }")
      router-link(v-if="idx === ''" :to="{ name: 'servers'}" replace) {{ games[idx] }}
      router-link(v-else :to="{ name: 'servers', query: { gameId: idx }}" replace) {{ games[idx] }}
      ServerTypeIcon(v-if="idx !== ''" :type="{gameId: idx}" logoType="clean")
    
</template>

<script lang="ts" setup>
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
  flex-direction: row;
  flex-wrap: wrap;
  row-gap: .25rem;
}
li {
  a {
    text-decoration: none;
    color: $grey-3;
  };
  img {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
  gap: 6px;
  display: flex;
  align-items: center;
  font-size: 16px;
  line-height: 36px;
  text-align: center;
  margin-right: 1rem;
  padding-bottom: .2rem;
  position: relative;
  transition: 0.25s background ease;
  cursor: pointer;
  white-space: nowrap;
  @media only screen and (max-width: $phone-breakpoint) {
    font-size: 13px;
    line-height: 28px;
    margin-right: .5rem;
    gap: 4px;
    img {
      width: 16px;
      height: 16px;
    }
  }
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