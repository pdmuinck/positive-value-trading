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
    return axios.get('https://www.e-lotto.be/cache/evenueMarketGroupLimited/NL/18340.1-0.json').then(response => response.data.markets).catch(error => null)
}

module.exports = event