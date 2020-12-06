const axios = require('axios')
const leagues = require('./resources/leagues.json')

const sports = {
    "FOOTBALL": 1
}

const scooore = {}

scooore.getEventsForBookAndSport = async (book, sport) => {
    const requests = leagues.map(league => axios.get('https://www.e-lotto.be/cache/evenueMarketGroupLimited/NL/' + league.id + '.1-0.json').then(response => transform(response.data.markets)).catch(error => null))
    let results
    await Promise.all(requests).then(values => {
        results = values.flat()
    })
    return results
}

function transform(events) {
    return events.map(event => {return {id: event.idfoevent, participants: [{id: event.participantname_home, name: event.participantname_home}, {id: event.participantname_away, name: event.participantname_away}]}})
}

module.exports = scooore