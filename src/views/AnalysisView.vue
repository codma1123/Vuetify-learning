<template>

  <!-- SearchContentArea -->
  <v-sheet           
    height="100"       
    color="subcontent"         
  >   
    <v-sheet               
      class="d-flex justify-start mx-auto align-center"
      rounded="md"
      color="subcontent"          
      :width="contentSize.MAIN_CONTENT_SHEET_SIZE"
    > 
      <v-sheet                        
        class="mt-5"
        width="500"
        color="subcontent"
      >
        <champ-search-bar/>          
      </v-sheet>                    
    </v-sheet>
  </v-sheet>
  
  <!-- MainContentsArea -->
  <v-sheet           
    height="1000"
    class="mt-5"
    color="#121212"             
  >   
    <v-row justify="center">

      <!-- FilterGroup -->
      <v-card       
        class="d-flex justify-end mx-auto"
        rounded="md"
        color="subcontent"
        :height="contentSize.AYALYSIS_FILTER_GROUP_HEIGHT"
        :width="contentSize.MAIN_CONTENT_SHEET_SIZE"          
      >                      
        <v-btn-toggle 
          tile
          v-model="positionToggleModel"
          divided
          class="mr-1"
        >
          <v-btn 
            width="100"              
            color="primary"
            variant="outlined"
            v-for="(button, i) in positionToggleButtons"
            :key="i"
          >
            {{ button.name }}
          </v-btn>
        </v-btn-toggle>                     
      </v-card>
    </v-row>

    <v-row justify="center">

      <!-- champs -->
      <champ-list :width="300"/>

      <!-- ranking -->
      <v-card      
        class="mt-5 ml-5"         
        rounded="md"
        color="subcontent"
        height="1000"
        width="880"
      >    
        
      </v-card>
    </v-row>
  </v-sheet>  
</template>

<script>
import { onMounted, computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { contentSize } from '../tools/divice'


import ChampSearchBar from '../components/ChampSearchBar.vue'
import ChampList from '../components/ChampList.vue'


export default {
  components: {
    ChampSearchBar,
    ChampList
  },
  setup() {

    const { name, mobile } = useDisplay()

    const searchContentAreaHeight = computed(() => {
      switch (name.value) {
        case 'xs':
        case 'sm':
        case 'md':
        case 'xl':
        case 'xxl': return 100        
      }
    })

    const positionToggleModel = ref(0)
    const positionToggleButtonNames = [
      'TOP', 'JG', 'MID', 'AD', 'SUP' 
    ]

    onMounted(() => {})

    return {
      // css values
      searchContentAreaHeight,
      contentSize,

      // toogle Buttons
      positionToggleModel,
      positionToggleButtons: [...Array.from({length: 5})].map((_, i) => ({
        name: positionToggleButtonNames[i],
        callback: () => console.log(positionToggleButtonNames[i])
      })),
      name,
    }
  }
}
</script>

<style scoped>
.position-toggle {
  right: 10px;
}
</style>