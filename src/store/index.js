import { defineStore } from 'pinia'
import { urlConfig } from '../tools/divice.js'
import funcs from '../tools/funcs.js'
import axios from 'axios'

const API_KEY = 'RGAPI-af7930ee-9242-453a-b316-fca2f277df11'

const API_KEYS = [
  'RGAPI-89d95ffc-7023-4b2f-be2b-8083b8bbdfd1',
  'RGAPI-8d145ff2-f5f3-43ad-9e38-0232dc06690f'
]

const REQUEST_COUNT = 15

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
    tempMatches: [],
    timeLineLoaded: false,
    timeLineValues: [],
    timeLineKills: [],
    killMap: [],
    recentTeams: [],
    timeLineLoadedFlag: false,

    buildLoading: false
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
      const recentTeams = []
            
      await axios.all(matchIdUrls.map(match => axios.get(match))).then(reses => {
        this.matches = reses.map((match, i) => {
          const { gameMode, participants, gameDuration, gameEndTimestamp, teams, queueId } = match.data.info  
          
          // insert items url object key
          participants.forEach(participant => {
            participant.itemUrls = Array.from({length: 7}).map((_, i) => participant[`item${i}`])
            participant.totalMinionsKilled = participant.totalMinionsKilled + participant.neutralMinionsKilled
          })

          // owner
          const owner = participants.find(participant => participant.summonerName === name)   
          const totalKills = teams.find(team => team.teamId == owner.teamId).objectives.champion.kills

          recentTeams.push(...participants.filter(participant => participant.teamId === owner.teamId)
                                            .map(participant => ({
                                              name: participant.summonerName,  
                                              icon: participant.profileIcon,          
                                              win: participant.win
                                            })))              
                                                      
          return { 
            gameMode,
            gameDuration,  
            gameEndTimestamp,    
            totalKills,     
            participants,   
            queueId,
            teams,
            owner,
            matchId: matchListRes.data[i]
          }
        })
        const cv = {}
        recentTeams.forEach(participant => cv[participant.name] = {win: 0, lose: 0, total: 0, icon: participant.icon})
        recentTeams.forEach(participant => {
          participant.win ? cv[participant.name].win++
                          : cv[participant.name].lose++
          cv[participant.name].total++          
        })        
        
        this.recentTeams = Object.entries(cv).sort((a, b) => b[1].total - a[1].total).slice(1, 6)
                    
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
      console.log(res.data[0])
    },

    async searchContentTimeLine(match) {
      this.timeLineLoaded = true
      const sort = !match.participants[0].win
    
      try {
        const res = await axios.get(`${urlConfig.asiaUrl}/lol/match/v5/matches/${match.matchId}/timeline?api_key=${API_KEY}`)        
        const timelines = res.data.info.frames.map(frame => {       
          const timeLine = (frame.timestamp / 60000).toFixed()
          if(sort) return {
            timeLine,
            totalGold: { 
              team1: Object.values(frame.participantFrames).slice(5, 10).reduce((totalGold, participantFrame) => totalGold + participantFrame.totalGold, 0),
              team2: Object.values(frame.participantFrames).slice(0, 5).reduce((totalGold, participantFrame) => totalGold + participantFrame.totalGold, 0)            
            },       
          } 
          return {
            timeLine,
            totalGold: { 
              team1: Object.values(frame.participantFrames).slice(0, 5).reduce((totalGold, participantFrame) => totalGold + participantFrame.totalGold, 0),
              team2: Object.values(frame.participantFrames).slice(5, 10).reduce((totalGold, participantFrame) => totalGold + participantFrame.totalGold, 0)            
            },   
          }                         
        })
                
        const killTimelines = res.data.info.frames.map(frame => {
          const killEvent = frame.events.filter(event => event.type === 'CHAMPION_KILL')         
          const timeLine = (frame.timestamp / 60000).toFixed()
          const killPosition = killEvent.map(kill => ({position: kill.position, killerId: kill.killerId, victimId: kill.victimId}))

          if(!killEvent.length) return {
            timeLine,
            killPosition,
            team1Kill: 0,
            team2Kill: 0,
          }

          if(sort) return {
            timeLine,
            killPosition,
            team1Kill: killEvent.filter(kill => kill.killerId > 5).length, 
            team2Kill: killEvent.filter(kill => kill.killerId < 6).length    
          }

          return {
            timeLine,
            killPosition,
            team1Kill: killEvent.filter(kill => kill.killerId < 6).length,
            team2Kill: killEvent.filter(kill => kill.killerId > 5).length    
          }
        })

        
        const championById = [...Array.from({length: 10}).map((_, i) => i + 1)].reduce((acc, cur, i) => {
          const { summonerName, championName, participantId } = match.participants.find(participant => participant.participantId == cur)
          acc[cur] = { 
            summonerName,
            championName,
            participantId,
            position: []
          }
          return acc
        }, {})
        
        
        killTimelines.forEach(timeline => {
          if(timeline.killPosition.length) {
            timeline.killPosition.forEach(position => {
              championById[position.killerId].position.push({
                position: position.position, 
                timeline: timeline.timeLine,
                victim: {
                  summonerName: championById[position.victimId].summonerName,
                  championName: championById[position.victimId].championName,
                }
              })                            
            })
          }
        })

        const positionArray = Object.values(championById)        
        const killMap = sort ? [...positionArray.slice(5, 10), ...positionArray.slice(0, 5)] : positionArray
                              
        const kill1 = []
        const kill2 = []
        killTimelines.map(timeline => timeline.team1Kill).reduce((prev, cur, i) => kill1[i] = prev + cur, 0)
        killTimelines.map(timeline => timeline.team2Kill).reduce((prev, cur, i) => kill2[i] = prev + cur, 0)
        const timeLineKills = killTimelines.map((timeline, i) => ({
          timeLine: timeline.timeLine,
          totalKill: {
            team1: kill1[i],
            team2: kill2[i]
          }
        }))

        this.timeLineLoaded = false
        this.timeLineLoadedFlag = true

        return {
          timelines,
          timeLineKills,
          killMap,          
          frames: res.data.info.frames
        }
      } catch (e){
        console.log(e)
      }             
    },

    async searchBuild (match) {
      try {
        this.buildLoading = true
  
        const res = await axios.get(`${urlConfig.asiaUrl}/lol/match/v5/matches/${match.matchId}/timeline?api_key=${API_KEY}`)

        const ownerItemTimeLine = []
        const ownerSkillTimeLine = []
        const ownerId = match.owner.participantId
        
        res.data.info.frames.forEach(frame => {          
          ownerItemTimeLine.push({
            timestamp: funcs.convertTimestampToMin(frame.timestamp),
            items: frame.events.filter(event => event.participantId === ownerId)
                                .filter(event => event.type === 'ITEM_PURCHASED')
                                  .map(event => ({timestamp: funcs.convertTimestampToMin(event.timestamp), itemId: event.itemId, type: event.type}))
          })

          ownerSkillTimeLine.push(
            frame.events.filter(event => event.participantId === ownerId)
                          .filter(event => event.type === 'SKILL_LEVEL_UP')
                            .filter(event => event.levelUpType === 'NORMAL')         
                              .map(event => event.skillSlot)                                                                       
          )                            
        })
              
        this.buildLoading = false
        
        return {
          ownerItemTimeLine: ownerItemTimeLine.filter(event => event.items.length !== 0).map(event => ({
            timestamp: event.timestamp,
            itemUrls: event.items.map(item => funcs.createItemIconUrl(urlConfig.imgUrl, this.iconCdnVersion, item.itemId))                                
          })),
          ownerSkillTimeLine: ownerSkillTimeLine.filter(event => event.length !== 0).flat(),

        }
  
      } catch (e){
        console.log(e)
      }
    },    

    async getRuneJson () {
      try {
        // https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json 
        // rune info US

        // https://ddragon.leagueoflegends.com/cdn/10.6.1/data/ko_KR/runesReforged.json
        // run info KR

        console.log(`${urlConfig.imgUrl}/${this.iconCdnVersion}/data/ko_KR/runesReforged.json`)
        const res = await axios.get(`${urlConfig.imgUrl}/${this.iconCdnVersion}/data/ko_KR/runesReforged.json`)

        return res.data


      } catch (e) {
        console.log(e)
      }
    }

  },

  updateState(payload) {
    Object.entries(payload).forEach(state => {
      this[state[0]] = state[1]
    })
  }
})


