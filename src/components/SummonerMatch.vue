<template>
  <v-sheet 
    class="matches d-flex"
    :color="match.owner.win ? '#28344E' : '#59343B'"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"    
    :height="contentSize.SUMMONER_TOTAL_MATCH_HEIGHT"                
    elevation="0"
  >
    <!-- MatchWinResultArea -->
    <div :style="winLabel.labelStyle"></div>  
      
    <div class="gameType mt-2">
      <div :style="[winLabel.fontStyle, overrideFontStyle]" class="ml-2"> {{ gameMode }} </div>
      <div :style="defaultFontStyle">
        <div> {{ timesAgo }}</div>
        <v-divider class="mt-2 mb-2" width="50"></v-divider>
        <div class="font-weight-bold"> {{ match.owner.win ? '승리' : '패배' }}</div>
        <div> {{ duration[0] }}분 {{ duration[1] }}초 </div>        
      </div>
    </div>

    <div class="icons mt-2">  
      <div class="champion-kda">
        <!-- ChampionIconArea-->
        <v-avatar 
          rounded="md" 
          class="owner-champion-icon"
          :size="contentSize.CHAMPION_ICON_SIZE"
        >
          <v-img :src="ownerChampionIconUrl"></v-img>            
          <v-avatar class="level">
            {{ match.owner.champLevel }}
          </v-avatar>
        </v-avatar>  
        

        <!-- SpellArea -->
        <div style="'display': 'flex'" class="ml-1">
          <v-img            
            v-for="(url, i) in ownerSpellIconUrls"
            :key="i"
            class="full-item"
            rounded="md"
            :min-height="contentSize.SPELL_ICON_SIZE"
            :min-width="contentSize.SPELL_ICON_SIZE"
            :src="url"
          >
          </v-img>
        </div>

         <!-- RuneArea -->
        <div style="'display': 'flex'">
          <v-avatar size="25" color="#000000" class="runes">
            <v-img            
              class="full-item main-rune"
              rounded="md"              
              :src="runeIconUrls[0]"
            ></v-img>            
          </v-avatar>          
          <v-img            
            class="full-item sub-rune"
            rounded="md"            
            :src="runeIconUrls[1]"
          >
          </v-img>
        </div>

        <!-- KDAARea -->
        <div class="mt-1 ml-3 kda">
          <div class="font-weight-bold text-h7 text-white">
            {{ match.owner.kills }} / 
            <span class="text-red"> {{ match.owner.deaths }}  </span>
            / {{ match.owner.assists }}
          </div>
          <div :style="[defaultFontStyle, {'margin-left': '.5rem;'} ]">
            {{ score }} 평점
          </div>
        </div>             

        <v-divider vertical class="ml-15" :style="winLabel.verticalStyle"></v-divider>     

        <!-- KillInvolvementArea -->
        <div class="ml-1">
          <div class="kill-involvementArea"> 킬관여 {{ killInvolvementArea }} % </div>
          <div class="owner-wards"> 제어 와드 {{ match.owner.detectorWardsPlaced }} </div>
          <div class="owner-cs"> CS {{ match.owner.totalMinionsKilled }} ({{ csPerMin }})</div>
          <div class="average-tier"> {{ averageTier}} </div>
        </div>

      </div>
        

      <!-- ItemsArea -->
      <div class="owner-items-icons mt-2 ml-2">
        <div 
          v-for="(itemUrl, i) in ownerItemIconUrls"
          :key="i"
        >
          <v-img
            v-if="match.owner.itemUrls[i]"
            class="full-item"
            rounded="md"
            :aspect-ratio="1"
            :min-height="contentSize.ITEM_ICON_SIZE"
            :min-width="contentSize.ITEM_ICON_SIZE "
            :src="itemUrl"
          >
          </v-img>
          <div v-else class="empty-item" :style="winLabel.emptyItemStyle"></div>
        </div>     

        <span v-if="multikill" class="multikill">
          {{ multikill }}
        </span>        
      </div>
    </div>

    <div class="entries d-flex" >
      <div class="match-entries">
        <div 
          class="match-entry"
           v-for="(entry, i) in matchEntries.slice(0, 5)"
          :key="i"
          @click="pushEntry(entry.name)"
        >
          <v-avatar 
            rounded="md" 
            :size="contentSize.CHAMPION_ENTRIES_ICON_SIZE"
          >
            <v-img :src="entry.url"></v-img>                        
          </v-avatar>
          <span class="match-entry-name" :style="myNameBoldStyle(entry.name)">
            {{ entry.name }}
          </span>
        </div>
      </div>

      <div class="match-entries">
        <div 
          class="match-entry"
           v-for="(entry, i) in matchEntries.slice(5, 10)"
          :key="i"
          @click="pushEntry(entry.name)"
        >
          <v-avatar 
            rounded="md" 
            :size="contentSize.CHAMPION_ENTRIES_ICON_SIZE"
          >
            <v-img :src="entry.url"></v-img>                        
          </v-avatar>
          <span class="match-entry-name" :style="myNameBoldStyle(entry.name)">
            {{ entry.name }}
          </span>
        </div>
      </div>
    </div>

    <div :style="winLabel.foldStyle" :class="[foldClass, match.owner.win ? 'fold-win' : 'fold-loss']">
      <v-icon :color="match.owner.win ? '#5383e8' : '#d94055'">
         mdi-chevron-down
      </v-icon>
    </div>  

  </v-sheet>  
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import useSizeSetup from '@/tools/SizeSetup.vue'
import runeJSON from '@/assets/runesReforged.json'
import championJSON from '@/assets/championInfo.json'

