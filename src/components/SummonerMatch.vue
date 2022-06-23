<template>
    <v-sheet 
    class="matches d-flex"
    :color="match.win ? '#28344E' : '#59343B'"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"    
    :height="contentSize.SUMMONER_TOTAL_MATCH_HEIGHT"                
    elevation="0"
  >
    <div :style="winLabel.labelStyle" class="label">
    
    </div>    
    <div :style="[winLabel.fontStyle, overrideFontStyle]">
      {{ gameMode }}
    </div>
  </v-sheet>  
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {
  props: {
    match: Object
  },
  setup(props) {
    const { contentSize, searchStore} = useSizeSetup()
    const gameModeMap = new Map([['CLASSIC', '일반'], ['ARAM', '무작위 총력전']])

    const winLabel = computed(() => props.match.win ? 
      {
        labelStyle: {
          'background-color': '#5383E8',
        },
        fontStyle: {
          'color': '#5383E8',          
        }
      } :
      {
        labelStyle: {
          'background-color': '#E84057'
        },
        fontStyle: {
          'color': '#E83D46'
        }
      }
    )

    const overrideFontStyle = {
      'font-weight': 'bold',
      'font-size': '14px',
      'margin-left': '4px',
      'margin-top': '4px'
    }
    

    const gameMode = computed(() => gameModeMap.get(props.match.gameMode))

    onMounted(() => {
      console.log(props.match)
    })

    return {
      contentSize,      

      // css style obj
      winLabel,
      overrideFontStyle,

      gameMode
    }
  }
}
</script>

<style>
.matches {
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;  
}

.matches
.label {
  min-width: .45rem;  
  
}

.iswin {
  color: #E83D46;
}
</style>