<template>
  <div v-if="!searchStore.buildLoading">
    <v-sheet height="35" class="d-flex align-center" color="#282830">
      <span class="ml-2 build-type"> 아이템 빌드 </span>
    </v-sheet>

    <div class="build-divider"></div>

    <v-sheet class="d-flex align-center flex-wrap" color="subcontent pl-4">
      <div v-for="(timeline, i) in itemIcons" :key="i" class="mt-2">
        <div class="d-flex align-center">
          <div class="build-item-wrap d-flex align-center">
            <img v-for="(url, j) in timeline.itemUrls" :key="j" :src="url" alt="" class="build-item-icon">        
          </div>      
          <div v-if="i !== (itemIcons.length - 1)" class="build-item-next d-flex justify-center align-center">
            <v-icon color="grey">
              mdi-chevron-down mdi-rotate-270
            </v-icon>
          </div>
        </div>
        <div class="text-center build-type pr-7 pt-1 pb-1"> {{ timeline.timestamp - 1 }}분 </div>
      </div>
    </v-sheet>

    <v-sheet height="35" class="d-flex align-center" color="#282830">
      <span class="ml-2 build-type"> 스킬 빌드 </span>
    </v-sheet>

    <div class="build-divider"></div>

    <v-sheet class="d-flex align-center flex-wrap" color="subcontent pl-4 pt-4">
      <div v-for="(spell, i) in skillMasterSequence" :key="i" class="d-flex align-center">
        <div class="spells">
          <img class="spell-img" :src="spellIcons[Number(spell) - 1]" alt="">             
          <div class="spell-type" :style="getSpellStyle(spellEnum[spell])">
            {{ spellEnum[spell]}}
          </div>
        </div>
        <div v-if="i !== 2">
          <v-icon color="grey">
            mdi-chevron-down mdi-rotate-270
          </v-icon>
        </div>
      </div>
    </v-sheet>

    <v-sheet class="d-flex align-center flex-wrap" color="subcontent pl-4">   
      <div v-for="(spell, i) in skillSequence" :key="i" class="d-flex align-center">
        <div class="spells mt-2">
          <div :style="getSpellStyle(spell)" class="spell-sequence d-flex align-center justify-center">
            {{spell}}
          </div>
        </div>    
      </div>
    </v-sheet>

    <v-sheet height="35" class="d-flex align-center" color="#282830">
      <span class="ml-2 build-type"> Rune </span>
    </v-sheet>

    <div class="build-divider"></div>

    <v-sheet color="subcontent pl-4 rune-build">  
      <div class="d-flex justify-center">

        <div class="rune-imags-primary">
          <div class="d-flex rune-phase justify-center mb-1">
            <v-avatar size="30" color="#000000">
              <v-img         
                class="rune-type"   
                rounded="md"              
                :src="runeTypeIcons[0]"
              ></v-img>            
            </v-avatar>   
          </div>
          <div v-for="(icons, i) in primaryIcons" :key="i" class="d-flex rune-phase justify-space-between">
            <div v-for="(icon, j) in icons" :key="j">
              <img class="rune-img" :src="icon" alt="" >
            </div>            
          </div>  
          <div class="text-center mt-2">
            <span> 스텟1 </span>
          </div>      
        </div> 

        <div class="rune-divider"></div>

        <div class="rune-imags-sub">
          <div class="d-flex rune-phase justify-center mb-1" >
            <v-avatar size="30" color="#000000">
              <v-img               
                class="rune-type"
                rounded="md"              
                :src="runeTypeIcons[1]"
              ></v-img>            
            </v-avatar>          
          </div>
          <div v-for="(icons, i) in subIcons" :key="i" class="d-flex rune-phase justify-space-between">
            <div v-for="(icon, j) in icons" :key="j">
              <img class="rune-img" :src="icon" alt="" >
            </div>                        
          </div>                  
          <div class="text-center mt-2">
            <span> 스텟2 </span>
          </div>      
        </div> 

        <div class="rune-divider"></div>

        <div class="rune-imags-prgment">       
          <div v-for="(stats, i) in statIcons" class="d-flex rune-phase justify-center" :key="i">
            <v-avatar 
              v-for="(stat, j) in stats" :key="j" 
              size="25" color="#2d2d36" :class="['prgment-img d-flex justify-center align-center', stat.class]" 
            >
              <img :src="`../../../public/${stat.img}.png`" alt="alt" class="prgment-img-content">
            </v-avatar>
          </div>   
          <div class="text-center mt-2">
            <span> 능력치 파편 </span>
          </div>      
        </div> 

      </div>      
    </v-sheet>
    
  </div>
