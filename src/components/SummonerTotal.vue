<template>
  <v-sheet           
    height="1000"
    class="d-flex justify-center mx-auto"
    color="#121212"             
  >
    <v-sheet                                
      :width="contentSize.MAIN_CONTENT_SHEET_SIZE - 40"        
      :height="contentSize.SUMMONER_INFO_SHEET_HEIGHT"
      color="#121212"
      v-if="!searchStore.userInfoLoaded"
    >      
      <v-row>
        <v-col>
          <summoner-total-tier title="솔로랭크"/>      
          <summoner-total-tier-champions />
        </v-col>
        <v-col> 
          <summoner-total-matches />
        </v-col>
      </v-row>
    </v-sheet>
    
  </v-sheet>
</template>

<script>
import useSizeSetup from '@/tools/SizeSetup.vue'

import SummonerTotalTier from './SummonerTotalTier.vue'
import SummonerTotalTierChampions from './SummonerTotalTierChampions.vue'
import SummonerTotalMatches from './SummonerTotalMatches.vue'

export default {
  components: {
    SummonerTotalTier,
    SummonerTotalTierChampions,
    SummonerTotalMatches
  },
  setup() {
    const { contentSize, searchStore } = useSizeSetup()
    return {
      contentSize,
      searchStore
    }
  }
}
</script>

<style>

.v-col {
  padding-left: 1px;
  padding-right: 1px;
}
</style>