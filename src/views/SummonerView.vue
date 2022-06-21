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
        <v-sheet
          rounded="xl"
          width="150" 
          color="subcontent"
          class="text-center"
        >
          <v-avatar rounded="xl" size="150">
            <v-img :src="searchStore.iconUrl"></v-img>            
          </v-avatar>
          <v-chip             
            id="level"
          >
            {{ searchStore.user.summonerLevel }}
          </v-chip>  
        </v-sheet>     
      </v-sheet>
    </v-sheet>
  </v-sheet>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useSearchStore } from '../store'
import { contentSize } from '../tools/divice'

export default {
  setup() {
    const route = useRoute()
    const searchStore = useSearchStore()
    const summonerName = ref('')
    
    onMounted(() => {
      searchStore.searchContent(route.params.name).then(() => {
        console.log(searchStore.user.iconUrl)
      })
      summonerName.value = route.params.name
    })

    return {
      contentSize,
      summonerName,
      searchStore,
    }
  }
}
</script>

<style>
#level {
  top: -10px;
  z-index: 1;
  opacity: 1;
}
</style>