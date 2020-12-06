const axios = require('axios')

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

event.getEvents = async (book, sports) => {
        
    if(sports && Array.isArray(sports)) {
        const sportsUpperCase = sports.map(sport => sport.toUpperCase())
        return resolve(Object.entries(requests).filter(pair => sportsUpperCase.includes(pair[0])).map(pair => createRequest(pair[1].id)))
    } else if(sports) {
        return resolve(Object.entries(requests).filter(pair => sports.toUpperCase() === pair[0]).map(pair => createRequest(pair[1].id)))
    } else {
        return resolve(Object.values(requests).map(id => createRequest(id.id)))
    }
}

function createRequest(id) {
    return axios.get('https://guest.api.arcadia.pinnacle.com/0.1/sports/' + id + '/matchups', options).then(response => transform(response.data)).catch(error => null)
}

function transform(events) {
    return events.map(event => { return {id: event.id, startTime: event.startTime, sport: event.league.sport.name, league: event.league.name, participants: event.participants.map(participant => participant.name)}})
}

async function resolve(requests) {
    let events
    await Promise.all(requests).then((values) => {
        events = values
    })
    return events
}

module.exports = event