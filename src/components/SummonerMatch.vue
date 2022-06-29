<template>
  <v-sheet 
    class="matches d-flex"
    :color="match.owner.win ? '#28344E' : '#59343B'"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"    
    :height="contentSize.SUMMONER_TOTAL_MATCH_HEIGHT"                
    elevation="0"
  >
    <!-- owner-label -->
    <div :style="winLabel.labelStyle"></div>  
      
      <!-- owner-game-type  -->
    <div class="game-type mt-2">
      <div :style="[winLabel.fontStyle, overrideFontStyle]" class="ml-2"> {{ gameMode }} </div>
      <div :style="defaultFontStyle">
        <div> {{ timesAgo }}</div>
        <v-divider class="mt-2 mb-2" width="50"></v-divider>
        <div class="font-weight-bold"> {{ winText }}</div>
        <div> {{ duration[0] }}분 {{ duration[1] }}초 </div>        
      </div>
    </div>

    <div class="icons mt-2">  
      <div class="champion-kda">

        <!-- owner-champion-icon-->
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
        

        <!-- owner-spell-icon -->
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

         <!-- owner-rune-icon -->
        <div style="'display': 'flex'">
          <v-avatar size="25" color="#000000" class="runes">
            <v-img            
              class="full-item main-rune"
              rounded="md"              
              :src="ownerRuneIconUrls[0]"
            ></v-img>            
          </v-avatar>          
          <v-img            
            class="full-item sub-rune"
            rounded="md"            
            :src="ownerRuneIconUrls[1]"
          ></v-img>
        </div>

        <!-- owner-score -->
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

        <!-- owner-killInvolvementArea -->
        <div class="ml-1">
          <div class="kill-involvementArea"> 킬관여 {{ killInvolvementArea }} % </div>
          <div class="owner-wards"> 제어 와드 {{ match.owner.detectorWardsPlaced }} </div>
          <div class="owner-cs"> CS {{ match.owner.totalMinionsKilled }} ({{ csPerMin }})</div>
          <div class="average-tier"> {{ averageTier}} </div>
        </div>

      </div>
        

      <!-- owner-item -->
      <div class="mt-2 ml-2 d-flex">
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

        <!-- owner-multikill -->
        <span v-if="multikill" class="multikill">
          {{ multikill }}
        </span> 
        
      </div>
    </div>


    <!-- entries-simple -->
    <div class="d-flex" >
      <div class="entries-simple">
        <div 
          class="match-entry"
           v-for="(entry, i) in matchEntries.slice(0, 5)"
          :key="i"
          @click="pushEntry(entry.summonerName)"
        >
          <v-avatar 
            rounded="md" 
            :size="contentSize.CHAMPION_ENTRIES_ICON_SIZE"
          >
            <v-img :src="entry.url"></v-img>                        
          </v-avatar>
          <span class="match-entry-name" :style="myNameBoldStyle(entry.summonerName)">
            {{ entry.summonerName }}
          </span>
        </div>
      </div>

      <div class="entries-simple">
        <div 
          class="match-entry"
           v-for="(entry, i) in matchEntries.slice(5, 10)"
          :key="i"
          @click="pushEntry(entry.summonerName)"
        >
          <v-avatar 
            rounded="md" 
            :size="contentSize.CHAMPION_ENTRIES_ICON_SIZE"
          >
            <v-img :src="entry.url"></v-img>                        
          </v-avatar>
          <span class="match-entry-name" :style="myNameBoldStyle(entry.summonerName)">
            {{ entry.summonerName }}
          </span>
        </div>
      </div>
    </div>

    <!-- entries-detail-button -->
    <div 
      @click="detailExpand = !detailExpand"
      :style="winLabel.foldStyle" :class="[foldClass, match.owner.win ? 'fold-win' : 'fold-loss']">
      <v-icon :color="match.owner.win ? '#5383e8' : '#d94055'">
         {{ detailExpand ? 'mdi-rotate-180 ' : '' }}mdi-chevron-down
      </v-icon>
    </div>  

  </v-sheet>  


  <!-- entries-detail -->

  <!-- match-link -->
  <v-sheet
    class="match-link d-flex align-center"
    v-if="detailExpand"
    color="subcontent"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH" 
    :height="contentSize.SUMMONER_TOTAL_MATCH_SEEMORE_LINK_HEIGHT"
  >      
    <div class="match-link-url">
      <img src="../../public/icon-link.svg" id="link-copy-svg">
      {{ matchLink }}
    </div>
    <button @click="copyLink" class="match-link-copy-btn">
      {{ copyLinkText }}
    </button>
  </v-sheet>

  <!-- entries-detail-menu -->
  <v-sheet
    class="matches d-flex justify-space-between align-center"
    v-if="detailExpand"
    color="subcontent"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"
    :height="contentSize.SUMMONER_TOTAL_MATCH_SEEMORE_FILTER_HEIGHT"
  >
    <v-btn                          
      class="ml-1 mr-1 filter-menu"      
      rounded="md"            
      v-for="(button, i) in viewSelectToggleButtons"
      elevation="0"
      :color="button.activate ? '#515163' : 'subcontent'"         
      exact
      :key="i"      
    >
      <span :class="button.activate ? 'font-weight-bold' : ''">
        {{ button.name }}        
      </span>
    </v-btn>    
  </v-sheet>

  <!-- entries-detail -->
  <v-sheet
    class="matches"
    v-if="detailExpand"
    :color="match.owner.win ? '#28344E' : '#59343B'"
    :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH"     
  >
    
    <template v-for="(team, i) in orderedMatchEntries[0]" :key="i">      

      <!-- team-simple -->
      <v-sheet       
        class="d-flex align-center justify-space-between"
        v-if="i === 1"
        :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH" 
        height="60"
      >

        <div class="ml-5 team-simple-object">          
          <template v-for="(obj, i) in teamsInfo.firstTeam" :key="i">
            <img class="team-simple-object-img" :src="obj.img"> 
            <span class="ml-1 mr-2 mb-2"> {{ obj.text }} </span>
          </template>
        </div>

        <div class="team-simple-stat">          
          <div class="d-flex">
            <div :style="teamKillStyle[0]"> </div>
            <div :style="teamKillStyle[1]"></div>
            <div class="team-simple-stat-text d-flex justify-space-between">              
              <div> {{ totalKills.firstTeamTotalKill }}</div>
              <div> Total Kill</div>
              <div> {{ totalKills.secondTeamTotalKill }}</div>
            </div>
          </div>
          <div class="d-flex mt-2">
            <div :style="teamGoldStyle[0]"> </div>
            <div :style="teamGoldStyle[1]"></div>
            <div class="team-simple-stat-text d-flex justify-space-between">              
              <div> {{ totalGolds.firstTeamGoldEarned.toLocaleString() }}</div>
              <div> Total Gold</div>
              <div> {{ totalGolds.secondTeamGoldEarned.toLocaleString() }}</div>
            </div>
          </div>
        </div>
        
        <div class="mr-5 team-simple-object">
          <template v-for="(obj, i) in teamsInfo.secondTeam" :key="i">
            <img class="team-simple-object-img" :src="obj.img"> 
            <span class="ml-1 mr-2 mb-2"> {{ obj.text }} </span>
          </template>          
        </div>        
      </v-sheet>
      
      <!-- entries-label- -->
      <v-sheet 
        color="subcontent"
        :width="contentSize.SUMMONER_TOTAL_MATCHES_WIDTH" 
        height="30"
      >            
        <div class="d-flex entry-label">
          <div v-if="i === 0" style="width: 90px" class="ml-1">
            <span :style="winTextStyle(winText, i)">{{ winText }}</span>
            <span>({{ teamsText }})</span>
          </div>

          <div v-else style="width: 90px" class="ml-1">
            <span :style="winTextStyle(winText, i)">{{ winText === '승리' ? '패배' : '승리'}}</span>
            <span>({{ teamsText === '레드팀' ? '블루팀' : '레드팀' }})</span>
          </div>

          <div v-if="gameMode === '일반'" style="width: 160px">OP Score</div>
          <div v-else style="width: 160px"></div>
          
          <div style="width: 115px">KDA</div>
          <div style="width: 125px">피해량</div>          
          <div style="width: 85px">와드</div>
          <div style="width: 43px">cs</div>
          <div style="width: 130px">아이템</div>
        </div>

      </v-sheet>
      
      <!-- entry -->
      <v-sheet                 
        v-for="(entry, j) in team"
        :key="j"                
        max-height="40"
        class=' d-flex align-center pt-1 pb-1'
        :color="entry.summonerName === route.params.name ? orderedMatchEntries[1][2] : orderedMatchEntries[1][i]"
      >        

        <!-- entry-icon -->
        <div>
          <v-avatar 
            rounded="md" 
            :size="35"
            class="ml-2 mr-1"            
          >
            <v-img :src="entry.url"></v-img>                        
            <v-avatar class="entry-level">
              {{ entry.champLevel }}
            </v-avatar>
          </v-avatar>    
        </div>
    
        <!-- entry-spell -->
        <div>
          <div
            v-for="(url, k) in entry.spellIconUrls"
            :key="k"
          >
            <img :src="url" id="entry-spell"/>
          </div>
        </div>


        <!-- entry-rune -->
        <div>
          <div
            v-for="(url, k) in entry.runeIconUrls"
            :key="k"
          >
            <v-avatar v-if=" k===0" size="18" color="#000000" style="text-align: center">                      
              <img :src="url" id="entry-rune--main"/>
            </v-avatar> 
            <img v-else :src="url" id="entry-rune" />
          </div>
        </div>

        <!-- entry-summonerName -->
        <div 
          @click="pushEntry(entry.summonerName)"
          class="match-entry-name match-entry-name-seemore ml-1" :style="myNameBoldStyle(entry.summonerName)">
          {{ entry.summonerName }}
        </div>

        <!-- entry-opScore -->
        <template v-if="gameMode === '일반'">
          <div class="match-entry-seemore-opScore">
            {{ entry.opScore }}
          </div>
  
          <div class="match-entry-seemore-rank">
            <div v-if="entry.ranking !== '1st' " class="match-entry-seemore-ranking">
              {{ entry.ranking }}
            </div> 
            <div v-else class="match-entry-seemore-ranking match-entry-seemore-ranking--mvp">
              MVP
            </div> 
          </div>
        </template>

        <div v-else class="match-entry-seemore-opScore-empty"></div>

        <!-- entry-kda -->
        <div style="text-align: center" class="match-entry-seemore-kda-score">
          <div class="match-entry-seemore-kda mt-1">
            {{ entry.kills }}/{{ entry.deaths}}/{{ entry.assists }} ({{ entry.killInvolvementArea }}%)
          </div>
          <div :style="[selectScoreFontStyle(entry.score), {'font-weight': '600', 'font-size': '14px', 'opacity': '1'}]">
            {{ entry.score }}
          </div>
        </div>

        <!-- entry-damage -->
        <div class="text-align match-entry-damage">
          <div class="match-entry-font-grey mr-1">
            {{ entry.totalDamageDealtToChampions.toLocaleString() }}
          </div>
          <div class="damage-bar-base">
            <div :style="damageStyle(entry.damageWidth)"></div>            
          </div>
        </div>
        
        <div class="text-align ml-2 match-entry-damage">
          <div class="match-entry-font-grey mr-1">
            {{ entry.totalDamageTaken.toLocaleString() }}
          </div>
          <div class="damage-bar-base">
            <div :style="damagedStyle(entry.damagedWidth)"></div>
          </div>
        </div>

        <!-- entry-ward -->
        <div class="text-align ml-2 match-entry-ward">
          <div class="match-entry-font-grey">
            {{ entry.visionWardsBoughtInGame }}
          </div>
          <div class="match-entry-font-grey">
            {{ entry.wardsKilled }} / {{ entry.wardsPlaced }}
          </div>          
        </div>
        
        <!-- entry-cs -->
        <div class="text-align ml-2 match-entry-ward">
          <div class="match-entry-font-grey">
            {{ entry.totalMinionsKilled }}
          </div>
          <div class="match-entry-font-grey">
            분당 {{ entry.csPerMin }}
          </div>          
        </div>
          
        <!-- entry-items -->
        <div class="ml-3 d-flex">
          <div
            v-for="(url, i) in entry.itemUrls" 
            :key="i"
          >
            <img v-if="url" :src="url" alt="" class="match-entry-items mt-1">            
            <div 
              v-else class="match-entry-items empty-item"
            ></div>            
          </div>
         </div>  
      </v-sheet>
  
    </template>
    
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

    const detailExpand = ref(false)
    const copyLinkText = ref('Copy Link')
    const matchLink = ref('https://www.op.gg/summoners/kr/%EB%85%B9%EC%84%A0%EB%A9%80/matches/KgLASefpaoC8nMu0qdN7T43ZjUUaljhiqiD4dAfWR0A%3D/1656168003000')
    const TEAM_BAR_GRAPH_SCALE = 490
    const WIDTH_SCALE = 55

    const gameModeMap = new Map([['CLASSIC', '일반'], ['ARAM', '무작위 총력전']])   

    const suffixes = new Map([
      ['one',   'st'],
      ['two',   'nd'],
      ['few',   'rd'],
      ['other', 'th'],
    ]);

    const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
     
    const spellEnum = {
      '1': 'SummonerBoost',
      '3': 'SummonerExhaust',
      '4': 'SummonerFlash',
      '6': 'SummonerHaste',
      '7': 'SummonerHeal',
      '11': 'SummonerSmite',
      '12': 'SummonerTeleport',
      '13': 'SummonerMana',
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


    // owner
    const ownerChampionIconUrl = computed(() => `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/champion/${props.match.owner.championName}.png`)
    const ownerItemIconUrls = computed(() => createItemIconUrls(props.match.owner))    
    const ownerSpellIconUrls = computed(() => ([
       `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/spell/${spellEnum[props.match.owner.summoner1Id + '']}.png`,
      `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/spell/${spellEnum[props.match.owner.summoner2Id + '']}.png`
    ]))

    const ownerRuneIconUrls = computed(() => createRuneUrls(props.match.owner.perks))    
    const score = computed(() => createScore(props.match.owner))
    const killInvolvementArea = computed(() => createkillInvolvementArea(props.match.owner))
    const csPerMin = computed(() => createCsPerMin(props.match.owner))
    const averageTier = computed(() => {})
    const winText = computed(() => props.match.owner.win ? '승리' : '패배')
    const teamsText = computed(() => props.match.teams.find(team => team.win).teamId === 100 ? '레드팀' : '블루팀')    
    const teamsInfo = computed(() => {
      const firstTeam = props.match.teams.find(team => team.win === props.match.owner.win)
      const secondTeam = props.match.teams.find(team => team.win !== props.match.owner.win)

      if (firstTeam.teamId === 100) {
        firstTeam.imgId = '-r',
        secondTeam.imgId = ''
      }

      else {
        firstTeam.imgId = '',
        secondTeam.imgId = '-r'
      }

      return {
        firstTeam: [
          {
            img: `../../public/icon-baron${firstTeam.imgId}.svg`,
            text: firstTeam.objectives.baron.kills,
          },
          {
            img: `../../public/icon-dragon${firstTeam.imgId}.svg`,
            text: firstTeam.objectives.dragon.kills
          },
          {
            img: `../../public/icon-tower${firstTeam.imgId}.svg`,
            text: firstTeam.objectives.tower.kills
          }            
        ],          
        secondTeam: [
          {
            img: `../../public/icon-baron${secondTeam.imgId}.svg`,
            text: secondTeam.objectives.baron.kills,
          },
          {
            img: `../../public/icon-dragon${secondTeam.imgId}.svg`,
            text: secondTeam.objectives.dragon.kills
          },
          {
            img: `../../public/icon-tower${secondTeam.imgId}.svg`,
            text: secondTeam.objectives.tower.kills
          }
        ]
      }
    })

    const totalKills = computed(() => {
      const { firstTeam, secondTeam } = findTeam()
      return {
        firstTeamTotalKill: firstTeam.objectives.champion.kills,
        secondTeamTotalKill: secondTeam.objectives.champion.kills
      }
    })

    const totalGolds = computed(() => {
      const [one, two] = orderedMatchEntries.value[0]

      return {
        firstTeamGoldEarned: one.map(participant => participant.goldEarned).reduce((acc, cur, i) => acc + cur),
        secondTeamGoldEarned: two.map(participant => participant.goldEarned).reduce((acc, cur, i) => acc + cur)
      }
    })
    

    const teamKillStyle = computed(() => {
      const { firstTeamTotalKill, secondTeamTotalKill } = totalKills.value
      let firstColor
      let secondColor

      if(!props.match.owner.win) {
        firstColor = '#e84057'
        secondColor = '#5383e8'
      } else {
        firstColor = '#5383e8' 
        secondColor = '#e84057'
      }

      return [
        {
          'background-color': firstColor,
          'width': (TEAM_BAR_GRAPH_SCALE / (firstTeamTotalKill + secondTeamTotalKill) * firstTeamTotalKill) + 'px',
          'height': '16px'
        },
        {
          'background-color': secondColor,
          'width': (TEAM_BAR_GRAPH_SCALE / (firstTeamTotalKill + secondTeamTotalKill) * secondTeamTotalKill) + 'px',
          'height': '16px'
        }
      ]
    })

    const teamGoldStyle = computed(() => {
      const { firstTeamGoldEarned, secondTeamGoldEarned } = totalGolds.value

      let firstColor
      let secondColor

      if(!props.match.owner.win) {
        firstColor = '#e84057'
        secondColor = '#5383e8'
      } else {
        firstColor = '#5383e8' 
        secondColor = '#e84057'
      }

      return [
        {
          'background-color': firstColor,
          'width': (TEAM_BAR_GRAPH_SCALE / (firstTeamGoldEarned + secondTeamGoldEarned) * firstTeamGoldEarned) + 'px',
          'height': '16px'
        },
        {
          'background-color': secondColor,
          'width': (TEAM_BAR_GRAPH_SCALE / (firstTeamGoldEarned + secondTeamGoldEarned) * secondTeamGoldEarned) + 'px',
          'height': '16px'
        }        
      ]

    })

    const findTeam = () => ({
      firstTeam: props.match.teams.find(team => team.win === props.match.owner.win),
      secondTeam: props.match.teams.find(team => team.win !== props.match.owner.win)
    })

    // entry
    const matchEntries = computed(() =>  createMatchEntries(props.match.participants))

    const orderedMatchEntries = computed(() => {      
      const newEntries = matchEntries.value
      const [one, two] = [newEntries.slice(0, 5), newEntries.slice(5, 10)]
      let color

      if (props.match.owner.win) color = ['#28344E' , '#59343B', '#284F91']
      else  color = ['#59343B', '#28344E', '#703c47']

      return matchEntries.value.map(entry => entry.summonerName).indexOf(route.params.name) < 5 
      ? [[one, two], color]
      : [[two, one], color]      
    })
    
    function pushEntry(payload) {
      router.push(`/summoner/${payload}`)
      searchStore.searchContent(payload)
    }

    const viewSelectToggleButtons = [
      {
        name: '종합',
        activate: true,
      },
      {
        name: '팀 분석',
        activate: false,
      },
      {
        name: '빌드',
        activate: false,
      },
      {
        name: 'etc',
        activate: false,
      }
    ]
    
    function createMatchEntries(entries) {
      
      const championData = Object.values(championJSON.data)            
      const ids = entries.map(participant => participant.championId)      
      const championImageName = ids.map(id => championData.find(champ => champ.key == id)).map(result => result.image.full)
      const opScores = createOpScores(entries)

      const stringRankWithOpScores = opScores.map(score => {
        const rule = pr.select(score.rank)
        const suffix = suffixes.get(rule)
        return `${score.rank}${suffix}`
      })

      const damageCanvasWidth =  caculateDamageCanvasWidth(entries.map(entry => entry.totalDamageDealtToChampions))
      const damagedCanvasWidth = caculateDamageCanvasWidth(entries.map(entry => entry.totalDamageTaken))
      
      return entries.map((participant, i) => {
        const {summonerName, kills, deaths, assists, totalDamageDealtToChampions, totalDamageTaken, visionWardsBoughtInGame, 
          wardsKilled, wardsPlaced, totalMinionsKilled, champLevel, goldEarned } = participant          
              
        return {
          summonerName, kills, deaths, assists, totalDamageDealtToChampions, totalDamageTaken, visionWardsBoughtInGame, 
          wardsKilled, wardsPlaced, totalMinionsKilled, champLevel, goldEarned,
          ranking: stringRankWithOpScores[i],
          opScore: opScores[i].score,
          spellIconUrls: createSpellUrls({
            summoner1Id: participant.summoner1Id,
            summoner2Id: participant.summoner2Id        
          }),
          score: createScore(participant),
          runeIconUrls: createRuneUrls(participant.perks),
          killInvolvementArea: createkillInvolvementArea(participant),
          csPerMin: createCsPerMin(participant),
          itemUrls: createItemIconUrls(participant),                    
          damageWidth: damageCanvasWidth[i],
          damagedWidth: damagedCanvasWidth[i],
          url: `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/champion/${championImageName[i]}`,          
        }
      })
    }

    function createSpellUrls(player) {
      return [
        `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/spell/${spellEnum[player.summoner1Id + '']}.png`,
        `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/spell/${spellEnum[player.summoner2Id + '']}.png`
      ]
    }

    function createRuneUrls(perks) {
      const runeId = perks.styles[0].selections[0].perk      
      const mainId = perks.styles[0].style
      const mainObj =  runeJSON.find(mainRune => mainRune.id === mainId)
      const subObj = runeJSON.find(subRune => subRune.id === perks.styles[1].style)

      const runeObj = mainObj?.slots[0].runes.find(rune => rune.id === runeId)


      return [`${urlConfig.imgUrl}/img/${runeObj.icon}`, `${urlConfig.imgUrl}/img/${subObj.icon}`]
    }

    function createOpScores(entries) {      
      const opScores = entries.map(entry => {
        const score = createScore(entry)
        return score === 'Perfect' ? 10 : Number(score.split(':')[0])
      })

      const ranks = Array.from({length: 10}, () => 1)
      ranks.forEach((_, i) => {
        ranks.forEach((_, j) => opScores[j] > opScores[i] ? ranks[i]++ : _ )
      })

      return opScores.map((score, i) => ({score, rank: ranks[i]}))
    }

    function caculateDamageCanvasWidth(damages) {            
      const maxDamage = Math.max(...damages)            
      return damages.map(damage => (WIDTH_SCALE / maxDamage * damage).toFixed())
    }

    const entriesItemIconUrls = computed(() => props.match.matchEntries.map(matchEntries => matchEntries.itemsUrls))
    const createItemIconUrls = entry => entry.itemUrls.map(item => `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/item/${item}.png`)
    const createScore = entry => !entry.deaths ? 'Perfect' : ((entry.kills + entry.assists) / entry.deaths).toFixed(2) + ':1'
    const createkillInvolvementArea = entry => !(entry.kills + entry.assists) ? 0 : Math.ceil(entry.kills + entry.assists / props.match.totalKills * 100)
    const createCsPerMin = entry => (entry.totalMinionsKilled / Number(duration.value[0])).toFixed(1)
    const selectScoreFontStyle = score => {
      if(score === 'Perfect') return {'color': '#eb663a'}

      const numScore = Number(score.split(':')[0])
      if(numScore < 3) return
      if(numScore < 4) return {'color': '#009f75'}
      if(numScore < 5) return {'color' : '#0094e3'}

      return {'color': '#eb663a'}
    }

    const damageStyle = width => ({      
      'background-color': '#e84057',
      'width': `${width}px`,
      'height': '6.5px'
    })

    const damagedStyle = width => ({      
      'background-color': '#7b7a8e',
      'width': `${width}px`,
      'height': '6.5px'
    })

    const winTextStyle = (win, i) => {
      if (i === 0) return winLabel.value.fontStyle      
      if (i === 1) return win === '승리' ? {'color': '#E83D46'} : {'color': '#5383E8'}         
      
    }
              
    onMounted(() => {})

    return {
      // setup
      contentSize,     
      route,
       
      // css style, class obj
      winLabel,
      overrideFontStyle,
      defaultFontStyle,
      foldClass,
      selectScoreFontStyle,
      damageStyle,
      damagedStyle,      
      winTextStyle,
      
      //owner
      ownerChampionIconUrl,
      ownerItemIconUrls,
      ownerSpellIconUrls,
      ownerRuneIconUrls,

      // computed values
      gameMode,
      duration,
      timesAgo,
      score,      
      winText,
      
      teamsText,

      // computed values - iconUrls
      ownerChampionIconUrl,
      ownerItemIconUrls,
      ownerSpellIconUrls,
      ownerRuneIconUrls,
      entriesItemIconUrls,

      multikill,
      killInvolvementArea,
      csPerMin,
      averageTier,
      matchEntries,
      orderedMatchEntries,
      matchLink,
      createRuneUrls,

      // detail
      detailExpand,
      viewSelectToggleButtons,
      copyLinkText,
      copyLink: () => navigator.clipboard.writeText(matchLink.value).then(() => copyLinkText.value = 'Copied'),

      // detail-team
      teamsInfo,
      teamKillStyle,
      teamGoldStyle,
      totalKills,
      totalGolds,

      pushEntry,
      myNameBoldStyle: name => name === route.params.name ? {'color': 'white'} : '',
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

.game-type {
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

.entries-simple {
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
  cursor: pointer;
}

.match-entry-name-seemore {
  font-size: 12px;
  color: white;
  max-width: 13%;
  flex-grow: 1;

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

.match-link {
  border-radius: 5px;  
  margin-top: -1.5px;
  margin-bottom: 6px;
}

.match-link-url {  
  display: flex;
  align-items: center;
  font-size: 12px;  
  margin: 0px 5px 0px 5px;
  padding: 5px; 
  padding-left: 10px;     
  background-color: #1C1C1F;
  border-radius: 5px;
  flex-grow: 1;
  color: #9E9EB1;
  vertical-align: middle;
  text-overflow: ellipsis;
  overflow: hidden;  
}

.match-link-copy-btn {
  width: 12%;
  font-size: 13px;
  padding: 3px 0px;
  border-radius: 5px;
  margin-right: 5px;
  font-weight: 300;
  background-color: #00bba3;
}

.match-link-copy-btn:hover {
  
}

#link-copy-svg {
  margin-right: 6px;
  height: 17px;
}

.filter-menu {
  min-width: 24%;
}

.seemore-entry {
  max-height: 35px;  
}

.team-simple-object {
  color: #7b7a8e;   
  font-size: 14px;        
}

.team-simple-object-img {
  width: 14px;
}

.team-simple-stat {
  width: 490px;
  height: 40px;  
}

.team-simple-stat-text {
  position: absolute;    
  font-size: 10px;  
  width: 490px;
  padding-left: 7px;
  padding-right: 7px;
}

.entry-label {
  color: #7b7a8e;   
  font-size: 12px;  
  text-align: end;      
  line-height: 30px;
}

#entry-spell {  
  margin-left: 2px;
  margin-top: 3px;
  display: flex;
  flex-direction: column;
  width: 16px;
  height: 16px;
}

.entry-level {    
  position: absolute;
  max-width: 17px;
  max-height: 17px;
  color: white;
  left: 0%;
  bottom: 0%;
  font-size: 12px;
  font-weight: 400;
  background-color: #202D37;
  opacity: 1;  
}

#entry-rune {
  margin-left: 2px;
  display: flex;
  flex-direction: column;
  width: 16px;
  height: 16px;
} 


#entry-rune--main {
  margin-left: 2px;
  display: flex;
  flex-direction: column;
  width: 16px;
  height: 16px;
}