import KillChip from '../components/KillChip.vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  props: {
    match: Object
  },
  components: {
    KillChip
  },
  setup(props) {

    const route = useRoute()
    const router = useRouter()

    const { contentSize, funcs, urlConfig, searchStore } = useSizeSetup()    
    const gameModeMap = new Map([['CLASSIC', '일반'], ['ARAM', '무작위 총력전']])    
    const spellEnum = {
      '1': 'SummonerBoost',
      '3': 'SummonerExhaust',
      '4': 'SummonerFlash',
      '6': 'SummonerHaste',
      '7': 'SummonerHeal',
      '11': 'SummonerSmite',
      '12': 'SummonerTeleport',
      '14': 'SummonerDot',
      '32': 'SummonerSnowURFSnowball_Mark'

    }
    const winLabel = computed(() => props.match.owner.win ? 
      {
        labelStyle: {
          'background-color': '#5383E8',
          'min-width': '.45rem'
        },
        fontStyle: {
          'color': '#5383E8',                
        },
        emptyItemStyle: {
          'background-color': '#2F436E'
        },
        verticalStyle: {
          'color': '#4447a3',          
        },
        foldStyle: {
          'background-color': '#2f436e',          
        }
      } :
      {
        labelStyle: {
          'background-color': '#E84057',
          'min-width': '.45rem'
        },
        fontStyle: {
          'color': '#E83D46'
        },
        emptyItemStyle: {
          'background-color': '#703C47'
        },
        verticalStyle: {
          'color': '#bc2b3e',                            
        },
        foldStyle: {                              
          'background-color': '#703c47',          
        }
      }      
    )

    const overrideFontStyle = {
      'font-weight': 'bold',
      'font-size': '14px',
    }

    const defaultFontStyle = {
      'font-size': '12px',
      'color': '#9E9EB1',
      'margin-left': '.6rem'
    }

    const foldClass = 'ml-7 fold text-center justify-center d-flex align-content-end flex-wrap'

    function myNameBoldStyle(name) {
      if (name === route.params.name) return {'color': 'white'}
    }
    
    const gameMode = computed(() => gameModeMap.get(props.match.gameMode))

    const duration = computed(() => funcs.convertHMS(props.match.gameDuration).split(':').slice(1))

    const timesAgo = computed(() => {
      const v = funcs.timeForToday(props.match.gameEndTimestamp)
      switch (v) {
        case '1시간 전':
          return '한 시간 전'
        case '1 일 전':
          return '하루 전'
         default:
          return v           
      }      
    })

    const multikill = computed(() => {      
      const { pentaKills, quadraKills, tripleKills, doubleKills } = props.match.owner
      if(pentaKills) return '펜타킬'
      if(quadraKills) return '쿼드라킬'
      if(tripleKills) return '트리플킬'
      if(doubleKills) return '더블킬'

      return 0
    })

    /* 
     각 이미지들은 다른 컴포넌트에서도 사용할 수 있을거같으므로,
     추후 STORE로 이전할 수 있음.
    */ 

    const ownerChampionIconUrl = computed(() => 
      `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/champion/${props.match.owner.championName}.png`      
    )

    const ownerItemIconUrls = computed(() =>     
      props.match.owner.itemUrls.map(item => `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/item/${item}.png`)        
    )

    const ownerSpellIconUrls = computed(() => ([
       `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/spell/${spellEnum[props.match.owner.summoner1Id + '']}.png`,
      `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/spell/${spellEnum[props.match.owner.summoner2Id + '']}.png`
    ]))

    const runeIconUrls = computed(() => {
      const runeId = props.match.owner.perks.styles[0].selections[0].perk
      const mainRuneTypeId = props.match.owner.perks.styles[0].style

      const mainRuneObj = runeJSON.find(mainRune => mainRune.id === mainRuneTypeId)
      const runeObj = mainRuneObj?.slots[0].runes.find(rune => rune.id === runeId)      

      return [
        `${urlConfig.imgUrl}/img/${runeObj.icon}`,
        `${urlConfig.imgUrl}/img/${mainRuneObj.icon}`
      ]
    })
    
    const score = computed(() => {
      const owner = props.match.owner
      if (owner.deaths === 0) return 'Perfect'
      return ((owner.kills + owner.assists) / owner.deaths).toFixed(2) + ':1'
    })

    const killInvolvementArea = computed(() => {
      const involvementarea = props.match.owner.kills + props.match.owner.assists      
      if(!involvementarea) return 0
      return Math.ceil(involvementarea / props.match.totalKills * 100)
    })

    const csPerMin = computed(() => parseFloat((props.match.owner.totalMinionsKilled / Number(duration.value[0])).toFixed(1)))

    const averageTier = computed(() => {})

    
    const matchEntries = computed(() => {
      const championData = Object.values(championJSON.data)            
      const ids = props.match.participants.map(participants => participants.championId)      
      const results = ids.map(id => championData.find(champ => champ.key == id)).map(result => result.image.full)
      const name = props.match.participants.map(participants => participants.summonerName)
      
      return results.map((result, i) => ({
        name: name[i],
        url: `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/champion/${result}`,
      }))    
    })

    function pushEntry(payload) {
      router.push(`/summoner/${payload}`)
      searchStore.searchContent(payload)
    }
          
    onMounted(() => {})

    return {
      contentSize,     
       
      // css style obj
      winLabel,
      overrideFontStyle,
      defaultFontStyle,
      foldClass,

      // computed values
      gameMode,
      duration,
      timesAgo,
      score,      
      // computed values - iconUrls
      ownerChampionIconUrl,
      ownerItemIconUrls,
      ownerSpellIconUrls,
      runeIconUrls,

      multikill,
      killInvolvementArea,
      csPerMin,
      averageTier,
      matchEntries,



      pushEntry,
      myNameBoldStyle
    }
  }
}
</script>

