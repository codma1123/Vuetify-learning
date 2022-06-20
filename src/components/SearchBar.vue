<template>
  <v-autocomplete
    v-model="search"             
    label="소환사명"
    prepend-inner-icon="mdi-magnify"
    clearable
    variant="filled"
    item-title="name"
    item-value="name"
    :items="autoCompleteItems"
    @blur="blurAutoComplate"
    @keypress.enter="searchContent(search)"
    @update:search="updateSearchContent"
    hide-no-data
    flat
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
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
    setup() {
      const router = useRouter()

      const search = ref('')
      const autoCompleteItems = ref([])

      function searchContent(payload) {
        router.push(`/summoner/${payload}`)
        nextTick(() => search.value = '')      
      }
      
      onMounted(() => autoCompleteItems.value = Object.keys(window.localStorage).map(content => ({
        name: content,
        bookmarked: false,
      })))

      return {
        search,
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

</style>