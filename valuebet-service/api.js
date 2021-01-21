const mapper = require('./mapper')
const eventMapper = require('./event-mapper')
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const eventCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })

const api = {}

api.getEventsBySport = async (sport) => {
    return getEvents(sport)
}

async function getEvents(sport) {
    if(eventCache.get(sport.toUpperCase())) return eventCache.get(sport.toUpperCase())
    const requests = [
        getEventsByProviderAndBookAndSport('kambi', 'unibet_belgium', sport),
        getEventsByProviderAndBookAndSport('sbtech', 'betfirst', sport),
        getEventsByProviderAndBookAndSport('altenar', 'goldenpalace', sport),
        getEventsByProviderAndBookAndSport('betconstruct', 'circus', sport),
        getEventsByProviderAndBookAndSport('bet90', 'bet90', sport),
        getEventsByProviderAndBookAndSport('betcenter', 'betcenter', sport),
        getEventsByProviderAndBookAndSport('ladbrokes', 'ladbrokes', sport),
        getEventsByProviderAndBookAndSport('magicbetting', 'magicbetting', sport),
        getEventsByProviderAndBookAndSport('meridian', 'meridian', sport),
        getEventsByProviderAndBookAndSport('pinnacle', 'pinnacle', sport),
        getEventsByProviderAndBookAndSport('scooore', 'scooore', sport),
        getEventsByProviderAndBookAndSport('starcasino', 'starcasino', sport),
        getEventsByProviderAndBookAndSport('stanleybet', 'stanleybet', sport),
        getEventsByProviderAndBookAndSport('betway', 'betway', sport),
    ]

    let results

    await Promise.all(requests).then(values => {
        results = eventMapper.map(values)
    })
    eventCache.set(sport.toUpperCase(), results)
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
    //const league = require('./participants/' + competition.toUpperCase() + '.json')
    //if(league) return league
    const requests = [
        getParticipantsForProviderAndBookAndCompetition('kambi', 'unibet_belgium', competition),
        getParticipantsForProviderAndBookAndCompetition('sbtech', 'betfirst', competition),
        getParticipantsForProviderAndBookAndCompetition('pinnacle', 'pinnacle', competition),
        getParticipantsForProviderAndBookAndCompetition('altenar', 'goldenpalace', competition),
        getParticipantsForProviderAndBookAndCompetition('bet90', 'bet90', competition),
        getParticipantsForProviderAndBookAndCompetition('betcenter', 'betcenter', competition),
        getParticipantsForProviderAndBookAndCompetition('betconstruct', 'circus', competition),
        getParticipantsForProviderAndBookAndCompetition('ladbrokes', 'ladbrokes', competition),
        getParticipantsForProviderAndBookAndCompetition('magicbetting', 'magicbetting', competition),
        getParticipantsForProviderAndBookAndCompetition('meridian', 'meridian', competition),
        getParticipantsForProviderAndBookAndCompetition('scooore', 'scooore', competition),
        getParticipantsForProviderAndBookAndCompetition('stanleybet', 'stanleybet', competition),
        getParticipantsForProviderAndBookAndCompetition('starcasino', 'starcasino', competition),
        getParticipantsForProviderAndBookAndCompetition('betway', 'betway', competition),
    ]
    let results
    await Promise.all(requests).then(values => {
        results = mapper.map(values)
    })
    return results
}

async function getParticipantsForProviderAndBookAndCompetition(provider, book, competition) {
    const providerApi = require('./providers/' + provider + '/' + provider + '.js')
    jupilerProLeagueParticipantsRaw = await providerApi.getParticipantsForCompetition(book, competition)
    if(participants) {
        return {provider: provider, book: book, competition: competition, participants: participants.flat().filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)}
    }
}

async function getEventsByProviderAndBookAndSport(provider, book, sport) {
    const providerApi = require('./providers/' + provider + '/' + provider + '.js')
    const events = await providerApi.getEventsForBookAndSport(book, sport)
    console.log('found ' + provider)
    return {provider: provider, book: book, events: events}
}

module.exports = api