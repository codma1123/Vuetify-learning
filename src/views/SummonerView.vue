<template>
  <v-container class="d-flex justify-center ">
    <v-sheet       
      class="content"
      height="500" 
      color="#121212" 
    >      

    </v-sheet>
  </v-container>
</template>

<script>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from '../store'

export default {
  setup() {
    const route = useRoute()
    const searchStore = useSearchStore()
    
    onMounted(() => {
      searchStore.searchContent(route.params.name)
    })
  }
}
</script>

<style>

</style>