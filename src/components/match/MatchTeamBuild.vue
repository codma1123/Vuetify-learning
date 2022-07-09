<template>
  <v-sheet height="35" class="d-flex align-center" color="#282830">
    <span class="ml-2 build-type"> 아이템 빌드 </span>
  </v-sheet>

  <div class="build-divider"></div>

  <v-sheet class="d-flex align-center flex-wrap" color="subcontent pl-4">
    <div v-for="(timeline, i) in itemIcons" :key="i" class="mt-2">
      <div class="d-flex align-center">
        <div class="build-item-wrap d-flex align-center">
          <img v-for="(url, j) in timeline.itemUrls" :key="j" :src="url" alt="" class="build-item-icon">        
        </div>      
        <div v-if="i !== (itemIcons.length - 1)" class="build-item-next d-flex justify-center align-center">
          <v-icon color="grey">
            mdi-chevron-down mdi-rotate-270
          </v-icon>
        </div>
      </div>
      <div class="text-center build-type pr-7 pt-1 pb-1"> {{ timeline.timestamp - 1 }}분 </div>
    </div>
  </v-sheet>

  <v-sheet height="35" class="d-flex align-center" color="#282830">
    <span class="ml-2 build-type"> 스킬 빌드 </span>
  </v-sheet>

  <div class="build-divider"></div>

  <v-sheet class="d-flex align-center flex-wrap" color="subcontent pl-4">
    <div v-for="(spell, i) in skillMasterSequence" :key="i">
      {{spell}}
    </div>
  </v-sheet>

  <v-sheet class="d-flex align-center flex-wrap" color="subcontent pl-4">
    <div v-for="(spell, i) in skillSequence" :key="i">
      {{spell}}
    </div>    
  </v-sheet>


</template>

<script>
import useSizeSetup from '@/tools/SizeSetup.vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export default {
  props: {
    match: Object
  },

  setup(props) {
    const { searchStore, funcs, urlConfig } = useSizeSetup()
    const itemIcons = ref([])
    const skillSequence = ref([])
    const skillMasterSequence = ref([])

    const skillEnum = {
      '1': 'Q',
      '2': 'W',
      '3': 'E',
      '4': 'R'
    }
    
    onMounted(async () => {      
      const { ownerItemTimeLine, ownerSkillTimeLine } = await searchStore.searchBuild(props.match)
      const spellIds = await funcs.createSpellIconUrl(urlConfig.imgUrl, searchStore.iconCdnVersion, props.match.owner.championName)
      itemIcons.value = ownerItemTimeLine
      
      console.log(spellIds)

      skillSequence.value = ownerSkillTimeLine.map(skill => skillEnum[skill])
      
      const result = ownerSkillTimeLine.map(skill => skill)
                          .reduce((acc, cur) => {
                            acc[cur] = acc[cur] + 1
                            if(acc[cur] === 5) {
                              skillMasterSequence.value.push(cur)
                              delete acc[cur]
                            }
                            return acc
                          }, {'1': 0, '2': 0, '3': 0, '4': 0})
      delete result['4']
      skillMasterSequence.value = skillMasterSequence.value.concat(Object.keys(result.sort()))            
                                                                
    })

    return {
      itemIcons,
      skillMasterSequence,
      skillSequence

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
  height: 1px;
  background-color: #121212;
}

.build-item-wrap {
  background-color: #282830;  
  border-radius: 10px;
  
  height: 40px;  
}

.build-item-next {
  background-color: #282830;  
  
  height: 30px;
  width: 30px;
}


</style>