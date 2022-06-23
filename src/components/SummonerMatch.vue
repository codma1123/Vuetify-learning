<template>
    <v-sheet 
    class="matches"
    :color="match.win ? '#28344E' : '#59343B'"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"    
    :height="contentSize.SUMMONER_TOTAL_MATCH_HEIGHT"                
    elevation="0"
  >
    
  </v-sheet>  
</template>

<script>
import { onMounted, ref } from 'vue'
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {
  props: {
    match: Object
  },
  setup(props) {
    const { contentSize, searchStore} = useSizeSetup()
    const gameModeMap = new Map([['CLASSIC', '일반'], ['ARAM', '무작위 총력전']])

    onMounted(() => {
      console.log(props.match)
    })

    return {
      contentSize,      
    }
  }
}
</script>

<style>
.matches {
  border-radius: 5px;
  margin-bottom: 5px;
}
</style>