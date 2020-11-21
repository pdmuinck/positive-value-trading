const axios = require('axios')
const mapper = require('./mapper')
const leagues = require('../resources/leagues')

const participant = {}

participant.getByLeague = async(league) => {
    const participants = require('../resources/' + league)
    return participants
}

participant.getByLeagueDev = async(league) => {
    let results
    await Promise.all(leagues[league.toUpperCase()]).then(values => {
        results = mapper.map(values)
    })
    return results
}

module.exports = participant