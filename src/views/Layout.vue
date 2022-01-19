<template lang="pug">
.layout
  router-view
  Footer 
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Footer from './Footer.vue'
export default defineComponent({
  components: {Footer}
})
</script>
