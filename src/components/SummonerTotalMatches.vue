<template>
  <!-- filter -->
  <v-sheet     
    class="mt-2 d-flex justify-space-between align-center match-filter"  
    color="subcontent"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"    
    :height="contentSize.SUMMONER_TOTAL_MATCHES_FILTER_HEIGHT"                
    elevation="0"
  >
    <div>
      <v-btn            
        height="25"    
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
        height="25"                
        class="ml-2 quqvbtn"      
        max-width="130"

        color="subcontent"
        rounded="md"
        elevation="0"            
      >  
        <select 
          @change="onChange"
          id="queueType">
          <option 
            v-for="(select, i) in menuItems"
            :key="i"
            :value="i"
          > {{select.title}}
          </option>
        </select>
        <v-icon 
          class="pb-1 tri-icon"
          :style="{'opacity': '0.4'}"
          size="10"
        > mdi-rotate-180 mdi-triangle</v-icon>
      </v-btn>
    </div>
  </v-sheet>  

  <!-- RecentMatchesDashboard -->
  <v-sheet 
    class="recent-matches"
    color="subcontent"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"    
    :height="contentSize.SUMMONER_TOTAL_MATCHES_RECENT_HEIGHT"                
    elevation="0"
  >
    
  </v-sheet>  

  <!-- RecentMatches -->
  <summoner-match 
    v-for="(match, i) in searchStore.matches"
    :key="i"
    :match="match"
  />
  

</template>

<script>
import useSizeSetup from '@/tools/SizeSetup.vue'
import SummonerMatch from '@/components/SummonerMatch.vue'

export default {
  components: {
    SummonerMatch
  },
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
      { title: '큐 타입' },
      { title: '일반(비공개 선택)' },
      { title: '무작위 총력전' },
      { title: 'AI 상대 대전' },
      { title: '격전' },
      { title: '이벤트 게임' },
    ]

    function onChange (event) {
      const filter = menuItems[event.target.value].title
    }
    return {
      contentSize,
      searchStore,

      viewSelectToggleButtons,
      menuItems,

      onChange
    }
  }
}
</script>

<style>
.match-filter {
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  
}

.recent-matches {
  margin-top: 3px;
  margin-bottom: 5px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}

.matches {
  margin-top: 0.5px; 
  
}

#queueType {  
  -webkit-appearance: none; 
  -moz-appearance: none;
  appearance: none;

  font-size: 0.875rem;  
  letter-spacing: 0.0892857143em;
  font-weight: 500;
  border: none;
  border-radius: 0;
  height: 30px;  
  width: 135px;  
  justify-content: center;
  padding-left: .8rem;
    
  background-color: #31313C;
  border-color: #31313C;
  outline: none !important;
  
  margin: 0;  
}

#queueType-selectbox :hover {
  border-color: #888;
}

.tri-icon {
  left: -20px;
}

.quqvbtn .v-ripple__container {
  display: none;
  padding-right: 20px;
}

.quqvbtn:before
.quqvbtn:after {  
  padding-right: 20px;    
  transition: none;
}
</style>