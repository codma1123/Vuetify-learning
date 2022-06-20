import { defineStore } from 'pinia'

export const useLocalStore = defineStore('local', {
  state: () => ({ 
    count: 0
   }),
  getters: {
    
  },
  actions: {
    initLocalStorage() {
      window.localStorage.clear()
    }
  },
})