</template>

<script>
import useSizeSetup from '@/tools/SizeSetup.vue'
import { computed, onMounted, ref } from 'vue'
import runeJSON from '@/assets/runesReforged.json'

export default {
  props: {
    match: Object
  },

  setup(props) {
    const { searchStore, funcs, urlConfig } = useSizeSetup()
    const itemIcons = ref([])
    const skillMasterSequence = ref([])
    const primaryIcons = ref([])
    const subIcons = ref([])
    const spellIcons = ref([])   
    const skillSequence = ref([]) 
    const stats = [
      [5008, 5005, 5007],
      [5008, 5002, 5003],
      [5001, 5002, 5003]
    ]

    const statIcons = computed(() => {
      const pickStats = Object.values(props.match.owner.perks.statPerks).reverse()
      return stats.map((stat, i) => stat.map(k => k === pickStats[i] ? {
        img: k + '-act',
        class: 'prgment-img-activate'
      } : {
        img: k + '-dis',
        class: ''
      }))
    })

    const runeTypeIcons = computed(() => createRuneUrls(props.match.owner.perks))

    const spellEnum = {
      '1': 'Q',
      '2': 'W',
      '3': 'E',
      '4': 'R'
    }

    function getSpellStyle (spell) {
      switch (spell) {
        case 'Q' : return { 'color': '#0393ff' } 
        case 'W' : return { 'color': '#07d2ac' }
        case 'E' : return { 'color': '#ff7922' }
        default :  return { 'color': '#fff', 'background-color': '#5383e8'}
      }        
    }

    function createRuneUrls(perks) {
      const mainObj =  runeJSON.find(mainRune => mainRune.id === perks.styles[0].style)      
      const subObj = runeJSON.find(subRune => subRune.id === perks.styles[1].style)

      return [`${urlConfig.imgUrl}/img/${mainObj.icon}`, `${urlConfig.imgUrl}/img/${subObj.icon}`]
    }
    
    onMounted(async () => {      
      const { ownerItemTimeLine, ownerSkillTimeLine } = await searchStore.searchBuild(props.match)
      spellIcons.value= await funcs.createSpellIconUrl(urlConfig.imgUrl, searchStore.iconCdnVersion, props.match.owner.championName)
      itemIcons.value = ownerItemTimeLine
      skillSequence.value = ownerSkillTimeLine.map(skill => spellEnum[skill])
                  
      const result = ownerSkillTimeLine.map(skill => skill)
                          .reduce((acc, cur) => {
                            acc[cur] = acc[cur] + 1
                            if(acc[cur] === 5) {
                              skillMasterSequence.value.push(cur)
                              delete acc[cur]
                            }
                            return acc
                          }, {'1': 0, '2': 0, '3': 0, '4': 0})
      delete result['4']
      skillMasterSequence.value = skillMasterSequence.value.concat(Object.keys(result))            

      const [ primary, sub ] = props.match.owner.perks.styles      
          
      const ownerPrimary = primary.selections.map((selection, i) => ({
        perkId: selection.perk,        
      }))

      const ownerSub = sub.selections.map((selection, i) => ({
        perkId: selection.perk,        
      }))

      const slots = runeJSON.map(rune => rune.slots)
                              .flat()
                                .map(slot => slot.runes)
                                  .flat()      
            
      const primaryFinded = []
      const subFinded = []

      ownerPrimary.forEach(particle => primaryFinded.push(slots.find(slot => slot.id === particle.perkId)))
      ownerSub.forEach(particle => subFinded.push(slots.find(slot => slot.id === particle.perkId)))

      const [ primaryMain, primarySub ] = [primaryFinded[0], primaryFinded.slice(1, )]      
      const subMain = subFinded
                  
      primaryIcons.value = runeJSON.find(rune => String(rune.id).substr(0, 2) === String(primaryMain.id).substr(0, 2)).slots
                              .map(slot => slot.runes)
                                .map(slot => slot.map(rune => `${urlConfig.imgUrl}/img/${rune.icon}`))

      subIcons.value = runeJSON.find(rune => String(rune.id).substr(0, 2) === String(subMain[0].id).substr(0, 2)).slots
                                  .map(slot => slot.runes)
                                    .map(slot => slot.map(rune => `${urlConfig.imgUrl}/img/${rune.icon}`))       
                                      .slice(1)
    })

    return {
      itemIcons,
      skillMasterSequence,
      skillSequence,
      spellIcons,
      searchStore,
      spellEnum,
      getSpellStyle,

      primaryIcons,
      subIcons,
      runeTypeIcons,
      statIcons,

      createRuneUrls,

    }
  }
}
</script>

