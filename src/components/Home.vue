<template>
  <v-container class="d-flex justify-center ">
    <v-sheet       
      class="content"
      height="500" 
      :width="textFieldWidth"
      color="#121212" 
    >      
      <div class="title">
        오승딱스
      </div>

      <search-bar />
    </v-sheet>
  </v-container>
</template>

<script>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useSearchStore } from '../store/index.js'
import { useLocalStore } from '../store/local.js'

import SearchBar from '../components/SearchBar.vue'

export default {
  components: {
    SearchBar
  },

  setup() {
    const { name, mobile } = useDisplay() 
    const searchStore = useSearchStore()
    const localStore = useLocalStore()
    const router = useRouter()

    const search = ref('')
    const autoCompleteItems = ref([])

    const height = computed(() => {
      switch (name.value) {
        case 'xs': return 220
        case 'sm': return 400
        case 'md': return 500
        case 'lg': return 600
        case 'xl': return 500
        case 'xxl': return 500
      }
    })

    const textFieldWidth = 500

    onMounted(() => {
      
    })

    function searchContent(payload) {
      console.log(payload, 'payload')
      router.push(`/summoner/${payload}`)
      nextTick(() => search.value = '')      
    }

    onMounted(() => autoCompleteItems.value = Object.keys(window.localStorage).map(content => ({
      name: content,
      bookmarked: false,
    })))
    
    return { 
      mobile,
      search,
      height,
      textFieldWidth,
      autoCompleteItems,
      searchContent, 
      blurAutoComplate: () => search.value = '',
      listItemClick: e => searchContent(e),
      updateSearchContent: e => search.value = e
    }
  }
}
</script>

<style>
.rounded {
  border-radius: 10px;
}

.content {
  margin-top: 250px;
}

.title {
  font-size: 120px;
  display : flex;
  font-weight: 600;
  justify-content : center;
}

.text-field {  
}

.bookmarked {
  
}
</style>