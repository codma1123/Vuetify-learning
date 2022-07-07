<template>
  <div class="d-flex justify-space-between killmap">  

    <div class="mt-4">
      <span class="ml-2 win-team-label"> 승리팀 </span>
      <div v-for="(participant, i) in winTeam" :key="i" class="d-flex align-center mt-3">
        <div :style="createChampionDotColor(participant.color)">
        </div>
        <div 
          @click="disableDots(i)"
          class="participant-box d-flex align-center">
          <img :src="participant.championIcon" alt="" class="participant-box-icon">
          {{participant.summonerName}}
        </div>
        
      </div>
    </div>

    <div class="minimap d-flex align-center">
      <img src="http://ddragon.leagueoflegends.com/cdn/6.8.1/img/map/map11.png" class="minimap-img" alt="">

      <div v-for="(dotPosition, i) in dotPositions" :key="i">
        <div 
          v-for="(style, j) in dotPosition.styles" 
          :key="j"
          :style="dotStyles[i].styles[j]"        
        >      
          <v-tooltip
            activator="parent"
            location="top"    
            color="#fff" 
          >
            <div class="kill-map-timeline"> {{ dotPosition.position[j].timeline }}분 </div>
            <div class="d-flex align-center kill-map-content">
              <img class="kill-map-killer-icon" :src="getChampionIconUrl(dotPosition.championName)" alt="">
              <span> {{ dotPosition.summonerName }} </span>
              <span class="text-red">&nbsp Killed &nbsp</span>
              <img class="kill-map-killer-icon" :src="getChampionIconUrl(dotPosition.position[j].victim.championName)" alt="">
              <span> {{ dotPosition.position[j].victim.summonerName }}</span>
              
              
            </div>
            <div class="kill-map--triangle"></div>
          </v-tooltip>
        </div>      
      </div>
    
    </div>

    <div class="mt-4">
      <span class="ml-2 win-team-label"> 패배팀 </span>
      <div v-for="(participant, i) in loseTeam" :key="i" class="d-flex align-center mt-3 mr-3">
        <div :style="createChampionDotColor(participant.color)">
        </div>
        <div class="participant-box d-flex align-center">
          <img :src="participant.championIcon" alt="" class="participant-box-icon">
          {{participant.summonerName}}
        </div>
      </div>
    </div>   

  </div>
</template>

<script>
import useSizeSetup from '@/tools/SizeSetup.vue'
import { computed, onMounted, ref } from 'vue'

export default {
  props: {
    match: Object,
    killMapProps: Array
  },
  setup(props) {
    const { searchStore, funcs, urlConfig } = useSizeSetup()
    const MAP_MAX_SCALE = 16000
    const MAP_SCALE = 300
    const colors = ref([])
    const dotStyles = ref([])
    const visibles = ref(Array.from({length: 10}))

    const dotPositions = computed(() => createDotPositions())

    function disableDots (index) {      
      visibles.value[index] = !visibles.value[index]
      
      if(visibles.value[index])
        dotStyles.value[index].styles = dotStyles.value[index].styles.map(style => ({...style, 'display' : 'none'}))
      else
        dotStyles.value[index].styles = dotStyles.value[index].styles.map(style => ({...style, 'display' : ''}))      
    }
        

    const getChampionIconUrl = name => funcs.createChampionIconUrl(urlConfig.imgUrl,searchStore.iconCdnVersion, name)

    const winTeam = computed(() => props.killMapProps.slice(0, 5).map((participant, i) => ({
      summonerName: participant.summonerName,
      championIcon: getChampionIconUrl(participant.championName),
      color: colors.value[i]
    })))

    const loseTeam = computed(() => props.killMapProps.slice(5, 10).map((participant, i) => ({
      summonerName: participant.summonerName,
      championIcon: getChampionIconUrl(participant.championName),
      color: colors.value[i + 5]
    })))
    

    const createChampionDotColor = color => ({
      'background-color': color,
      'width': '33px',
      'height': '33px',
      'border-radius': '5px',
      'margin-left': '10px'
    })

        
    function createDotPositions () {

      const killMapWithStyle = props.killMapProps.map(kill => ({
        ...kill,
        scales: kill.position.map(position => convertScale(position.position)),
      })).map((participant, i) => ({          
        ...participant,
        styles: participant.scales.map(scale => ({
          'left': scale.xScale + 'px',
          'bottom': scale.yScale + 'px',
          'background-color': colors.value[i],
          'position': 'absolute',
          'width': '13px',
          'height': '13px',
          'border-radius': '50%',
          'outline': '.5px solid black' ,
          'opacity': '.8'            
        }))
      }))

      dotStyles.value = killMapWithStyle

      return killMapWithStyle
          
    }

    const convertScale = (position) => ({
      xScale: ((MAP_SCALE / MAP_MAX_SCALE) * Number(position.x)).toFixed(1),
      yScale: ((MAP_SCALE / MAP_MAX_SCALE) * Number(position.y)).toFixed(1)
    })

    onMounted(() => {      
      colors.value = Array.from({length: 10}).map( _ => funcs.createRandomColor())      
    })


    return {
      dotPositions,
      getChampionIconUrl,
      createChampionDotColor,
      disableDots,
      dotStyles,

      winTeam,
      loseTeam
    }
  }
}
</script>

<style>
.killmap {
  margin-top: -10px;
}
.win-team-label {
  opacity: .6;
  font-size: 13px;
}

.participant-box {
  cursor: pointer;
  height: 50px;
  outline: 1px solid #424254;
  background-color: #31313c;
  border-radius: 5px;
  margin-left: 10px;
  padding-bottom: 10px;
  padding-top: 10px;
  padding-left: 10px;
  width: 180px;
}

.participant-box-icon {
  height: 35px;
  width: 35px;
  margin-right: 8px;
}

.minimap {
  margin-top: 50px;
  margin-bottom: 50px;
  border-radius: 20px;
  height: 300px;
  width: 300px;  
  object-fit: cover;
  object-position: 20% 10%;   
  position: relative;
}

.minimap-img {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 20px;
  filter: opacity(.3);    
  outline: 1px solid;
}

.kill-map-timeline {
  font-weight: bold;
  font-size: 12px;
}

.kill-map-content {
  font-size: 12px;
}

.kill-map-killer-icon {
  height: 20px;
  width: 20px;
}

.kill-map--triangle {
  border-bottom: 13px solid transparent;
  border-top: 13px solid black;
  border-left: 13px solid transparent;
  border-right: 13px solid transparent;  
  position: absolute;
}




</style>