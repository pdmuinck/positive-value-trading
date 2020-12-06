const axios = require('axios')

const sports = {
    "FOOTBALL": 1
}

const scooore = {}

scooore.getEventsForBookAndSport = async (book, sport) => {
    return axios.get('https://www.e-lotto.be/cache/evenueMarketGroupLimited/NL/18340.1-0.json').then(response => transform(response.data.markets)).catch(error => null)
}

function transform(events) {
    return events.map(event => {return {id: event.idfoevent, participants: [{id: event.participantname_home, name: event.participantname_home}, {id: event.participantname_away, name: event.participantname_away}]}})
}

module.exports = scooore