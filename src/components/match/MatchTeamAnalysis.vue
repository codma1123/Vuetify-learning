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
      elevation="0"
      :color="button.activate ? 'subcontent' : 'subcontent'"             
      :key="i"           
      @click="selectAnalysisMenu(i)"   
    >
      <span> {{ button.name }} </span>
    </v-btn>    
  </v-sheet>

  <v-sheet class="contentss" color="#282830" v-if="btnMenus[0].activate">
    <div class="contentss-top-label text-center d-flex justify-center">
      <span class="win-team-dot"> </span>
      <span class="mr-4 mb-2"> 승리팀 </span>
      <span class="lose-team-dot"></span>
      <span class="mb-2"> 패배팀 </span>
    </div>
    
    <!-- teamStatDetail -->
    <div class="d-flex justify-space-between align-center ml-8 mr-8">  
      <div>
        <div class="text-center stat-label"> 챔피언 처치 </div>
        <div class="d-flex justify-space-between align-center">          
          <div>

            <div v-for="(kill, i) in values.kills_width.slice(0, 5)" :key="i" class="d-flex">
              <img :src="championUrls[i]" class="champion-icon" /> 
              <div class="bar-base">
                <div class="d-flex justify-end mr-1">
                  <div :style="getBarValueStyle"> {{kill.value}} </div>
                </div>
                <div :style="getBarStyle(kill.width, 'win')"></div>      
              </div>
            </div>
          </div>

          <match-team-analysis-dount :datas="getTotalStat(values.kills_width)"/>

          <div class="ml-5">
            <div v-for="(kill, i) in values.kills_width.slice(5, 10)" :key="i" class="d-flex">
              <img :src="championUrls[i + 5]" class="champion-icon" /> 
              <div class="bar-base">
                <div class="d-flex justify-end mr-1">
                  <div :style="getBarValueStyle"> {{kill.value}} </div>
                </div>
                <div :style="getBarStyle(kill.width, 'lose')"></div>      
              </div>
            </div>
          </div>

        </div>
      </div>  

      <div>
        <div class="text-center stat-label"> 골드 획득량 </div>
        <div class="d-flex justify-space-between align-center">       

          <div>
            <div v-for="(goldEarned, i) in values.goldEarned_width.slice(0, 5)" :key="i" class="d-flex">
              <img :src="championUrls[i]" class="champion-icon" /> 
              <div class="bar-base">
                <div class="d-flex justify-end mr-1">
                  <div :style="getBarValueStyle"> {{ goldEarned.value.toLocaleString() }} </div>
                </div>
                <div :style="getBarStyle(goldEarned.width, 'win')"></div>      
              </div>
            </div>
          </div>

          <match-team-analysis-dount :datas="getTotalStat(values.goldEarned_width)"/>

          <div class="ml-5">
            <div v-for="(goldEarned, i) in values.goldEarned_width.slice(5, 10)" :key="i" class="d-flex">
              <img :src="championUrls[i + 5]" class="champion-icon" /> 
              <div class="bar-base">
                <div class="d-flex justify-end mr-1">
                  <div :style="getBarValueStyle"> {{ goldEarned.value.toLocaleString() }} </div>
                </div>
                <div :style="getBarStyle(goldEarned.width, 'lose')"></div>      
              </div>
            </div>
          </div>

        </div>
      </div>  
    </div>

    <div class="d-flex justify-space-between align-center ml-8 mr-8 mt-8">  
      <div>
        <div class="text-center stat-label"> 챔피언에게 가한 피해량 </div>
        <div class="d-flex justify-space-between align-center">          
          <div>

            <div v-for="(totalDamageDealtToChampions, i) in values.totalDamageDealtToChampions_width.slice(0, 5)" :key="i" class="d-flex">
              <img :src="championUrls[i]" class="champion-icon" /> 
              <div class="bar-base">
                <div class="d-flex justify-end mr-1">
                  <div :style="getBarValueStyle"> {{totalDamageDealtToChampions.value.toLocaleString()}} </div>
                </div>
                <div :style="getBarStyle(totalDamageDealtToChampions.width, 'win')"></div>      
              </div>
            </div>
          </div>

          <match-team-analysis-dount :datas="getTotalStat(values.totalDamageDealtToChampions_width)"/>

          <div class="ml-5">
            <div v-for="(totalDamageDealtToChampions, i) in values.totalDamageDealtToChampions_width.slice(5, 10)" :key="i" class="d-flex">
              <img :src="championUrls[i + 5]" class="champion-icon" /> 
              <div class="bar-base">
                <div class="d-flex justify-end mr-1">
                  <div :style="getBarValueStyle"> {{totalDamageDealtToChampions.value.toLocaleString()}} </div>
                </div>
                <div :style="getBarStyle(totalDamageDealtToChampions.width, 'lose')"></div>      
              </div>
            </div>
          </div>

        </div>
      </div>  

      <div>
        <div class="text-center stat-label"> 와드 설치 </div>
        <div class="d-flex justify-space-between align-center">       

          <div>
            <div v-for="(wardsPlaced, i) in values.wardsPlaced_width.slice(0, 5)" :key="i" class="d-flex">
              <img :src="championUrls[i]" class="champion-icon" /> 
              <div class="bar-base">
                <div class="d-flex justify-end mr-1">
                  <div :style="getBarValueStyle"> {{ wardsPlaced.value.toLocaleString() }} </div>
                </div>
                <div :style="getBarStyle(wardsPlaced.width, 'win')"></div>      
              </div>
            </div>
          </div>

          <match-team-analysis-dount :datas="getTotalStat(values.wardsPlaced_width)"/>

          <div class="ml-5">
            <div v-for="(wardsPlaced, i) in values.wardsPlaced_width.slice(5, 10)" :key="i" class="d-flex">
              <img :src="championUrls[i + 5]" class="champion-icon" /> 
              <div class="bar-base">
                <div class="d-flex justify-end mr-1">
                  <div :style="getBarValueStyle"> {{ wardsPlaced.value.toLocaleString() }} </div>
                </div>
                <div :style="getBarStyle(wardsPlaced.width, 'lose')"></div>      
              </div>
            </div>
          </div>

        </div>
      </div>  
    </div>

    <div class="d-flex justify-space-between align-center ma-8">  
      <div>
        <div class="text-center stat-label"> 받은 피해량 </div>
        <div class="d-flex justify-space-between align-center">          
          <div>

            <div v-for="(totalDamageTaken, i) in values.totalDamageTaken_width.slice(0, 5)" :key="i" class="d-flex">
              <img :src="championUrls[i]" class="champion-icon" /> 
              <div class="bar-base">
                <div class="d-flex justify-end mr-1">
                  <div :style="getBarValueStyle"> {{totalDamageTaken.value.toLocaleString()}} </div>
                </div>
                <div :style="getBarStyle(totalDamageTaken.width, 'win')"></div>      
              </div>
            </div>
          </div>

          <match-team-analysis-dount :datas="getTotalStat(values.totalDamageTaken_width)"/>

          <div class="ml-5">
            <div v-for="(totalDamageTaken, i) in values.totalDamageTaken_width.slice(5, 10)" :key="i" class="d-flex">
              <img :src="championUrls[i + 5]" class="champion-icon" /> 
              <div class="bar-base">
                <div class="d-flex justify-end mr-1">
                  <div :style="getBarValueStyle"> {{totalDamageTaken.value.toLocaleString()}} </div>
                </div>
                <div :style="getBarStyle(totalDamageTaken.width, 'lose')"></div>      
              </div>
            </div>
          </div>

        </div>
      </div>  

      <div>
        <div class="text-center stat-label"> CS </div>
        <div class="d-flex justify-space-between align-center">       

          <div>
            <div v-for="(totalMinionsKilled, i) in values.totalMinionsKilled_width.slice(0, 5)" :key="i" class="d-flex">
              <img :src="championUrls[i]" class="champion-icon" /> 
              <div class="bar-base">
                <div class="d-flex justify-end mr-1">
                  <div :style="getBarValueStyle"> {{ totalMinionsKilled.value.toLocaleString() }} </div>
                </div>
                <div :style="getBarStyle(totalMinionsKilled.width, 'win')"></div>      
              </div>
            </div>
          </div>

          <match-team-analysis-dount :datas="getTotalStat(values.totalMinionsKilled_width)"/>

          <div class="ml-5">
            <div v-for="(totalMinionsKilled, i) in values.totalMinionsKilled_width.slice(5, 10)" :key="i" class="d-flex">
              <img :src="championUrls[i + 5]" class="champion-icon" /> 
              <div class="bar-base">
                <div class="d-flex justify-end mr-1">
                  <div :style="getBarValueStyle"> {{ totalMinionsKilled.value.toLocaleString() }} </div>
                </div>
                <div :style="getBarStyle(totalMinionsKilled.width, 'lose')"></div>      
              </div>
            </div>
          </div>

        </div>
      </div>  
    </div>
  </v-sheet>

  <v-sheet color="#282830" v-if="selectedMenu === '골드 & 킬'">
    <match-team-analysis-gold-kill :match="match"/>
  </v-sheet>

  <v-sheet color="#282830" v-if="selectedMenu === '킬 맵'">
    <match-team-analysis-kill-map :match="match"/>
  </v-sheet>

