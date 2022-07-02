<template>
  <!-- team-analysis-menu -->
  <v-sheet
    class="matches d-flex justify-space-between align-center"    
    color="subcontent"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"
    :height="contentSize.SUMMONER_TOTAL_MATCH_SEEMORE_FILTER_HEIGHT"
  >
    <v-btn                          
      :class="['ml-1 mr-1 filter-menu analysis-filter', button.activate ? 'filter-active' : ''] "      
      v-for="(button, i) in btnMenus"
      elevation="0"
      :color="button.activate ? 'subcontent' : 'subcontent'"             
      :key="i"           
      @click="selectAnalysisMenu(i)"   
    >
      <span> {{ button.name }} </span>
    </v-btn>    
  </v-sheet>

  <v-sheet class="contentss">
    
  </v-sheet>

</template>

<script>
import { computed, onMounted, ref } from 'vue'
import useSizeSetup from '../../tools/SizeSetup.vue'

export default {  
  props: {
    match: Object,
    computedEntries: Object
  },
  setup(props) {
    const { contentSize } = useSizeSetup()

    const BAR_SCALE = 50
    const datas = ref({})
    const winSortedParticipants = ref([])
    const championUrls = ref([])

    const btnMenus = ref([
      {
        name: '경기 분석',
        activate: true,  
      },
      {
        name: '골드 & 킬',
        activate: false,  
      },
      {
        name: '킬 맵',

        activate: false,  
      },
      {
        name: '타임라인',
        activate: false,  
      },
    ])

    function selectAnalysisMenu (btnIndex) {
      btnMenus.value.forEach(btn => btn.activate = false)
      btnMenus.value[btnIndex].activate = true
    }
    

    function createBarWidth (arr) {
      const max = Math.max(...arr)
      return arr.map(value => (BAR_SCALE / max * value).toFixed())        
    }

    function setMatchAttrs (attrs) {      
      attrs.forEach(attr => {
        const attrValue = getMatchAttr(attr)
        datas.value[`${attr}_width`] = createBarWidth(attrValue).map((width, i) => ({
          width,
          value: winSortedParticipants.value[i][attr],
          teamId: winSortedParticipants.value[i].teamId,
        }))
      })            
    }

    

    const getMatchAttr = key => props.match.participants.map(participant => participant[key])

    onMounted(() => {      
      const winTeamId = props.match.teams.find(team => team.teamId)
      const sort = winTeamId !== props.match.participants[0].teamId
      const urls = props.computedEntries.map(entry => entry.url)

      if(sort) {
        const [one, two] = [props.match.participants.slice(0, 5), props.match.participants.slice(5, 10)]
        const [url1, url2] = [urls.slice(0, 5), urls.slice(0, 5)]
        winSortedParticipants.value = [...two, ...one]
        championUrls.value = [...url2, url1]

      } else {
        winSortedParticipants.value = props.match.participants                
        championUrls.value = urls
      }

      setMatchAttrs(['kills', 'totalMinionsKilled', 'totalDamageDealtToChampions', 'totalDamageTaken', 'wardsPlaced', 'goldEarned'])
            
    })

    return {
      contentSize,

      btnMenus,
      selectAnalysisMenu,
      createBarWidth
    }
  } 
}
</script>

<style>
.filter-active {
  color: #5383e8 !important;
  font-weight: bold;
  border-bottom: 3px solid #5383e8;
}

.analysis-filter {
  border-radius: 0px !important;
}

.contentss {  
  margin-top: -9px;
}
</style>