<template>
  <v-sheet 
    class="recent-matches d-flex align-center"
    color="subcontent"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"    
    :height="contentSize.SUMMONER_TOTAL_MATCHES_RECENT_HEIGHT"                
    elevation="0"
  >
    <div class="records records-grey-font ">
      <div class="ml-2">{{ records.total }}전 {{ records.win }}승 {{ records.lose }}패</div>
      <div class="dount-chart" :style="dountChartStyle">      
        <div class="dount-chart-hole" :style="winRateStyle">
          {{ records.winRate }}%
        </div>
      </div>    
    </div>

    <div class="stats records-grey-font ml-7 mt-2">
      <div>
        {{ records.killMean }} / 
        <span class="records-red-font"> {{ records.deathMean }} </span> / 
        {{ records.assistMean }}
      </div>

      <div class="stats__kdaMean">
        {{ records.kdaMean }}
      </div>

      <div class="records-red-font">
        킬관여 {{ records.totalKillInvolvementArea }}%
      </div>      
    </div>

    <div class="ml-15">
      <div class="records-grey-font">
        플레이한 챔피언 (최근 {{ records.total}}게임)

        <div v-for="(champion, i) in recentChampions" :key="i" class="d-flex align-center mb-1">
          <img :src="champion.url" alt="" class="recent_img">        
          <span class="recent_champion__name ml-2">
            {{ champion.name }}
          </span>
        </div>
      </div>      
    </div>
    
  </v-sheet>    
</template>

<script>
import { computed, onMounted } from 'vue'
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {  
  setup() {  
    const { searchStore, contentSize, urlConfig, funcs } = useSizeSetup()    
    const records = computed(() => {

      Array.prototype.addArray = function () {
        return this.reduce((acc, cur) => acc + cur)
      }
      
      const total = ownerMatches.value.length      
      const winMatch = ownerMatches.value.filter(match => match.win === true)
      const loseMatch = ownerMatches.value.filter(match => match.win === false)    
      
      const killMean = getMeanMatchesStat(getOwnerMatchesArray('kills'))
      const deathMean = getMeanMatchesStat(getOwnerMatchesArray('deaths'))
      const assistMean = getMeanMatchesStat(getOwnerMatchesArray('assists')) 
      const kdaMean = ((Number(assistMean) + Number(killMean)) / Number(deathMean)).toFixed(2) + ':1'

      const ownerKills = getOwnerMatchesArray('kills').addArray()     
      const ownerAssists = getOwnerMatchesArray('assists').addArray()
      const totalKills = matchTotalKills.value.addArray()
      const totalKillInvolvementArea = Math.ceil((ownerKills + ownerAssists) / Number(totalKills) * 100)

      return {
        total,
        win: winMatch.length,
        lose: loseMatch.length,
        winRate: Math.ceil( winMatch.length / total * 100),
        killMean,
        deathMean,
        assistMean,
        totalKillInvolvementArea,
        kdaMean
      }
    })

    const dountChartStyle = computed(() => {      
      const { lose, total } = records.value      
      const loseDeg = 360 / total * lose
        
      return {        
        'background' : `conic-gradient(#5383e8 0deg ${loseDeg}deg, #e84057 ${loseDeg}deg 360deg )`
      }
    })
    
    const winRateStyle = computed(() => records.value.winRate >= 50 ? {'color': '#e84057'} : {'color' : '#5383e8'})      
    const ownerMatches = computed(() => searchStore.matches.map(match => match.owner))
    const matchTotalKills = computed(() => searchStore.matches.map(match => match.totalKills))
    const recentChampions = computed(() => {
      const championMap = getOwnerMatchesArray('championName')?.reduce((acc, cur) => {
        acc.set(cur, (acc.get(cur) || 0) + 1)
        return acc
      }, new Map())

      // [{name: 챔피언이름, count: 사용횟수}, {} ...]
      return Array(...championMap).map(obj => ({name: obj[0], count: obj[1], url: createChampionIconUrl(obj[0])})).sort((a, b) => {
        if (a.count > b.count) return -1
        if (a.count < b.count) return 1
        return 0
      }).slice(0, 3)
    })


    const getOwnerMatchesArray = key => ownerMatches.value.map(match => match[key])
    const getMeanMatchesStat = arr => (arr.reduce((acc, cur) => acc + cur) / ownerMatches.value.length).toFixed(1)

    const ownerChampionIconUrl = computed(() => `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/champion/${props.match.owner.championName}.png`)
    const createChampionIconUrl = championName => `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/champion/${championName}.png`

    onMounted(() => {            

    })

    return {
      contentSize,

      records,
      recentChampions,

      getOwnerMatchesArray,
      getMeanMatchesStat,
      ownerMatches,

      // computed styles
      dountChartStyle,
      winRateStyle


    }
    
  }
}
</script>

<style>
.records-grey-font {
  color: #9E9EB1;
  font-weight: 400;
  font-size: 12px;   
}

.records {  
  justify-content: center;
  margin-left: 30px;
}

.recent-matches {
  margin-top: 3px;
  margin-bottom: 7px;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
}

.dount-chart {
  margin-top: 10px;
  width: 90px; height: 90px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dount-chart-hole {
  width: 60px; 
  height: 60px;
  border-radius: 50%;
  font-weight: bold;
  background: #31313C;
  display: flex;
  justify-content: center;
  align-items: center;
}

.records-red-font {
  color: #E84057;
  font-weight: bold;
}

.stats__kdaMean {
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.recent_img {
  width: 28px;
  border-radius: 50%;
}

.recent_champion__name {
  text-align: center;
}



</style>

