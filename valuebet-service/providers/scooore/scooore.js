const axios = require('axios')
const leagues = require('./resources/leagues.json')
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const eventCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })


const sports = {
    "FOOTBALL": 1
}

const scooore = {}

scooore.getEventsForBookAndSport = async (book, sport) => {
    if(eventCache.get('EVENTS')) return eventCache.get('EVENTS')
    const requests = leagues.map(league => axios.get('https://www.e-lotto.be/cache/evenueMarketGroupLimited/NL/' + league.id + '.1-0.json').then(response => transform(response.data.markets, league)).catch(error => null))
    let results
    await Promise.all(requests).then(values => {
        results = values.flat()
        eventCache.set('EVENTS', results)
    })
    return results
}

scooore.getParticipantsForCompetition = async(book, competition) => {
    const league = leagues.filter(league => league.name === competition.toUpperCase())[0]
    console.log(league)
    return axios.get('https://www.e-lotto.be/cache/evenueMarketGroupLimited/NL/' + league.id + '.1-0.json').then(response => parseParticipants(response.data.markets, league)).catch(error => null)
}

function parseParticipants(events, league) {
    const parsedEvents = transform(events, league)
    return parsedEvents.map(event => event.participants)
}

function transform(events, league) {
    return events.map(event => {return {id: event.idfoevent, league: league.name, participants: [{id: event.participantname_home, name: event.participantname_home}, {id: event.participantname_away, name: event.participantname_away}]}})
}

module.exports = scooore