
<template lang="pug">
.map-image(ref="image")
  slot
</template>

<script lang="ts">
import { defineComponent , onMounted, ref, watch, computed } from 'vue'
export default defineComponent({
  props: {
    map: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const image = ref<HTMLImageElement|null>(null)
    const generic = `${import.meta.env.VITE_THUMBNAILS_PATH}/generic.jpg`
    const map = computed(() => import.meta.env.VITE_THUMBNAILS_PATH + '/' + props.map + '.jpg')

    onMounted(() => {
      if (image.value) {
        image.value.style.backgroundImage = map.value 
          ? `url(${map.value}), url(${generic})`
          : `url(${generic})`
      }
    })

    watch(map, () => {
      if (image.value) {
        image.value.style.backgroundImage = map.value 
          ? `url(${map.value}), url(${generic})`
          : `url(${generic})`
      }
    })

    return {
      image
    }
  }
})
</script>
<style lang="scss">
.map-image {
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
}
</style>