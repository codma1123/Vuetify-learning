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
        {{ records.kdaMean }}:1
      </div>

      <div class="records-red-font">
        킬관여 {{ records.totalKillInvolvementArea }}%
      </div>      
    </div>

    <div class="ml-15">
      <div class="records-grey-font mb-1">
        플레이한 챔피언 (최근 {{ records.total }}게임)

        <div class="mt-3">
          <div v-for="(champion, i) in recentChampions" :key="i" class="d-flex align-center mb-1">
            <img :src="champion.url" alt="" class="recent_img">                  
            <span class="recent_champion__winRate ml-3" :style="champion.winRate.winRate >= 60 ? 'color : #E84057' : ''">
              {{ champion.winRate.winRate }}%
            </span>
            <span class="ml-1">
              ({{ champion.winRate.win }}승 {{ champion.winRate.lose }}패)
            </span>          
            <span class="ml-1" :style="[selectScoreFontStyle(champion.kda), {'font-weight': '600', 'font-size': '12px', 'opacity': '1'}]">
              {{ champion.kda }}:1 평점
            </span>
          </div>
        </div>
      </div>      
    </div>

    <div class="records-prefer-position mb-5">
      <div class="ml-6 records-grey-font text-center">선호 포지션 (랭크)</div>
      <div class="d-flex">
        <div v-for="i in 5" :key="i" class="ml-6 records-prefer-position__bar">
          <img :src="`../../public/icon-position-${line[i-1]}.svg`" class="records-prefer-position__img">  
        </div>
      </div>
      
          
      
    </div>
    
  </v-sheet>    
</template>

<script>
import { computed, onMounted } from 'vue'
import useSizeSetup from '@/tools/SizeSetup.vue'
import { mean } from 'mathjs'

export default {  
  setup() {  
    const { searchStore, contentSize, urlConfig, funcs } = useSizeSetup()  
    const line = ['top', 'jungle', 'mid', 'adc', 'support']  
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
      const kdaMean = getKda(assistMean, killMean, deathMean)

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

      const wins = getOwnerMatchesArray('win')           
      
      const winEntries = getOwnerMatchesArray('championName')?.reduce((acc, cur, index) => {        
        acc[cur] = acc[cur] || []
        acc[cur].push(wins[index])        
        return acc
      }, {})

      const chs = []

      Array(...championMap.keys()).forEach(name => {
        const matches = ownerMatches.value.filter(match => match.championName === name)
        const kdas = matches.map(match => {
          const { assists, kills ,deaths } = match
          return { assists, kills ,deaths }
        })
                
        chs.push(getKda(kdas.map(kda => kda.assists).addArray(), kdas.map(kda => kda.kills).addArray(), kdas.map(kda => kda.deaths).addArray()))
      })
            
      return Array(...championMap).map((obj, i) => ({
        name: obj[0], 
        count: obj[1], 
        url: createChampionIconUrl(obj[0]),
        winRate: createChampionWinRate(winEntries[obj[0]]),
        kda: chs[i]
      })).sort((a, b) => {
        if (a.count > b.count) return -1
        if (a.count < b.count) return 1
        return 0
      }).slice(0, 3)
    })

    
    // funcs
    const getOwnerMatchesArray = key => ownerMatches.value.map(match => match[key])
    const getMeanMatchesStat = arr => (arr.reduce((acc, cur) => acc + cur) / ownerMatches.value.length).toFixed(1)    
    const createChampionIconUrl = championName => `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/champion/${championName}.png`
    const createChampionWinRate = entry => {
      const resultMap = entry.reduce((acc, cur) => {
        acc.set(cur, (acc.get(cur) || 0) + 1)
        return acc
      }, new Map())

      const result = {
        win: 0,
        lose: 0,
        winRate: 0
      }
      
      Array([...resultMap]).forEach(win => {                
        win[0][0] ? result.win = win[0][1] : result.lose = win[0][1]
        result.winRate = Number(Math.ceil(result.win / (result.win + result.lose) * 100))
      })
      

      return result      
    }

    const selectScoreFontStyle = score => {
      if(score === 'Perfect') return {'color': '#eb663a'}

      const numScore = Number(score.split(':')[0])
      if(numScore < 3) return
      if(numScore < 4) return {'color': '#009f75'}
      if(numScore < 5) return {'color' : '#0094e3'}

      return {'color': '#eb663a'}
    }

    const createPreferPositionBar = height => ({
      'height': height,
      'width' : '15px'
    })

    const getKda = (assists, kill, death) => !death ? 'Perfect' : ((Number(assists) + Number(kill)) / Number(death)).toFixed(2)


    onMounted(() => {            

    })

    return {
      contentSize,
      line,

      records,
      recentChampions,
      createChampionWinRate,

      getOwnerMatchesArray,
      getMeanMatchesStat,
      createPreferPositionBar,
      getKda,
      ownerMatches,

      // computed styles
      dountChartStyle,
      winRateStyle,
      selectScoreFontStyle,


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

.recent_champion__winRate {
  font-weight: bold;    
  font-size: 12px;
}

.records-prefer-position {
  margin-left: 120px;
}

.records-prefer-position__bar {
  margin-top: 10px;  
  height: 70px;
  width: 17px;
  background-color: #424254;
}

.records-prefer-position__img {
  margin-top: 80px;
  height: 17px;
}



</style>

