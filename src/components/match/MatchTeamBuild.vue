<template>
  <v-sheet height="35" class="d-flex align-center" color="#282830">
    <span class="ml-2 build-type"> 아이템 빌드 </span>
  </v-sheet>

  <div class="build-divider"></div>

  <v-sheet class="d-flex align-center flex-wrap" color="subcontent">
    <div v-for="(timeline, i) in itemIcons" :key="i" class="ml-2 mr-2 mt-2">
      <div class="build-item-wrap d-flex align-center">
        <img v-for="(url, j) in timeline.itemUrls" :key="j" :src="url" alt="" class="build-item-icon">
      </div>
      <div class="text-center build-type"> {{ timeline.timestamp - 1 }}분 </div>

    </div>
  </v-sheet>
</template>

<script>
import useSizeSetup from '@/tools/SizeSetup.vue'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  props: {
    match: Object
  },

  setup(props) {
    const { searchStore, funcs, urlConfig } = useSizeSetup()
    const itemIcons = ref([])

    onMounted(async () => {      
      const ownerItemEvents = await searchStore.searchBuild(props.match)
      itemIcons.value = ownerItemEvents.map(event => {
        if(!event.items.length) return 
      
        return {
          timestamp: event.timestamp,
          itemUrls: event.items.map(item => funcs.createItemIconUrl(urlConfig.imgUrl, searchStore.iconCdnVersion, item.itemId))
                                
        }
      }).filter(event => event !== undefined)

      console.log(itemIcons.value)
          
    })

    return {
      itemIcons
    }
  }
}
</script>

<style>
.build-item-icon {
  width: 30px;
  height: 30px;    
  margin-left: 4px;
  margin-right: 4px;
}

.build-type {
  font-size: 12px;
  letter-spacing: .01rem;
  opacity: .6;
  font-weight: 200;
}

.build-divider {
  height: 3px;
  background-color: #121212;
}

.build-item-wrap {
  background-color: #282830;  
  border-radius: 10px;
  
  height: 40px;
  
}


</style>