<style>
.build-item-icon {
  width: 30px;
  height: 30px;    
  margin-left: 4px;
  margin-right: 4px;
}

.build-type {
  font-size: 12px;
  letter-spacing: .01rem;
  opacity: .6;
  font-weight: 200;
}

.build-divider {
  height: 1px;
  background-color: #121212;
}

.build-item-wrap {
  background-color: #282830;  
  border-radius: 10px;  
  height: 40px;  
}

.build-item-next {
  background-color: #282830;  
  
  height: 30px;
  width: 30px;
}

.spell-img {
  height: 35px;
  width: 35px;
}

.spells {
  position: relative;
}

.spell-type {
  position: absolute;
  bottom: 0px;
  right: 0px;
  margin-bottom: 5px;
  font-size: 13px;
  height: 15px;
  width: 15px;
  font-weight: bold;
  text-align: center;
  line-height: 13px;
  background-color: #222e38;
}

.spell-sequence {
  margin-bottom: 5px;
  height: 20px;
  width: 20px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  line-height: 12px;
  font-weight: bold;
  justify-content: center;
  background-color: #222e38;
  border-radius: 3px;
  margin-left: 2px;
  margin-right: 2px;
}

.rune-build {
  height: 250px;
  font-size: 12px;
  color: #9e9eb1 !important;
}

.rune-type {
  width: 20px;
  height: 20px;
}

.rune-phase {
  width: 140px;
}

.rune-imags-primary {
  padding-top: 30px;
  min-width: 150px;
}

.rune-imags-sub {
  padding-top: 68px;  
  min-width: 150px;
}

.rune-imags-prgment {
  padding-top: 95px;    
}

.rune-img--active {
  -webkit-filter: grayscale(0%);
  filter: grayscale(0%);  
}

.rune-img {
  height: 28px;
  width: 28px;
  margin-top: 5px;
  -webkit-filter: grayscale(100%);
  filter: grayscale(100%);
}

.prgment-img {
  margin-right: 10px;
  margin-left: 10px;
  height: 25px;
  width: 25px;
  margin-top: 15px;  
}

.prgment-img-content {
  height: 22px;
  width: 22px;
}

.prgment-img-activate {
  outline: 1px solid #bb9834;
}

.rune-divider {  
  width: .8px;
  height: 190px;
  margin-top: 20px;
  background-color: black;
  margin-left: 10px;
  margin-right: 10px;

}


</style>