</template>

<script>
import { computed, onMounted, ref } from 'vue'
import useSizeSetup from '../../tools/SizeSetup.vue'
import MatchTeamAnalysisDount from '@/components/match/MatchTeamAnalysisDount.vue'
import MatchTeamAnalysisGoldKill from '@/components/match/MatchTeamAnalysisGoldkill.vue'
import MatchTeamAnalysisKillMap from '@/components/match/MatchTeamAnalysisKillMap.vue'
import { useSearchStore } from '../../store'

export default {  
  props: {
    match: Object,
    computedEntries: Object
  },
  components: {
    MatchTeamAnalysisDount,
    MatchTeamAnalysisGoldKill,
    MatchTeamAnalysisKillMap
  },
  setup(props) {
    const { contentSize, funcs, searchStore } = useSizeSetup()

    const BAR_SCALE = 85

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

    const selectedMenu = computed(() => btnMenus.value.find(menu => menu.activate).name)

    function selectAnalysisMenu (btnIndex) {
      btnMenus.value.forEach(btn => btn.activate = false)
      btnMenus.value[btnIndex].activate = true
    }
    

    function createBarWidth (arr) {
      const max = Math.max(...arr)
      return arr.map(value => (BAR_SCALE / max * value).toFixed())        
    }

    function setMatchAttrs (attrs, sort) {    
      let datas = {}  
      attrs.forEach(attr => {             
        datas[`${attr}_width`] = createBarWidth(getMatchAttr(attr, sort)).map((width, i) => ({
          width,
          value: winSortedParticipants.value[i][attr],
        }))
      })            

      return datas
    }

    function getTotalStat (values) {
      Array.prototype.addArray = function () {
        return this.reduce((acc, cur) => acc + cur)
      }

      return {
        win: values.slice(0, 5).map(values => values.value).addArray(),
        lose: values.slice(5, 10).map(values => values.value).addArray()
      }
    }
    
    const getBarStyle = (width, win) => ({      
      'width': width + 'px',
      'height': '15px',
      'background-color': win === 'win' ? '#5383e8' : '#e84057',            
    })

    const getBarValueStyle = {    
      'position': 'absolute',
      'font-size': '12px',      
      'color': 'white'
    }

    const values = computed(() => {
      const sort = !props.match.participants[0].win
      const urls = props.computedEntries.map(entry => entry.url)
      
      if(sort) {
        winSortedParticipants.value = funcs.swapArray10(props.match.participants)
        championUrls.value = funcs.swapArray10(urls)              
        return setMatchAttrs(['kills', 'totalMinionsKilled', 'totalDamageDealtToChampions', 'totalDamageTaken', 'wardsPlaced', 'goldEarned'], 1)
      
      } else {
        winSortedParticipants.value = props.match.participants                
        championUrls.value = urls
        return setMatchAttrs(['kills', 'totalMinionsKilled', 'totalDamageDealtToChampions', 'totalDamageTaken', 'wardsPlaced', 'goldEarned'], 0)
      }
    })

    const getMatchAttr = (key, sort) => sort ? winSortedParticipants.value.map((participant => participant[key])) : props.match.participants.map(participant => participant[key])
    
    

    onMounted(async () => {      
      props.match.gameMode === 'ARAM' ? btnMenus.value.splice(1, 1) : null    
      await searchStore.searchContentTimeLine(props.match)
      
    })

    return {
      contentSize,

      btnMenus,
      selectAnalysisMenu,
      createBarWidth,

      values,
      getBarStyle,
      getBarValueStyle,
      championUrls,
      getTotalStat,

      selectedMenu
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
  margin-top: -11px;
  height: 550px;
}

.win-team-dot {
  margin-top: 15px;
  margin-right: 7px;
  height: 8px;
  width: 8px;
  background-color: #5383e8;
  border-radius: 50%
}

.lose-team-dot {
  margin-top: 15px;
  margin-right: 7px;
  height: 8px;
  width: 8px;
  background-color: #e84057;
  border-radius: 50%
}

.contentss-top-label {
  height: 30px;
  text-align: center;
  line-height: 40px;
  font-size: 12px;
  opacity: .7;
  font-weight: 100;
}

.stat-label {
  color: white;
  font-size: 13px;
}

.champion-icon {
  height: 15px;
  margin-top: 10px;
  margin-right: 5px;
}

.bar-base {
  width: 85px;
  height: 15px;
  background-color: #424254;
  margin-top: 10px;
}
</style>