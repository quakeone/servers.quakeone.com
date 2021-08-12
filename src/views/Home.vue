<template lang="pug">
.home
  ServerStatusComp(v-for="serverStatus in serverStatuses" :serverStatus="serverStatus")
</template>

<script lang="ts">
import { getStatus } from '../services/serversApi'
import { defineComponent, Ref, ref, onBeforeUnmount } from 'vue'
import {ServerStatus} from '@/model/ServerStatus'
import ServerStatusComp from '@/components/ServerStatus.vue'

export default defineComponent({
  name: 'Home',
  components: {
    ServerStatusComp
  },
  setup() {
    const serverStatuses: Ref<ServerStatus[]> = ref([])
    const update = () => getStatus().then(servers => {
      serverStatuses.value = servers
    })
    
    var id = setInterval(update, 5000)
    onBeforeUnmount(() => clearInterval(id))
    update()

    return {
      serverStatuses
    }
  }
});
</script>
