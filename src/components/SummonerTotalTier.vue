<template>  
  <v-sheet 
    rounded="md"
    class="mt-2 d-flex align-center justify-space-between" 
    color="subcontent"
    :width="contentSize.SUMMONER_TOTAL_TIER_WIDTH"
    min-height="35"
    :max-height="contentSize.SUMMONER_TOTAL_TIER_HEIGHT"              
    elevation="0"
  >
    <span 
      :style="{'font-size': '14px'}"
      class="ml-2"
    > {{ title }} 
    </span>    
    <span       
      v-if="!searchStore.isRankGame"
      :style="[{'opacity': '0.2'}, {'font-size': '14px'}]"
      class="mr-2"
    > UnRanked      
    </span>

  </v-sheet>
  <v-sheet
    color="subcontent"
    class="rank-more justify-space-between"
    :width="contentSize.SUMMONER_TOTAL_TIER_WIDTH"
    :height="contentSize.SUMMONER_TOTAL_TIER_MORE_HEIGHT"
    v-if="searchStore.isRankGame"
  >    
    <div class="d-flex">
      <v-avatar color="primary" size="50" class="ml-2">  
      </v-avatar>
      <div class="ml-5">
        <div class="font-weight-bold text-h6">
          {{ searchStore.user.tier }} {{ tierArab.get(searchStore.user.rank)}}
        </div>
        <div :style="LPFontStyle">
          {{ searchStore.user.leaguePoints }} LP
        </div>
      </div>
    </div>

    <div :style="winRateFontStyle">
      <div class="mr-2">
        {{ searchStore.user.wins}}승 {{searchStore.user.losses}}패        
      </div>      
      <div class="mt-1 ml-1">
         승률 {{ winRate }}%
      </div>
    </div>
  </v-sheet>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useSearchStore } from '../store'
import { contentSize } from '../tools/divice'


export default {
  props: {
    title: String
  },
  setup(props) {
    const searchStore = useSearchStore()    
    const tierArab = new Map([['IV', '4'], ['III', '3'], ['II', '2'], ['I', '1']])
    const winRate = computed(() =>
      Math.round(searchStore.user.wins / (searchStore.user.losses + searchStore.user.wins) * 100)
    )

    const winRateFontStyle = {
      'opacity': 0.3,
      'font-size': '12px'
    }

    const LPFontStyle = {
      'opacity': 0.5,
      'font-size': '12px',
      'font-weight': 100,            
    }

    return {      
      contentSize,
      searchStore,

      //style
      winRateFontStyle,
      LPFontStyle,

      winRate,
      tierArab
    }
  }
}
</script>

<style>
.rank-more {
  margin-top: 2px;
  align-items: center;
  text-align: start;
  display: flex;  
}

</style>