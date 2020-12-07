const axios = require('axios')
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const eventCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })


const options = {
    headers: {
        'X-API-KEY': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R'
    }
}
const requests = {
    'FOOTBALL': {
        id: 29
    },
    'BASKETBALL': {
        id: 4 
    },
    'AMERICAN_FOOTBALL': {
        id: 15
    },
    'TENNIS': {
        id: 33
    },
    'ESPORTS': {
        id: 12
    },
    'MMA': {
        id: 22
    },
    'BASEBALL': {
        id: 3
    },
    'AUSSIE_RULES': {
        id: 39
    },
    'BOXING': {
        id: 6
    },
    'CRICKET': {
        id: 8
    },
    'GOLF': {
        id: 17
    },
    'ICE_HOCKEY': {
        id: 19
    },
    'RUGBY_LEAGUE': {
        id: 26
    },
    'RUGBY_UNION': {
        id: 27
    },
    'SNOOKER': {
        id: 28
    },
    'DARTS': {
        id: 10
    }

}

const event = {}

event.getParticipants = async (league) => {
    const url = 'https://guest.api.arcadia.pinnacle.com/0.1/leagues/' + league + '/matchups'
    return await axios.get(url, options).then(response => response.data.map(event => event.participants.map(participant => {return {id: participant.name.toUpperCase(), name: participant.name.toUpperCase()}}))).catch(error => null)
}

event.getEventsForBookAndSport = async (book, sport) => {
    if(eventCache.get('EVENTS')) return eventCache.get('EVENTS')
    const events = await axios.get('https://guest.api.arcadia.pinnacle.com/0.1/sports/' + requests[sport.toUpperCase()].id + '/matchups', options).then(response => transform(response.data)).catch(error => null)
    eventCache.set('EVENTS', events)
    return events
}

function transform(events) {
    return events.filter(event => event.participants.length === 2).map(event => { return {id: event.id, startTime: event.startTime, sport: event.league.sport.name, league: event.league.name, participants: event.participants.map(participant => participant.name)}})
}

module.exports = event