<template>
  <div v-if="!searchStore.userInfoLoaded">
    <v-sheet
      color="subcontent"
      height="40"
      width="300"
      class="mt-2 recent-team-title"        
    > 
       같은 팀으로 게임한 소환사들 (최근 20 게임) 
    </v-sheet>

    <v-sheet
      color="#282830"
      height="30"
      width="300"
      class="recent-team-attrs pl-4 pr-4"        
    >
      <v-row class="recent-team-row">
       <v-col cols="12" xl="5" lg="5" class="row-title"> 소환사 </v-col>
       <v-col cols="12" xl="2" lg="2"> 게임 </v-col>
       <v-col cols="12" xl="3" lg="3"> 승 - 패 </v-col>
       <v-col cols="12" xl="2" lg="2"> 승률 </v-col>
      </v-row>
    </v-sheet>

    <v-sheet 
      v-for="(team, i) in searchStore.recentTeams" :key="i"
      height="30"
      color="subcontent"
      width="300"
      class="recent-team-contents pl-4 pr-4"      
      :style="getTeamContentStyle(i)"
    >
      <v-row class="recent-team-row">             
        <v-col cols="12" xl="1" lg="1"> <img :src="getProfileIconUrl(team[1].icon)" alt="" class="recent-team-row-icon"> </v-col>
        <!-- <img :src="getProfileIconUrl(team[1].icon)" alt="" class="recent-team-row-icon"> -->
        <v-col cols="12" xl="4" lg="4" class="row-title">
          <span 
            @click="pushEntry(team[0])"
            class="recent-team-row-title"
          > {{ team[0] }} </span>  
        </v-col>
        <v-col cols="12" xl="2" lg="2"> {{ team[1].total }} </v-col>
        <v-col cols="12" xl="3" lg="3"> {{ team[1].win }} - {{ team[1].lose }} </v-col>
        <v-col cols="12" xl="2" lg="2"> {{ getWinRate(team[1].win, team[1].lose)}} </v-col>
      </v-row>      
    </v-sheet>    
  </div>
</template>

<script>
import useSizeSetup from '../tools/SizeSetup.vue'
import RecentDuoContents from './recentDuo/RecentDuoContents.vue'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  components: {
    RecentDuoContents
  },
  setup() {
    const { searchStore, urlConfig } = useSizeSetup()
    const router = useRouter()

    
    const getWinRate = (win, lose) => ((win / (win + lose)) * 100).toFixed() + '%'
    const getTeamContentStyle = index => index === searchStore.recentTeams.length - 1 ? {
      'border-bottom-left-radius': '5px',
      'border-bottom-right-radius': '5px'
    } : {}

    const getProfileIconUrl = profileIconId => `${urlConfig.imgUrl}/${searchStore.iconCdnVersion}/img/profileicon/${profileIconId}.png`    
    
    function pushEntry(payload) {
      router.push(`/summoner/${payload}`)
      searchStore.searchContent(payload)
    }

    return {
      searchStore,

      getWinRate,
      getTeamContentStyle,
      getProfileIconUrl,
      pushEntry
    }
  }
}
</script>

<style>
.recent-team-title {
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-size: 14px;
  line-height: 40px;
  text-align: center;  
}

.recent-team-attrs {
  margin-top: 1px;
    
}

.recent-team-row {  
  margin-top: 0px !important;
  margin-bottom: 0px !important;
  padding: 0px !important;
  padding-bottom: 20px !important;
  font-size: 12px;
  line-height: 10px !important;      
  color: #7b7a8e;  
  text-align: center;  
}

.recent-team-row-icon {
  height: 23px;
  width: 23px;  
  border-radius: 50%;      
  position: relative;
  top: -7px;
  left: -7px;  
}

.recent-team-contents {
  margin-top: 1px;
  font-size: 12px;
  line-height: 10px !important;  
}



.recent-team-row-title {
  color: white !important;  
}

.recent-team-row-title:hover {
  text-decoration: underline !important;  
  cursor: pointer;
}


.row-title {
  text-align: start !important;
}




</style>