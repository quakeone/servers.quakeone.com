
<template lang="pug">
.image-container 
  img.map-image(ref="image")
</template>

<script lang="ts">
import { defineComponent , onMounted, ref} from 'vue'
import axios from 'axios'

export default defineComponent({
  props: {
    map: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const imageExists = ref(true)
    const image = ref<HTMLImageElement|null>(null)
    const base = 'https://quakedemos.blob.core.windows.net/maps/thumbnails/'
    const generic = base + '_generic.png'
    const map = base + props.map + '.jpg'
    onMounted(() => {
      if (image.value) {
          const img = image.value
        if (!imageExists.value) {
          img.src = generic
        } else {
          img.src = map
          img.onerror = () => {
            imageExists.value = false
            img.src = generic
          }
        }
      }
    })

    return {
      image
    }
  }
})
</script>
