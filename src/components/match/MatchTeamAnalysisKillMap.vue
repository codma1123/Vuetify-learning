<template>
  <div class="d-flex justify-center">  
    <img src="http://ddragon.leagueoflegends.com/cdn/6.8.1/img/map/map11.png" class="minimap" alt="">
  </div>
</template>

<script>
import useSizeSetup from '@/tools/SizeSetup.vue'

export default {
  props: {
    match: Object
  },
  setup() {
    const { searchStore } = useSizeSetup()


    return {

    }
  }
}
</script>

<style>
.minimap {
  border-radius: 20px;
  height: 250px;
  width: 250px;  
  object-fit: cover;
  object-position: 20% 10%; 
  filter: opacity(.4) drop-shadow(0 0 0 rgb(32, 45, 55));  
}
</style>