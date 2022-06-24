<template>
  <v-sheet 
    class="matches d-flex"
    :color="match.win ? '#28344E' : '#59343B'"
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
        <div class="font-weight-bold"> {{ match.win ? '승리' : '패배' }}</div>
        <div> {{ duration }} </div>        
      </div>
    </div>

    <div class="mt-2">  
      <div class="champion-kda">
        <!-- ChampionIconArea-->
        <v-avatar 
          rounded="md" 
          :size="contentSize.CHAMPION_ICON_SIZE"
        >
          <v-img :src="ownerChampionIconUrl"></v-img>            
          <v-avatar class="level">
            {{ match.owner.champLevel }}
          </v-avatar>
        </v-avatar>  
        
        <v-img       
          class="full-item"
          rounded="md"
          :min-height="contentSize.ITEM_ICON_SIZE"
          :min-width="contentSize.ITEM_ICON_SIZE "
          :src="ownerSpellIconUrls.spell1"
        ></v-img>
        <v-img           
          class="full-item"
          rounded="md"
          :min-height="contentSize.ITEM_ICON_SIZE"
          :min-width="contentSize.ITEM_ICON_SIZE "
          :src="ownerSpellIconUrls.spell2"
        ></v-img>

        <!-- KDAARea -->
        <div class="mt-2">
          <div class="font-weight-bold text-h7">
            {{ match.owner.kills }} / 
            <span class="text-red"> {{ match.owner.deaths }}  </span>
            / {{ match.owner.assists }}
          </div>
          <div>
            {{ score }}
          </div>
        </div>        
      </div>    


      <div class="owner-icons mt-3">
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
          <v-img v-else class="empty-item"></v-img>

        </div>        
      </div>
    </div>

    <v-divider vertical class="ml-2"></v-divider>
    
  </v-sheet>  
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {
  props: {
    match: Object
  },
  setup(props) {
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
    const winLabel = computed(() => props.match.win ? 
      {
        labelStyle: {
          'background-color': '#5383E8',
          'min-width': '.45rem'
        },
        fontStyle: {
          'color': '#5383E8',                
        }
      } :
      {
        labelStyle: {
          'background-color': '#E84057',
          'min-width': '.45rem'
        },
        fontStyle: {
          'color': '#E83D46'
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
    

    const gameMode = computed(() => gameModeMap.get(props.match.gameMode))
    const duration = computed(() => {
      const ar = funcs.convertHMS(props.match.gameDuration).split(':').slice(1)
      return `${ar[0]}분 ${ar[1]}초`
    })

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

    const ownerChampionIconUrl = computed(() => 
      `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/champion/${props.match.owner.championName}.png`      
    )

    const ownerItemIconUrls = computed(() =>     
      props.match.owner.itemUrls.map(item => `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/item/${item}.png`)        
    )

    const ownerSpellIconUrls = computed(() => ({
      spell1: `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/spell/${spellEnum[props.match.owner.summoner1Id + '']}.png`,
      spell2: `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/spell/${spellEnum[props.match.owner.summoner2Id + '']}.png`
    }))
    


    const score = computed(() => {
      const owner = props.match.owner
      if (owner.deaths === 0) return 'Perfect'
      return ((owner.kills + owner.assists) / owner.deaths).toFixed(2) + ':1'
    })


    
    onMounted(() => {
      
    })

    return {
      contentSize,     
       

      // css style obj
      winLabel,
      overrideFontStyle,
      defaultFontStyle,

      // computed values
      gameMode,
      duration,
      timesAgo,
      score,      // kda

      ownerChampionIconUrl,
      ownerItemIconUrls,
      ownerSpellIconUrls
    }
  }
}
</script>

<style>
.matches {
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;  
}

.gameType {
  min-width: 130px;
}

.level {
  position: absolute;
  max-width: 22px;
  max-height: 22px;
  color: white;
  right: 8%;
  bottom: 8%;
  font-size: 12px;
  font-weight: 400;
  background-color: #202D37;
  opacity: 1;
}

.owner-icons {
  display: flex;
}

.champion-kda {
  display: flex;
}

.empty-item {
  min-width: 22px;
  min-height: 22px;
  border-radius: 5px;
  background-color: #703C47;
  margin-left: 2px;
}

.full-item {
  border-radius: 5px;
  margin-left: 2px;
}


</style>