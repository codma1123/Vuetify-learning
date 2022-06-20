<template>
  <v-app-bar
    color="primary"
    elevation="0"
    :height="appMenuHeight + 10"
  >      
    <v-row>
      <v-tabs 
        fixed-tabs
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
    </v-row>

    <v-card
      :height="appMenuHeight"
      width="300"
      color="white"        
      v-if="!searchBar"
    >
      <search-bar/>
    </v-card>

  </v-app-bar>
</template>

<script>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import SearchBar from '../components/SearchBar.vue'

export default {
  components: {
    SearchBar
  },

  setup() {
    const route = useRoute()

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
    }
  }
}
</script>

<style>
.tabs {
  margin-left:100px;
}
</style>