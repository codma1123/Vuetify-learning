<template>
  <v-app-bar
    color="secondary"    
    elevation="0"    
    :height="appBarHeight"    
  >  
    <v-row>
      <v-sheet               
        color="primary"             
        :height="appBarHeight" width="100" class="d-flex justify-center align-center">
        <span class="font-weight-bold">{{ appBarTitle }}</span>
      </v-sheet>      
    </v-row>

    <v-btn icon @click="toggleTheme">
      <v-icon 
        small
        theme="dark"
      >{{ themeIcon }}</v-icon>
    </v-btn>
    <v-card color="primary" class="mx-auto">        
      <v-btn height="30">
        로그인
      </v-btn>
    </v-card>
    
  </v-app-bar>
</template>

<script>
import { useDisplay, useTheme } from 'vuetify'
import { useRouter } from 'vue-router'

export default {  
  setup() {
    const { name } = useDisplay() 
    const theme = useTheme()
    const router = useRouter()

    const appBarTitle = '오승딱.GG'
    const appBarHeight = 40
    const themeIcon = 'mdi-theme-light-dark'
        
    return {
      appBarTitle,
      appBarHeight,
      theme,
      themeIcon,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'myCustomDarkTheme',

      router,      
    }
  }
}
</script>

<style>

</style>