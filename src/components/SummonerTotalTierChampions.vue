<template>
  <v-sheet 
      class="mt-2 d-flex align-center justify-space-between" 
      color="subcontent"
      :width="contentSize.SUMMONER_TOTAL_TIER_WIDTH"      
      :height="contentSize.SUMMONER_TOTAL_TIER_CHAMPIONS_HEIGHT"              
      elevation="0"
  >
  </v-sheet> 
</template>

<script>
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {
  setup() {
    const {contentSize, searchStore } = useSizeSetup()    
    return {
      contentSize, searchStore
    }
  }
}
</script>

<style>

</style>