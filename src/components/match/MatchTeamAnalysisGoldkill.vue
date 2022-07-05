<template>  
  <div class="gold-chart-label d-flex justify-center align-center">
    <v-btn-toggle
      v-model="text"
      mandatory
      rounded="md"   
      divided   
      group
      tile
      selected-class="gold-chart-menu-selected"
      variant="outlined"
    >
      <v-btn 
        class="gold-chart-label-btn"
        value="goldGet">
        팀별 골드 획득량
      </v-btn>

      <v-btn 
        class="gold-chart-label-btn"
        size="10" value="goldDiff">
        팀별 골드 획득량 차이
      </v-btn>

      <v-btn 
        class="gold-chart-label-btn"
        size="10" value="killDiff">
        팀별 누적 킬 차이
      </v-btn>

    </v-btn-toggle>
  </div>  
  <div class="contentss-top-label text-center d-flex justify-center">
    <span class="win-team-dot"> </span>
    <span class="mr-4 mb-2"> 승리팀 </span>
    <span class="lose-team-dot"></span>
    <span class="mb-2"> 패배팀 </span>
  </div>

  <div class="gold-chart">    
    <gold-get-chart  v-if="text==='goldGet'"  :match="match" />
    <gold-diff-chart v-if="text==='goldDiff'"  />    
    <kill-diff-chart v-if="text==='killDiff'"  />    
  </div>

</template>

<script>
import { ref } from 'vue'

import GoldGetChart from '@/components/match/charts/GoldGetChart.vue'
import GoldDiffChart from '@/components/match/charts/GoldDiffChart.vue'
import KillDiffChart from '@/components/match/charts/KillDiffChart.vue'

export default {
  props: {
    match: Object
  },
  components: {
    GoldDiffChart,
    GoldGetChart,
    KillDiffChart
  },
  setup() {
    const text = ref('goldGet')
    return {      
      text
    }
  }
}
</script>

<style>
.gold-chart {
  height: 500px;
}

.gold-chart-label {
  margin-top: -10px;
  height: 80px;
}

.gold-chart-label-btn {
  padding-left: 15px;
  padding-right: 15px;
  font-size: 13px;
  font-weight: bold;
  background-color: #31313c;
  color: white;
}

.gold-chart-menu-selected {
  background-color: #5383e8;
  color: white;
}

.gold-chart-menu-selected:hover {
  background-color: #81acff;
  color: white;
}
</style>