<template>
  <v-sheet height="350" color="#282830" class="champion-golds">
  </v-sheet>
</template>

<script>
import { onMounted } from 'vue'
import useSizeSetup from '@/tools/SizeSetup.vue'

  export default {
    props: {
      match: Object
    },
    setup(props) {
      
    }
  }
</script>

<style>
.champion-golds {
  padding-top: 50px;
}
</style>  