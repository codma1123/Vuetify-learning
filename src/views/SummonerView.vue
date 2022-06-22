<template>

  <!-- SummonerInfoArea -->
  <v-sheet color="subcontent">   
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
  </v-sheet>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from '../store'
import { contentSize } from '../tools/divice'

export default {
  setup() {
    const route = useRoute()
    const searchStore = useSearchStore()
    const summonerName = ref('')
    const bookmarkStyle = ref({
      starColor: '#595D67'
    })
    
    onMounted(() => {
      searchStore.searchContent(route.params.name)
      summonerName.value = route.params.name
    })
    
    const bookmarkedIcon = computed(() => 
      searchStore.user.bookmarked ? 'mdi-star' : 'mdi-star-outline'
    )

    function iconClick() {
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

    return {
      // style variables
      contentSize,
      bookmarkedIcon,
      bookmarkStyle,
      summonerName,
      searchStore,

      iconClick,
    }
  }
}
</script>

<style lang="scss">

#level {
  top: -10px;
  z-index: 1;
  opacity: 1;
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


</style>