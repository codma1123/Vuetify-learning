import { defineStore } from 'pinia'
import { urlConfig } from '../tools/divice.js'
import axios from 'axios'

const API_KEY = 'RGAPI-fada49f3-96cc-47c2-80a3-f06dcd6aadaa'

const API_KEYS = [
  'RGAPI-89d95ffc-7023-4b2f-be2b-8083b8bbdfd1',
  'RGAPI-8d145ff2-f5f3-43ad-9e38-0232dc06690f'
]

const REQUEST_COUNT = 10

const HEADER = {
  headers: {
    'Content-Type': 'text/plain;charset=utf-8',
    'Access-Control-Allow-Oirign': '*',
    'Access-control-Allow-Methods' : 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers' : "Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method"      
  }
}

export const useSearchStore = defineStore('search', {
  state: () => ({ 
    user: {},
    matches: [],
    userInfoLoaded: false,
    loadComplate: false,
    iconCdnVersion: '',
    iconUrl: '',
    isRankGame: false,
    tryLoad: false
   }),  
  actions: {

    async searchContent(name) {           
      this.tryLoad = true 
      this.userInfoLoaded = true
      this.isRankGame = false
            
      const encodedName = encodeURI(name.trim())
      const idRes = await axios.get(`${urlConfig.baseUrl}/lol/summoner/v4/summoners/by-name/${encodedName}?api_key=${API_KEY}`)
      const { accountId, summonerLevel, profileIconId, id, revisionDate, puuid } = idRes.data
      console.log(id)

      // get league entries in all queues for a given summoner ID
      let leagueRes = await axios.get(`${urlConfig.baseUrl}/lol/league/v4/entries/by-summoner/${id}?api_key=${API_KEY}`)
      
      const { queueType, rank, tier, leaguePoints, wins, losses } = leagueRes.data[0]
      
      if (queueType === 'RANKED_SOLO_5x5') this.isRankGame = true
      
      const start = 0
      const count = REQUEST_COUNT
      const matchListRes = await axios.get(`${urlConfig.asiaUrl}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${API_KEY}`)      
      const matchIdUrls = matchListRes.data.map(matchId => `${urlConfig.asiaUrl}/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`)
      
      await axios.all(matchIdUrls.map(match => axios.get(match))).then(reses => {
        this.matches = reses.map(res => {
          const { gameMode, participants, gameDuration, gameEndTimestamp, teams } = res.data.info          
          
          // insert items url object key
          participants.forEach(participant => {
            participant.itemUrls = Array.from({length: 7}).map((_, i) => participant[`item${i}`])
          })

          // owner
          const owner = participants.find(participant => participant.summonerName === name)          
          
          const totalKills = teams.find(team => team.teamId == owner.teamId).objectives.champion.kills

                                                          
          return { 
            gameMode,
            gameDuration,  
            gameEndTimestamp,    
            totalKills,     
            participants,   
            teams,

            owner
          }
        })
      })

      "https://asia.api.riotgames.com/lol/match/v5/matches/KR_5973078693?api_key=RGAPI-8f7f4b4d-c57e-412c-b636-820239b0b60f"

      "https://asia.api.riotgames.com/lol/match/v5/matches/KR_5973078693?api_key=RGAPI-8f7f4b4d-c57e-412c-b636-820239b0b60f"

      this.user = { 
        summonerLevel,
        queueType, 

        rank, 
        tier, 
        wins,
        losses,
        leaguePoints,

        profileIconId,
        tiers: [],
        bookmarked: false
      }      
      this.iconUrl = `${urlConfig.imgUrl}/${this.iconCdnVersion}/img/profileicon/${profileIconId}.png`     


      // done phase
      this.userInfoLoaded = false
      this.loadComplate = true

    },

    async setupUserIconCDN() {
      const res = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
      this.iconCdnVersion = res.data[0]      
      console.log(this.iconCdnVersion = res.data[0]      )      
    }
  },

  updateState(payload) {
    Object.entries(payload).forEach(state => {
      this[state[0]] = state[1]
    })
  }
})


