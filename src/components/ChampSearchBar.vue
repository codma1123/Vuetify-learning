<template>  
  <v-autocomplete    
    v-model="search"             
    hide-details
    label="검색"    
    prepend-inner-icon="mdi-magnify"
    clearable
    open-on-clear
    color="#5383E8"
    background-color="#5383E8"
    variant="outlined"
    item-title="name"
    item-value="name"
    :items="autoCompleteItems"
    @blur="blurAutoComplate"
    @keypress.enter="searchContent(search)"
    @update:search="updateSearchContent"
    hide-no-data
  >
    <template v-slot:item="{ props, item }">
      <v-list-item 
        @click="listItemClick(item.raw.name)"
        v-bind="props">            
        <v-icon class="bookmarked">
          {{ item.raw.bookmarked ? 'mdi-bookmark' : 'mdi-bookmark-outline'}}
        </v-icon>            
      </v-list-item>
    </template>
  </v-autocomplete>  
</template>

<script>
import { nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import prepandIcon from '/icon-champion.ico'

export default {
    setup() {
      const router = useRouter()

      const search = ref('')
      const autoCompleteItems = ref([])
      const focusElement = ref(null)

      function searchContent(payload) {
        search.value = ''        
        router.push(`/summoner/${payload}`)
        
        nextTick(() => focusElement.value.blur())
      }
      
      onMounted(() => {
          autoCompleteItems.value = Object.keys(window.localStorage).map(content => ({
          name: content,
          bookmarked: false,
        }))
      })

      return {
        search,
        autoCompleteItems,
        focusElement,
        searchContent,
        prepandIcon,
        blurAutoComplate: () => search.value = '',
        listItemClick: e => searchContent(e),
        updateSearchContent: e => search.value = e
      }

    }
}
</script>

<style>

</style>