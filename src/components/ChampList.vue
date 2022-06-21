<template>
  <v-card      
    class="mt-5"         
    rounded="md"
    color="subcontent"
    height="1000"
    :width="width"
  >    
    <v-card-title>
      <champ-search-bar />
    </v-card-title>

    <v-btn-toggle>
      <!-- <v-btn v-for="(filter, i) in filters">

      </v-btn> -->   
      <v-btn>
        <v-icon >mdi-star</v-icon>
      </v-btn>   
    </v-btn-toggle>

    
  </v-card>  
</template>

<script>
import { onMounted } from 'vue'
import ChampSearchBar from './ChampSearchBar.vue'
import { useRtl } from 'vuetify'

export default {
  props: {
    width: Number
  },
  components: {
    ChampSearchBar
  },
  setup(props) { 
    const rtl = useRtl()
    
    onMounted(() => {
      console.log(props.width, 'ss')
      console.log(rtl)
      
    })    
  }
}
</script>

<style>

</style>