const axios = require('axios')
const leagues = require('./resources/leagues.json')
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const eventCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })


const options = {
    headers: {
        'X-API-KEY': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R'
    }
}
const requests = {
    'FOOTBALL': 29,
    'BASKETBALL': 4,
    'AMERICAN_FOOTBALL': 15,
    'TENNIS': 33,
    'ESPORTS': 12,
    'MMA': 22,
    'BASEBALL': 3,
    'AUSSIE_RULES': 39,
    'BOXING': 6,
    'CRICKET': 8,
    'GOLF': 17,
    'ICE_HOCKEY': 19,
    'RUGBY_LEAGUE': 26,
    'RUGBY_UNION': 27,
    'SNOOKER': 28,
    'DARTS': 10
}

const event = {}

event.getParticipantsForCompetition = async (book, competition) => {
    const id = leagues.filter(league => league.name === competition.toUpperCase()).map(league => league.id)
    const url = 'https://guest.api.arcadia.pinnacle.com/0.1/leagues/' + id + '/matchups'
    return await axios.get(url, options).then(response => response.data.filter(event => !event.parentId).map(event => event.participants.map(participant => {return {id: participant.name.toUpperCase(), name: participant.name.toUpperCase()}}))).catch(error => null)
}

event.getEventsForBookAndSport = async (book, sport) => {
    if(eventCache.get('EVENTS')) return eventCache.get('EVENTS')
    const events = await axios.get('https://guest.api.arcadia.pinnacle.com/0.1/sports/' + requests[sport.toUpperCase()] + '/matchups', options).then(response => transform(response.data)).catch(error => null)
    eventCache.set('EVENTS', events)
    return events
}

function transform(events) {
    return events.filter(event => event.participants.length === 2).map(event => { return {id: event.id, startTime: event.startTime, sport: event.league.sport.name, league: event.league.name, participants: event.participants.map(participant => participant.name)}})
}

module.exports = event