const axios = require('axios')
const leagues = require('../resources/leagues.json')

const sports = {
    "FOOTBALL": 1,
    "TENNIS": 2,
    "ICE_HOCKEY": 10,
    "BASKETBALL": 12,
    "VOLLEYBALL": 23,
    "AMERICAN_FOOTBALL": 6,
    "AUSSIE_RULES": 43,
    "BASEBALL": 11,
    "BOXING": 7,
    "CRICKET": 70,
    "DARTS": 32,
    "ESPORTS": 91,
    "MMA": 100,
    "RUGBY": 18,
    "SNOOKER": 36
}

const betcenterHeaders = {
    headers: {
        "Connection": "keep-alive",
        "Accept": "application/json, text/plain, */*",
        "x-language": 2,
        "x-brand": 7,
        "x-location": 21,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
        "x-client-country": 21,
        "Content-Type":"application/json",
        "Origin": "https://www.betcenter.be",
        "Accept-Language": "en-US,en;q=0.9"
    }
}

const event = {}

event.getParticipants = async (league) => {
    const payload = {"leagueIds":[parseInt(league)],"gameTypes":[7],"jurisdictionId":30}
    return axios.post('https://oddsservice.betcenter.be/odds/getGames/8', payload, betcenterHeaders).then(response => parseParticipants(response.data)).catch(error => null)
}

function parseParticipants(events) {
    return events.games.map(event => event.teams.map(team => {return {id: team.id, name: team.name}}))
}

event.getEvents = async (selectedSports) => {
    if(selectedSports && Array.isArray(selectedSports)) {
        const selectedSportsToUpperCase = selectedSports.map(sport => sport.toUpperCase())
        const sportIds = Object.entries(sports).filter(pair => selectedSportsToUpperCase.includes(pair[0]).map(pair => pair[1]))
        const betcenterPayload = {"sportId":sportIds,"gameTypes":[1, 4],"limit":20000,"jurisdictionId":30}
        return axios.post('https://oddsservice.betcenter.be/odds/getGames/8', betcenterPayload, betcenterHeaders).then(response => {return {provider: 'BETCENTER', events: response.data.games}}).catch(error => null)
    } else if(selectedSports) {
        const sportId = Object.entries(sports).filter(pair => selectedSports.toUpperCase() === pair[0]).map(pair => pair[1])
        const betcenterPayload = {"sportId":sportId[0],"gameTypes":[1, 4],"limit":20000,"jurisdictionId":30}
        return axios.post('https://oddsservice.betcenter.be/odds/getGames/8', betcenterPayload, betcenterHeaders).then(response => {return {provider: 'BETCENTER', events: response.data.games}}).catch(error => null)
    } else {
        const betcenterPayload = {"sportId":Object.values(sports),"gameTypes":[1, 4],"limit":20000,"jurisdictionId":30}
        return axios.post('https://oddsservice.betcenter.be/odds/getGames/8', betcenterPayload, betcenterHeaders).then(response => {return {provider: 'BETCENTER', events: response.data.games}}).catch(error => null)
    }
}

module.exports = event