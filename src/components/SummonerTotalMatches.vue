<template>
  <!-- filter -->
  <v-sheet 
    class="mt-2 d-flex justify-space-between align-center" 
    color="subcontent"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"    
    :height="contentSize.SUMMONER_TOTAL_MATCHES_FILTER_HEIGHT"                
    elevation="0"
  >
    <div>
      <v-btn            
        height="28"    
        class="ml-1"      
        rounded="md"
        v-for="(button, i) in viewSelectToggleButtons"
        elevation="0"
        :color="button.activate ? '#515163' : 'subcontent'"         
        exact
        :key="i"
      >
        <span :class="button.activate ? 'font-weight-bold' : ''">
          {{ button.name }}        
        </span>
      </v-btn>
      <v-btn
        height="33"   
        width="100 d-flex justify-space-between" 
        class="ml-1"      
        color="subcontent"
        rounded="md"
        elevation="0"        
      >  
        <span class="mr-8"> 큐타입 </span>
        <v-icon 
          class="pb-1"
          :style="{'opacity': '0.4'}"
          size="13"
        > mdi-rotate-180 mdi-triangle</v-icon>
      </v-btn>
    </div>
  </v-sheet>  
  <v-sheet 
    class="matches"
    color="subcontent"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"    
    :height="contentSize.SUMMONER_TOTAL_MATCHES_HEIGHT"                
    elevation="0"
  >
    
  </v-sheet>  

</template>

<script>
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {
  setup() {
    const { contentSize, searchStore } = useSizeSetup()

    const viewSelectToggleButtons = [
      {
        name: '전체',
        activate: true,
      },
      {
        name: '솔로랭크',
        activate: false,
      },
      {
        name: '자유랭크',
        activate: false,
      }
    ]

    const menuItems = [
      { title: '큐타입' },
      { title: '일반(비공개 선택)' },
      { title: '무작위 총력전' },
      { title: 'AI 상대 대전' },
      { title: '격전' },
      { title: '이벤트 게임' },
    ]
    return {
      contentSize,
      searchStore,

      viewSelectToggleButtons,
      menuItems,
    }
  }
}
</script>

<style>
.matches {
  margin-top: 0.5px; 
}
</style>