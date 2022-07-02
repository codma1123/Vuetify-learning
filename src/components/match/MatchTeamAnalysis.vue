<template>

    <!-- team-analysis-menu -->
    <v-sheet
      class="matches d-flex justify-space-between align-center"    
      color="subcontent"
      :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"
      :height="contentSize.SUMMONER_TOTAL_MATCH_SEEMORE_FILTER_HEIGHT"
    >
      <v-btn                          
        :class="['ml-1 mr-1 filter-menu analysis-filter', button.activate ? 'filter-active' : ''] "      
        v-for="(button, i) in btnMenus"
        elevation="0"
        :color="button.activate ? 'subcontent' : 'subcontent'"             
        :key="i"           
        @click="selectAnalysisMenu(i)"   
      >
        <span> {{ button.name }} </span>
      </v-btn>    
    </v-sheet>

    <v-sheet class="contentss">
      TEST..
    </v-sheet>

</template>

<script>
import { ref } from 'vue'
import useSizeSetup from '../../tools/SizeSetup.vue'

export default {  
  props: {
    teams: {
      type: Object
    }
  },
  setup(props) {
    const { contentSize } = useSizeSetup()

    const btnMenus = ref([
      {
        name: '경기 분석',
        activate: true,  
      },
      {
        name: '골드 & 킬',
        activate: false,  
      },
      {
        name: '킬 맵',
        activate: false,  
      },
      {
        name: '타임라인',
        activate: false,  
      },
    ])

    function selectAnalysisMenu (btnIndex) {
      btnMenus.value.forEach(btn => btn.activate = false)
      btnMenus.value[btnIndex].activate = true
    }

    return {
      contentSize,

      btnMenus,
      selectAnalysisMenu
    }
  } 
}
</script>

<style>
.filter-active {
  color: #5383e8 !important;
  font-weight: bold;
  border-bottom: 3px solid #5383e8;
}

.analysis-filter {
  border-radius: 0px !important;
}

.contentss {  
  margin-top: -9px;
}
</style>