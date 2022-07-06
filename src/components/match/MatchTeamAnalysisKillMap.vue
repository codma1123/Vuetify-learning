<template>
  <div class="d-flex justify-center">  
    <img src="http://ddragon.leagueoflegends.com/cdn/6.8.1/img/map/map11.png" class="minimap" alt="">
  </div>
</template>

<script>
import useSizeSetup from '@/tools/SizeSetup.vue'
import { onMounted } from 'vue'

export default {
  props: {
    match: Object
  },
  setup() {
    const { searchStore } = useSizeSetup()
    const MAP_MAX_SCALE = 14000
    const MAP_SCALE = 350

    function createDotPositions () {
      console.log(
        searchStore.killMap.map(kill => kill.position.map(position => convertScale(position.position)))
      )
    }

    const convertScale = (position) => ({
      xScale: ( MAP_SCALE / MAP_MAX_SCALE) * Number(position.x),
      yScale: ( MAP_SCALE / MAP_MAX_SCALE) * Number(position.y)
    })

    onMounted(() => {      
      createDotPositions()
    })


    return {
      
    }
  }
}
</script>

<style>
.minimap {
  border-radius: 20px;
  height: 350px;
  width: 350px;  
  object-fit: cover;
  object-position: 20% 10%; 
  filter: opacity(.4) drop-shadow(0 0 0 rgb(32, 45, 55));  
}
</style>