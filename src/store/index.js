import { defineStore } from 'pinia'
import { urlConfig } from '../tools/divice.js'
import axios from 'axios'

const API_KEY = 'RGAPI-705c8181-72be-44ab-b86c-abd3a49e9abf'

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
    tryLoad: false,
    tempMatches: []
   }),  
  actions: {

    async searchContent(name) {           
      this.tryLoad = true 
      this.userInfoLoaded = true
      this.isRankGame = false
            
      const encodedName = encodeURI(name.trim())
      const idRes = await axios.get(`${urlConfig.baseUrl}/lol/summoner/v4/summoners/by-name/${encodedName}?api_key=${API_KEY}`)
      const { accountId, summonerLevel, profileIconId, id, revisionDate, puuid } = idRes.data
      

      // get league entries in all queues for a given summoner ID
      let leagueRes = await axios.get(`${urlConfig.baseUrl}/lol/league/v4/entries/by-summoner/${id}?api_key=${API_KEY}`)
      let queueType = 0
      let rank = 0
      let tier = 0
      let leaguePoints = 0
      let wins = 0
      let losses = 0
      
      if(leagueRes.data[0]) {
        queueType = leagueRes.data[0].queueType
        rank = leagueRes.data[0].rank
        tier = leagueRes.data[0].tier
        leaguePoints = leagueRes.data[0].leaguePoints
        wins = leagueRes.data[0].wins
        losses = leagueRes.data[0].losses
      }
      
      if (queueType === 'RANKED_SOLO_5x5') this.isRankGame = true
      
      const start = 0
      const count = REQUEST_COUNT
      const matchListRes = await axios.get(`${urlConfig.asiaUrl}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${API_KEY}`)      
      const matchIdUrls = matchListRes.data.map(matchId => `${urlConfig.asiaUrl}/lol/match/v5/matches/${matchId}?api_key=${API_KEY}`)
      
      await axios.all(matchIdUrls.map(match => axios.get(match))).then(reses => {
        this.matches = reses.map(res => {
          const { gameMode, participants, gameDuration, gameEndTimestamp, teams, queueId } = res.data.info          
          
          // insert items url object key
          participants.forEach(participant => {
            participant.itemUrls = Array.from({length: 7}).map((_, i) => participant[`item${i}`])
            participant.totalMinionsKilled = participant.totalMinionsKilled + participant.neutralMinionsKilled
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
            queueId,
            teams,
            owner
          }
        })
      })

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
      this.tempMatches = this.matches.slice()

    },

    filterMatches (type) {      
      if(type == 'ALL') {
        this.matches = this.tempMatches
        return
      }

      if(type == 'SOLORANK') {
        const filtered = this.tempMatches.filter(match => match.queueId == 420)      
        this.matches = filtered.length !== 0 ? filtered : this.tempMatches
        return
      }
      const filtered = this.tempMatches.filter(match => match.gameMode === type)      
      this.matches = filtered.length !== 0 ? filtered : this.tempMatches
    },

    async setupUserIconCDN() {
      const res = await axios.get('https://ddragon.leagueoflegends.com/api/versions.json')
      this.iconCdnVersion = res.data[0]      
      console.log(this.iconCdnVersion = res.data[0])     
    },

    

  },

  updateState(payload) {
    Object.entries(payload).forEach(state => {
      this[state[0]] = state[1]
    })
  }
})


