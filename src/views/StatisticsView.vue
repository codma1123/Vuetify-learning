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

export default {
  setup() {
    onMounted(() => console.log('onMounted'))
  }
}
</script>

<style>

</style>