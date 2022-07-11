<template>
  <v-sheet               
    class="d-flex justify-center mx-auto"
    color="#121212"             
  >
    <v-sheet                                
      :width="contentSize.MAIN_CONTENT_SHEET_SIZE - 40"              
      color="#121212"
      v-if="!searchStore.userInfoLoaded"
    >      
      <v-row justify="start">
        <v-col>
          <summoner-total-tier title="솔로랭크"/>      
          <summoner-total-tier-champions />      
          <summoner-total-recent-duo />   
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
import SummonerTotalRecentDuo from './SummonerTotalRecentDuo.vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  components: {
    SummonerTotalTier,
    SummonerTotalTierChampions,
    SummonerTotalMatches,
    SummonerTotalRecentDuo
  },
  setup() {
    const { contentSize, searchStore } = useSizeSetup()
    const route = useRoute()

    onMounted(() => {
      setTimeout(() => {
        if(!searchStore.tryLoad) {
          searchStore.searchContent(route.params.name)
        }
      })

    })
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