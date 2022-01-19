
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
      required: true
    }
  },
  setup (props) {
    const image = ref<HTMLImageElement|null>(null)
    const generic = `${process.env.VUE_APP_THUMBNAILS_PATH}/generic.jpg`
    const map = computed(() => process.env.VUE_APP_THUMBNAILS_PATH + '/' + props.map + '.jpg')

    onMounted(() => {
      if (image.value) {
        image.value.style.backgroundImage = `url(${map.value}), url(${generic})`
      }
    })

    watch(map, () => {
      if (image.value) {
        image.value.style.backgroundImage = `url(${map.value}), url(${generic})`
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
}
</style>