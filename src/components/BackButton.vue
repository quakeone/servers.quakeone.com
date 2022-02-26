<template lang="pug">
.back-button
  .text
    span(@click="$emit('back')")
      FontAwesome(:icon="['fas', 'chevron-left']") 
      slot
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
.back-button {
  span {
    cursor: pointer;
    padding: .3rem;
    background-color: $grey-2;
  }
  .text {
    padding: .3rem 0;
  }
}
</style>