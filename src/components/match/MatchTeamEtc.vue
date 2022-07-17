<template>  
  <v-sheet
    class="matches d-flex justify-space-between align-center"    
    color="subcontent"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"
    :height="contentSize.SUMMONER_TOTAL_MATCH_SEEMORE_FILTER_HEIGHT"
  >
    <v-btn                          
      :class="['ml-1 mr-1 filter-menu analysis-filter', button.activate ? 'filter-active' : ''] "      
      v-for="(button, i) in btnMenus"
      color="subcontent"
      elevation="0"      
      :key="i"           
      @click="selectAnalysisMenu(i)"   
    >
      <span> {{ button.name }} </span>
    </v-btn>    
  </v-sheet>

  <template v-if="!searchStore.timeLineLoaded">

    <v-sheet color="#282830" class="d-flex etc-teams">
      <div class="etc-team">
        <div class="ml-2">승리팀</div>
        <div class="d-flex">
          <v-card 
            class="d-flex justify-center align-center ml-2 mt-2 etc-teams-card"
            v-for="(entry, i) in sortedEntries[0]"
            :color="colors[i]"
            width="60"
            height="60"
            @click="filterEntries(i)"
          >
            <img :src="entry.championIcon" class="etc-team-icons" />
          </v-card>
        </div>                          
      </div>

      <div class="etc-team ml-15">
        <div class="ml-2">패배팀</div>
        <div class="d-flex">
          <v-card 
            class="d-flex justify-center align-center ml-2 mt-2 etc-teams-card"
            v-for="(entry, i) in sortedEntries[1]"
            :color="colors[i + 5]"
            width="60"
            height="60"
            @click="filterEntries(i + 5)"
          >
            <img :src="entry.championIcon" class="etc-team-icons" />
          </v-card>
        </div>                          
      </div>
    </v-sheet>


    <champion-golds v-if="btnMenus[0].activate" :match="match" />
    <champion-exps v-if="btnMenus[1].activate" :match="match" />
    <champion-cs v-if="btnMenus[2].activate" :match="match" />
  </template>

</template>

<script>
import useSizeSetup from '@/tools/SizeSetup.vue'
import { onMounted, ref } from 'vue'

import ChampionGolds from '@/components/match/charts/ChampionGolds.vue'
import ChampionExps from '@/components/match/charts/ChampionExps.vue'
import ChampionCs from '@/components/match/charts/ChampionCs.vue'

  export default {
    components: {
      ChampionGolds,
      ChampionExps,
      ChampionCs,
    },
    props: {
      match: Object
    },    
    setup(props) {
      const { searchStore, contentSize, funcs, urlConfig } = useSizeSetup()

      const sortedEntries = ref([])
      const entriesArray = ref([])
      const filtered = ref(Array.from({length: 10}).map(_ => false))
      const chartDatas = ref([])
      const colors = ref([])

      const btnMenus = ref([
        {
          name: '챔피언별 골드 획득',
          activate: true,  
        },
        {
          name: '챔피언별 경험치 획득',
          activate: false,  
        },
        {
          name: '챔피언별 CS',
          activate: false,  
        },        
      ])

      function selectAnalysisMenu (btnIndex) {
        btnMenus.value.forEach(btn => btn.activate = false)
        btnMenus.value[btnIndex].activate = true
      }

      function filterEntries (k) {
        filtered.value[k] = !filtered.value[k]
        const temp = []
        filtered.value.forEach((filt, i) => {
          if(filt) temp.push(entriesArray.value[i])
        })
        chartDatas.value = temp
      }

      onMounted(async () => {
        const res = await searchStore.searchContentTimeLine(props.match)        
        colors.value = Array.from({length: 10}).map( _ => funcs.createRandomColor())      
        const entries =  res.killMap.map(entry => ({
          summonerName: entry.summonerName,
          championName: entry.championName,
          participantId: entry.participantId,
          championIcon: funcs.createChampionIconUrl(urlConfig.imgUrl, searchStore.iconCdnVersion, entry.championName)
        }))

        sortedEntries.value = [entries.slice(0, 5), entries.slice(5, 10)]        
        const temp = Array.from({length: 10}).map( (_, i) => ({ datas: [], color: colors.value[i] }))      
        res.frames.map(frame => frame.participantFrames)
                    .forEach(participantFrames => Object.values(participantFrames).forEach(participant => 
                      temp[Number(participant.participantId - 1)].datas.push(participant.totalGold)           
                    ))
        entriesArray.value = !props.match.participants[0].win ? [...temp.slice(5, 10), ...temp.slice(0, 5)] : temp              
      })

      return {
        btnMenus,
        contentSize,
        searchStore,

        selectAnalysisMenu,

        sortedEntries,
        filterEntries,
        colors
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

.etc-teams {
  margin-top: -10px;
}

.etc-team {
  width: 50%;
  padding-left: 10px;
  margin-top: 10px;
  color: rgb(158, 158, 177);
  font-size: 12px;  
}

.etc-team-icons {
  width: 45px;
  height: 45px;
}

.etc-teams-card:hover {
  cursor: pointer;
}
</style>