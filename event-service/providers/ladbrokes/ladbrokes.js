const axios = require('axios')
const leagues = require('./resources/leagues.json')
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const eventCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })


const sports = {
    "FOOTBALL": 1
}

const ladbrokes = {}

const headers = {
    headers: {
        'x-eb-accept-language': 'en_BE',
        'x-eb-marketid': 5,
        'x-eb-platformid': 2
    }
}

ladbrokes.getEventsForBookAndSport = async (book, sport) => {
    if(eventCache.get('EVENTS')) return eventCache.get('EVENTS')
    const requests = leagues.map(league => axios.get('https://www.ladbrokes.be/detail-service/sport-schedule/services/meeting/calcio/' + league.id + '?prematch=1&live=0', headers).then(response => parse(response.data.result.dataGroupList, league.name)).catch(error => console.log(error)))
    let results = []
    await Promise.all(requests).then(values => {
        results = values.flat()
        eventCache.set('EVENTS', results)
    })
    return results
}

ladbrokes.getParticipantsForCompetition = async(book, competition) => {
    const league = leagues.filter(league => league.name === competition.toUpperCase())[0]
    return axios.get('https://www.ladbrokes.be/detail-service/sport-schedule/services/meeting/calcio/' + league.id + '?prematch=1&live=0', headers).then(response => parseParticipants(response.data.result.dataGroupList, league.name)).catch(error => console.log(error))
}

function parseParticipants(dataGroupList, league) {
    const events = parse(dataGroupList, league)
    return events.map(event => event.participants).flat()
}

function parse(dataGroupList, league) {
    const events = []
    dataGroupList.forEach(dataGroup => {
        dataGroup.itemList.forEach(item => {
            events.push({
                id: item.eventInfo.aliasUrl,
                league: league,
                participants: [
                    {id: item.eventInfo.teamHome.description, name: item.eventInfo.teamHome.description}, 
                    {id: item.eventInfo.teamAway.description, name: item.eventInfo.teamAway.description}
                ]
            })
        })
    })
    return events
}

module.exports = ladbrokes