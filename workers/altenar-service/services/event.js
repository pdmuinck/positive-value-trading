const axios = require('axios')
const leagues = require('../resources/leagues.json')

const sports = {
    "FOOTBALL": 1
}

const event = {}

event.getParticipants = async (league) => {
    const payload = {"leagueIds":[parseInt(league)],"gameTypes":[7],"jurisdictionId":30}
    return axios.post('https://oddsservice.betcenter.be/odds/getGames/8', payload, betcenterHeaders).then(response => parseParticipants(response.data)).catch(error => null)
}

function parseParticipants(events) {
    return events.games.map(event => event.teams.map(team => {return {id: team.id, name: team.name}}))
}

event.getEvents = async (book, selectedSports) => {
    return sports.map(sport => axios.get('https://sb1capi-altenar.biahosted.com/Sportsbook/GetEvents?timezoneOffset=-120&langId=1&skinName=' + book +'&configId=1&culture=en&countryCode=BE&deviceType=Mobile&numformat=en&sportids={sportId}&categoryids=0&group=AllEvents&period=periodall&withLive=true&outrightsDisplay=none&couponType=0&startDate=2020-04-11T08%3A28%3A00.000Z&endDate=2200-04-18T08%3A28%3A00.000Z'.replace('{sportId}', sport)).then(response => {return {provider: 'ALTENAR', events: response.data.Result.Items[0].Events}}).catch(error => null))
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