.match-entry-seemore-opScore-empty {
  width: 13%;
}

.match-entry-seemore-opScore {
  font-weight: bold;
  font-style: italic;
  font-size: 14px;
  max-width: 3%;
  flex-grow: 1;
  text-align: center;
}

.match-entry-seemore-rank {
  width: 10%;   
}

.match-entry-seemore-ranking {
  color: white !important;
  font-size: 12px;
  width: 33px;
  text-align: center;
  background-color: #7F9397;    
  padding-left: 4px;
  padding-right: 4px;
  padding-top: 2px;
  margin-left: 15px;
  height: 22px;
  
  border-radius: 15px;
}

.match-entry-seemore-ranking--mvp {
  background-color: #eb9d00;
  width: 40px;
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

.match-entry-seemore-kda-score {
  min-width: 110px;
}

.match-entry-seemore-kda {
  opacity: .7;
  font-size: 12px;  
  text-align: center;
  min-width: 80px;
}

.match-entry-font-grey {
  opacity: .7;
  font-weight: 400;
  font-size: 12px;  
  text-align: center;  
}

.damage-bar-base {
  width: 55px;
  height: 6.5px;
  background-color: #31313c;
  margin-bottom: 5px;
}

.match-entry-damage {
  min-width: 60px;
}

.match-entry-ward {
  min-width: 40px;
}

.match-entry-items {
  max-height: 22px;
  margin-left: 1px;
  /* flex-grow: 1; */
}


</style>