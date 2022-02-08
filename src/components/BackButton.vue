<template lang="pug">
.back-button(@click="$emit('back')")
  FontAwesome(:icon="['fas', 'chevron-left']") 
  |  Back
</template>

<script lang="ts" setup>
</script>

<style scoped lang="scss">
.back-button {
  cursor: pointer;
}
</style>