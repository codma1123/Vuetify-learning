<template>
  <v-app-bar
    absolute
    class="codma-app-bar"
    color="primary"
    elevation="0"
    :height="appMenuHeight + 10"
  >      
    <v-row justify="center">
      <v-sheet :width="contentSize.MAIN_CONTENT_SHEET_SIZE" color="secondary">        
        <v-tabs 
          class="tabs"
          v-model="tab"                
          background-color="primary"        
        >
          <v-tab          
            v-for="(menu, i) in tabMenus"
            :key="i"
            :to="menu.path"
            exact
          >
            {{ menu.name }}
          </v-tab>
        </v-tabs>
      </v-sheet>
    </v-row>

    <v-card
      class="search"
      :height="appMenuHeight"
      width="300"
      color="white"        
      v-if="!searchBar"
      right
      position="fixed"      
    >
      <search-bar/>
    </v-card>

  </v-app-bar>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import SearchBar from '../components/SearchBar.vue'

import useSizeSetup from '@/tools/SizeSetup.vue'

export default {
  components: {
    SearchBar
  },

  setup() {
    const route = useRoute()
    const { contentSize } = useSizeSetup()


    const tab = ref(null)
    const appMenuHeight = 50
  
    const tabMenus = [
      {
        name: '홈',
        path: '/',
      },
      {
        name: '분석',
        path: '/analysis'
      },
      {
        name: '통계',
        path: '/stat'
      },
      {
        name: '랭킹',
        path: '/rank'
      }
    ]

    const searchBar = computed(() => route.path === '/')
      
    return { 
      tabMenus,
      appMenuHeight,
      tab,      
      searchBar,
      contentSize
    }
  }
}
</script>

<style>
.tabs {
  
}

.search {
  right: 13px; 
}

.codma-app-bar {
  top: 0px;
  margin-top: 0px;
}

</style>