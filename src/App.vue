<template>
  <v-app>
    <v-main>      
      <app-bar />
      <app-menu />
      <transition name="slide-fade" mode="out-in">          
        <router-view />
      </transition>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './views/AppBar.vue'
import AppMenu from './views/AppMenu.vue'
export default {
  name: 'App',
  components: {
    AppBar,
    AppMenu
  }
}
</script>


<style>
::-webkit-scrollbar {
  display: none;
}

/* .slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;
}
.slide-fade-enter-active
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
} */

.fade-enter {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}

.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.2s ease;
}

.slide-fade-leave-to {
  transform: translateX(-10px);
  opacity: 0;
}

</style>