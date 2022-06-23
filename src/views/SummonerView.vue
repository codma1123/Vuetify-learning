<template>

  <!-- SummonerInfoArea -->
  <v-sheet               
    class="d-flex justify-center mx-auto align-center"
    rounded="md"
    color="subcontent"                
  > 
    <v-sheet                                
      :width="contentSize.MAIN_CONTENT_SHEET_SIZE"        
      :height="contentSize.SUMMONER_INFO_SHEET_HEIGHT"
      color="subcontent"                
      class="d-flex align-center"
      v-if="!searchStore.userInfoLoaded"
    >           
    
      <!-- ProfileIconArea -->
      <v-sheet
        rounded="xl"
        width="150" 
        color="subcontent"
        class="text-center"
        height="150"
      >
        <v-avatar 
          rounded="xl" 
          :size="contentSize.SUMMONER_INFO_ICON_HEIGHT"
        >
          <v-img :src="searchStore.iconUrl"></v-img>            
        </v-avatar>
        <v-chip id="level">
          {{ searchStore.user.summonerLevel }}
        </v-chip>  
      </v-sheet>   

      <!-- ProFileNameArea -->
      <v-sheet          
        color="subcontent"
        width="300"
        height="150"
      >          
      
        <!-- ProFileTiersArea -->
        <div class="ml-3">
          <v-chip              
            class="ma-1"              
            v-for="i in 4"
            :key="i"
            label
            size="x-small"
          > {{i}} TIER
            <v-tooltip
              class="tiers"
              activator="parent"
              location="top"    
              color="#fff" 
            >
              {{ i }} TIER
            </v-tooltip>
          </v-chip>
        </div>

        <!-- ProFileNameBookmarkArea -->
        <div class="summoner-name mt-2 mr-3">
          <v-card-title class="text-h5 font-weight-bold">
            {{summonerName}}
          </v-card-title>          

          <span 
            @click="iconClick"
            class="bookmark"
            :style="bookmarkStyle"
          >
            <v-icon 
              :color="bookmarkStyle.starColor"
              size="20">{{ bookmarkedIcon }}
            </v-icon>
          </span>                            
        </div>
        <v-card-subtitle              
          class="mb-2"
          :style="{'font-size': '12px'}"
        >
          래더 랭킹
        </v-card-subtitle>
      </v-sheet>
    </v-sheet>

  </v-sheet>
  <!-- SummonerViewSelectArea -->
  <v-sheet 
    color="subcontent"    
    class="view-select d-flex justify-center mx-auto align-center"    
    height="50"
    v-if="!searchStore.userInfoLoaded"
  >
    <v-sheet                                
      :width="contentSize.MAIN_CONTENT_SHEET_SIZE"              
      color="subcontent"                
      class="d-flex justify-start align-center ml-7"      
    >
      <v-btn                
        class="ml-1"
        width="100"
        rounded="md"
        v-for="(button, i) in viewSelectToggleButtons"
        elevation="0"
        :color="button.activate ? '#515163' : 'subcontent'"   
        @click="selectView(button.path, i)" 
        exact
        :key="i"
      >
       {{ button.name }}        
      </v-btn>
      <v-btn
        width="100"
        elevation="0"   
        color="subcontent"     
      >
        <span class="ingame-info">인게임 정보</span>
        
      </v-btn>
    </v-sheet>    
  </v-sheet>

  <!-- ContentArea -->
  <router-view></router-view>

</template>

<script>
import { computed, onMounted, onUpdated, ref, watch } from 'vue'
import { useRoute, useRouter, onBeforeRouteUpdate } from 'vue-router'
import useSizeSetup from '@/tools/SizeSetup.vue'

import SummonerChampions from '../components/SummonerChampions.vue'

export default {
  components: {
    SummonerChampions
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    
    const { searchStore, contentSize } = useSizeSetup()
    
    const summonerName = ref('')
    const viewSelectToggleModel = ref(0)
    const bookmarkStyle = ref({
      starColor: '#595D67'
    })

    const viewSelectToggleButtons = ref([])
    
    onMounted(() => {
      summonerName.value = route.params.name
      viewSelectToggleButtons.value = [
        {
          name: '종합',  
          activate: true, 
          path: `/summoner/${summonerName.value}`
        },
        {
          name: '통계',      
          activate: false,
          path: `/summoner/${summonerName.value}/champions`
        },      
      ]           
    })

    onUpdated(() => {
      summonerName.value = route.params.name
    })
      
    const bookmarkedIcon = computed(() => 
      searchStore.user.bookmarked ? 'mdi-star' : 'mdi-star-outline'
    )

    function iconClick(i) {
      searchStore.user.bookmarked = !searchStore.user.bookmarked
      bookmarkStyle.value = searchStore.user.bookmarked 
        ? {
          background: '#E28400',
          outline: 'none',
          starColor: '#fff'
        }
        : {
          background: 'none',
          starColor: '#595D67'
        }      

    }

    function selectView(path, i) {      
      if(!viewSelectToggleButtons.value[i].activate) {
        viewSelectToggleButtons.value[0].activate = !viewSelectToggleButtons.value[0].activate
        viewSelectToggleButtons.value[1].activate = !viewSelectToggleButtons.value[1].activate
      }
      router.push(path)
    }

    return {
      // style variables
      contentSize,
      bookmarkedIcon,
      bookmarkStyle,
      summonerName,
      searchStore,

      viewSelectToggleButtons,
      viewSelectToggleModel,

      // functions
      iconClick,
      selectView
    }
  }
}
</script>

<style lang="scss">

#level {
  top: -10px;
  z-index: 1;  
  background: #202D37;
  font-size: 13px;
  max-height: 18px;
}

.v-tooltip .v-overlay__content {
  color: #fff;
  background: black;
  transition-property: none;
  font-size: .5rem;
}


.summoner-name {
  display: flex;
  align-items: center;
  justify-items: start;
}
.summoner-name .bookmark {
  margin-left: -5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  outline: 1.7px solid #3E404A;    
  height: 30px;
  width: 30px;
  border-radius: .3rem;
}

.view-select {
  margin-top: 1px;
}

.view-select-toggle {
  margin-top: 1px;
}

.ingame-info {
  color: #00BB99;
}


</style>