import { defineStore } from 'pinia'
import axios from 'axios'

const API_KEY = 'RGAPI-45b4022d-9cbb-4149-b65b-f3d3878436e8'
const HEADER = {
  headers: {
    'Content-Type': 'text/plain;charset=utf-8',
    'Access-Control-Allow-Oirign': '*',
    'Access-control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers' : "Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method"      
  }
}

const config = {
  baseUrl: 'https://kr.api.riotgames.com',
  asiaUrl: 'https://asia.api.riotgames.com'
}

export const useSearchStore = defineStore('search', {
  state: () => ({ 
    user: {

    },
    matches: [],
    userInfoLoaded: false,
    iconCdnVersion: '',
    iconUrl: ''
   }),  
  actions: {
    async searchContent(name) {      

      this.userInfoLoaded = true
      
      //
      const idRes = await axios.get(`${config.baseUrl}/lol/summoner/v4/summoners/by-name/${name}?api_key=${API_KEY}`)
      const { accountId, summonerLevel, profileIconId, id, revisionDate, puuid } = idRes.data

      // get league entries in all queues for a given summoner ID
      const leagueRes = await axios.get(`${config.baseUrl}/lol/league/v4/entries/by-summoner/${id}?api_key=${API_KEY}`)
      const { queueType, rank, tier, leaguePoints } = leagueRes.data[0]
      
      const start = 0
      const count = 5
      // const matchListRes = await axios.get(`${config.asiaUrl}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${API_KEY}`)      
      // const matchIdUrls = matchListRes.data.map(matchId => `${config.asiaUrl}/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`)
      
      // await axios.all(matchIdUrls.map(match => axios.get(match))).then(reses => {
      //   this.matches = reses.map(res => res.data)
      // })

      // console.log(this.matches)
      console.log(leagueRes.data)
    
      "https://asia.api.riotgames.com/lol/match/v5/matches/KR_5973078693?api_key=RGAPI-8f7f4b4d-c57e-412c-b636-820239b0b60f"

      "https://asia.api.riotgames.com/lol/match/v5/matches/KR_5973078693?api_key=RGAPI-8f7f4b4d-c57e-412c-b636-820239b0b60f"

      this.user = { 
        summonerLevel,
        queueType, 
        rank, 
        tier, 
        leaguePoints,
        profileIconId,
        tiers: [],
        bookmarked: false
      }      
      this.iconUrl = `https://ddragon.leagueoflegends.com/cdn/${this.iconCdnVersion}/img/profileicon/${profileIconId}.png`     
      this.userInfoLoaded = false
    },

    async setupUserIconCDN() {
      const res = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
      this.iconCdnVersion = res.data[0]      
    }
  },

  updateState(payload) {
    Object.entries(payload).forEach(state => {
      this[state[0]] = state[1]
    })
  }
})