<style>
.matches {
  border-radius: 5px;
  margin-bottom: 7px;
  overflow: hidden;  
}

.gameType {
  min-width: 130px;
}

.icons {
  min-width: 260px;
}

.level {
  position: absolute;
  max-width: 22px;
  max-height: 22px;
  color: white;
  right: 4%;
  bottom: 8%;
  font-size: 12px;
  font-weight: 400;
  background-color: #202D37;
  opacity: 1;
}

.score {
  margin-top: 2px;
  font-size: .8rem;
  color:#28344E;
  
}

.owner-items-icons {
  display: flex;
}

.champion-kda {
  display: flex;
  min-width: 440px;  
}

.owner-champion-icon {
  cursor: pointer;
}

.empty-item {
  min-width: 22.5px;
  min-height: 22.5px;
  border-radius: 5px;
  margin-left: 2px;
  margin-top: 3.3px;
}

.full-item {
  border-radius: 5px;
  margin-left: 2px;
  margin-top: 3px;
}

.runes {
  margin-top: 3px;
}

.main-rune {
  margin-top: 0px;
}

.sub-rune {
  margin-top: 0px;  
}

.kda {
  min-width: 85px;
  max-width: 85px;
}


.multikill {
  color: white !important;
  font-size: 13px;
  background-color: #E84057;    
  padding-left: 7px;
  padding-right: 7px;
  padding-top: 2px;
  margin-left: 10px;
  margin-top: 4px;  
  height: 22px;
  
  border-radius: 15px;
}

.kill-involvementArea {
  color: #E84057;
  font-size: 13px;
  font-weight: bold;
}

.owner-wards {  
  font-size: 13px;
  color: #9E9EB1;
  line-height: 70%;
}

.owner-cs {
  font-size: 13px;
  color: #9E9EB1;
}

.team {
  font-size: 13px;
  color: #9E9EB1;
  max-width: 100px;
}

.match-entries {
  font-size: 13px;
  color: #9E9EB1;
  max-width: 100px;  
}

.match-entry {
  font-size: 13px;
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;  
}

.match-entry-name:hover {
  text-decoration: underline !important;
}

.fold {
  min-width: 40px;
  cursor: pointer;
}


.fold-loss:hover {
  background-color: #59343B !important;
}

.fold-win:hover {
  background-color: #28344E !important;
}


</style>