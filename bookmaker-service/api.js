const mapper = require('./mapper')

const api = {}

api.getBySport = async (provider, book, sport) => {
    const providerApi = require('./providers/' + provider + '/' + provider + '.js')
    return providerApi.getEventsForBookAndSport(book, sport)
}

api.getParticipantsForProviderAndBookAndCompetition = async (provider, book, competition) => {
    return getParticipantsForProviderAndBookAndCompetition(provider, book, competition)
}

api.getParticipantsByCompetition = async (competition) => {
    const requests = [
        getParticipantsForProviderAndBookAndCompetition('kambi', 'unibet_belgium', competition),
        getParticipantsForProviderAndBookAndCompetition('sbtech', 'betfirst', competition)
    ]

    let test

    await Promise.all(requests).then(values => {
        test = mapper.map(values)
    })

    return test
}

async function getParticipantsForProviderAndBookAndCompetition(provider, book, competition) {
    const providerApi = require('./providers/' + provider + '/' + provider + '.js')
    participants = await providerApi.getParticipantsForCompetition(book, competition)
    return {provider: provider, book: book, competition: competition, participants: participants.flat().filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)}
}

module.exports = api