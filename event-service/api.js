const mapper = require('./mapper')
const eventMapper = require('./event-mapper')
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const eventCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })

const api = {}

setInterval(async () => {
    const footballEvents = await getEvents('FOOTBALL')
    eventCache.flushAll()
    eventCache.set('FOOTBALL', footballEvents)
}, 60000)

api.getEventsBySport = async (sport) => {
    return eventCache.get(sport.toUpperCase())
}

async function getEvents(sport) {
    const requests = [
        getEventsByProviderAndBookAndSport('kambi', 'unibet_belgium', sport),
        getEventsByProviderAndBookAndSport('sbtech', 'betfirst', sport),
        getEventsByProviderAndBookAndSport('altenar', 'goldenpalace', sport),
        getEventsByProviderAndBookAndSport('bet90', 'bet90', sport),
        getEventsByProviderAndBookAndSport('betcenter', 'betcenter', sport),
        getEventsByProviderAndBookAndSport('circus', 'circus', sport),
        getEventsByProviderAndBookAndSport('goldenvegas', 'goldenvegas', sport)
    ]

    let results

    await Promise.all(requests).then(values => {
        results = eventMapper.map(values)
    })

    return results
}

api.getBetOffers = async (provider, book, eventId) => {
    const providerApi = require('./providers/' + provider + '/' + provider + '.js')
    return providerApi.getBetOffersForBookAndEventId(book, eventId)
}

api.getEventsByProviderAndBookAndSport = async (provider, book, sport) => {
    return getEventsByProviderAndBookAndSport(provider, book, sport)
}

api.getParticipantsForProviderAndBookAndCompetition = async (provider, book, competition) => {
    return getParticipantsForProviderAndBookAndCompetition(provider, book, competition)
}

api.getParticipantsByCompetition = async (competition) => {
    const requests = [
        getParticipantsForProviderAndBookAndCompetition('kambi', 'unibet_belgium', competition),
        getParticipantsForProviderAndBookAndCompetition('sbtech', 'betfirst', competition)
    ]

    let results

    await Promise.all(requests).then(values => {
        results = mapper.map(values)
    })

    return results
}

async function getParticipantsForProviderAndBookAndCompetition(provider, book, competition) {
    const providerApi = require('./providers/' + provider + '/' + provider + '.js')
    participants = await providerApi.getParticipantsForCompetition(book, competition)
    return {provider: provider, book: book, competition: competition, participants: participants.flat().filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)}
}

async function getEventsByProviderAndBookAndSport(provider, book, sport) {
    const providerApi = require('./providers/' + provider + '/' + provider + '.js')
    const events = await providerApi.getEventsForBookAndSport(book, sport)
    return {provider: provider, book: book, events: events}
}

module.exports = api