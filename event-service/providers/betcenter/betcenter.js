const axios = require('axios')
const leagues = require('./leagues')
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const eventCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })


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
        "x-language": 2,
        "x-brand": 7,
        "x-location": 21,
        "x-client-country": 21,
        "Content-Type":"application/json"
    }
}

const betcenter = {}

betcenter.getParticipantsForCompetition = async(book, competition) => {
    const league = leagues.filter(league => league.name === competition.toUpperCase()).map(league => league.id)
    console.log(league)
    const payload = {"leagueIds":league,"gameTypes":[7],"jurisdictionId":30}
    return axios.post('https://oddsservice.betcenter.be/odds/getGames/8', payload, betcenterHeaders).then(response => parseParticipants(response.data)).catch(error => null)
}

function parseParticipants(events) {
    return events.games.map(event => event.teams.map(team => {return {id: team.id, name: team.name}}))
}

betcenter.getEventsForBookAndSport = async(book, sport) => {
    if(eventCache.get('EVENTS')) return eventCache.get('EVENTS')
    const requests = leagues.map(league => {
        const betcenterPayload = {"leagueIds": [league.id], "sportId":sports[sport.toUpperCase()],"gameTypes":[1, 4],"limit":20000,"jurisdictionId":30}
        return axios.post('https://oddsservice.betcenter.be/odds/getGames/8', betcenterPayload, betcenterHeaders).then(response => transform(response.data.games)).catch(error => null)
    })
    let events = []
    await Promise.all(requests).then(values => {
        events = values.flat()
        eventCache.set('EVENTS', events)
    })
    return events
}

function transform(games) {
    return games.map(game => {return {id: game.id, participants: game.teams.map(team => {return {id: team.id, name: team.name}})}})
}

module.exports = betcenter