const axios = require('axios')
const leagues = require('./resources/leagues.json')

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
    const requests = leagues.map(league => axios.get('https://www.ladbrokes.be/detail-service/sport-schedule/services/meeting/calcio/' + league.id + '?prematch=1&live=0', headers).then(response => parse(response.data.result.dataGroupList)).catch(error => console.log(error)))

    let results = []

    await Promise.all(requests).then(values => {
        results = values.flat()
    })

    return results
    
}

function parse(dataGroupList) {
    const events = []
    dataGroupList.forEach(dataGroup => {
        dataGroup.itemList.forEach(item => {
            events.push({
                id: item.eventInfo.aliasUrl,
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