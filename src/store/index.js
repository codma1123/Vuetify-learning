import { defineStore } from 'pinia'
import axios from 'axios'

const API_KEY = 'RGAPI-8f7f4b4d-c57e-412c-b636-820239b0b60f'
const HEADER = {
  headers: {
    'Content-Type': 'text/plain;charset=utf-8',
    'Access-Control-Allow-Oirign': '*',
    'Access-control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers' : "Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method"      
  }
}

const config = {
  baseUrl: 'https://api.riotgames/'
}

export const useSearchStore = defineStore('search', {
  state: () => ({ 
    
   }),  
  actions: {
    async searchContent(name) {      

    const res = await axios.get(`${config.baseUrl}lol/summoner/v2/summoners/by-name/${name}`, HEADER)
    console.log(res)
      
    }
  },
})
