const axios = require('axios')
const https = require('https')

const httpsAgent = new https.Agent({ keepAlive: true })

const sports = {
    "FOOTBALL": 1
}

const event = {}

event.getParticipants = async (league) => {
    const payload = {"leagueIds":[parseInt(league)],"gameTypes":[7],"jurisdictionId":30}
    return axios.post('https://oddsservice.betcenter.be/odds/getGames/8', payload, betcenterHeaders).then(response => parseParticipants(response.data)).catch(error => null)
}

function parseParticipants(events) {
    return events.games.map(event => event.teams.map(team => {return {id: team.id, name: team.name}}))
}

const headers = {
    headers: {
        'x-eb-accept-language': 'en_BE',
        'x-eb-marketid': 5,
        'x-eb-platformid': 2
    }
}

event.getEvents = async () => {
    const test = await axios.get('https://www.bingoalcasino.be//ajax/session.keepAlive', httpsAgent).then(response => response.data).catch(error => console.log(error))

    return axios.post('https://www.bingoal.be/A/sport', httpsAgent).then(response => response.data).catch(error => console.log(error))
}

function parse(dataGroupList) {
    const events = []
    dataGroupList.forEach(dataGroup => {
        dataGroup.itemList.forEach(item => {
            events.push( {id: item.eventInfo.aliasUrl, participants: [{id: item.eventInfo.teamHome.description, name: item.eventInfo.teamHome.description}, {id: item.eventInfo.teamAway.description, name: item.eventInfo.teamAway.description}], betOffers: item.betGroupList.map(betGroup => betGroup.oddGroupList.map(oddGroup => {return {id: oddGroup.oddGroupDescription, prices: oddGroup.oddList.map(odd => {return {betOffer: odd.oddDescription, price: odd.oddValue / 100}})}})).flat()})
        })
    })
    return events
}

module.exports = event