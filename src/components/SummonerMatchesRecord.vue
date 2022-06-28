<template>
  <v-sheet 
    class="recent-matches d-flex justify-space-between align-center"
    color="subcontent"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"    
    :height="contentSize.SUMMONER_TOTAL_MATCHES_RECENT_HEIGHT"                
    elevation="0"
  >
    <div class="records">
      <div class="ml-2">{{ records.total }}전 {{ records.win }}승 {{ records.lose }}패</div>
      <div class="dount-chart" :style="dountChartStyle">      
        <div class="dount-chart-hole" :style="winRateStyle">
          {{ records.winRate }}%
        </div>
      </div>    
    </div>
    
  </v-sheet>    
</template>

<script>
import { computed, onMounted } from 'vue'
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {  
  setup() {  
    const { searchStore, contentSize} = useSizeSetup()    
    const records = computed(() => {
      const ownerMatches = searchStore.matches.map(match => match.owner)
      const total = ownerMatches.length      
      const winMatch = ownerMatches.filter(match => match.win === true )
      const loseMatch = ownerMatches.filter(match => match.win === false )
      
      return {
        total,
        win: winMatch.length,
        lose: loseMatch.length,
        winRate: Math.ceil( winMatch.length / total * 100)
      }
    })

    const dountChartStyle = computed(() => {      
      const { lose, total } = records.value      
      const loseDeg = 360 / total * lose
        
      return {        
        'background' : `conic-gradient(#5383e8 0deg ${loseDeg}deg, #e84057 ${loseDeg}deg 360deg )`
      }
    })
    
    const winRateStyle = computed(() => records.value.winRate >= 50 ? {'color': '#e84057'} : {'color' : '#5383e8'})      

    onMounted(() => {
      
    })

    return {
      contentSize,

      records,

      // computed styles
      dountChartStyle,
      winRateStyle
    }
    
  }
}
</script>

<style>
.records {  
  color: #9E9EB1;
  font-weight: 400;
  font-size: 12px;  
  justify-content: center;
  margin-left: 30px;
}

.recent-matches {
  margin-top: 3px;
  margin-bottom: 7px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}

.dount-chart {
  margin-top: 10px;
  width: 90px; height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dount-chart-hole {
  width: 60px; 
  height: 60px;
  border-radius: 50%;
  font-weight: bold;
  background: #31313C;
  display: flex;
  justify-content: center;
  align-items: center;
}


</style>

