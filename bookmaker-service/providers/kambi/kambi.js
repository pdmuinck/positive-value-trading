const axios = require('axios')
const bookmakers = require('./bookmakers.json')
const leagues = require('./leagues.json')


const requests = {
    "FOOTBALL": 'https://{host}/offering/v2018/{book}/event/group/1000093190.json?includeParticipants=true&lang=en_GB&market=BE',
    "BASKETBALL": 'https://{host}/offering/v2018/{book}/event/group/1000093204.json?includeParticipants=true&lang=en_GB&market=BE',
    "AMERICAN_FOOTBALL": 'https://{host}/offering/v2018/{book}/event/group/1000093199.json?includeParticipants=true&lang=en_GB&market=BE',
    "TENNIS": 'https://{host}/offering/v2018/{book}/event/group/1000093193.json?includeParticipants=true&lang=en_GB&market=BE',
    "TABLE_TENNIS": 'https://{host}/offering/v2018/{book}/event/group/1000093215.json?includeParticipants=true&lang=en_GB&market=BE',
    "DARTS": 'https://{host}/offering/v2018/{book}/event/group/1000093225.json?includeParticipants=true&lang=en_GB&market=BE',
    "ICE_HOCKEY": 'https://{host}/offering/v2018/{book}/event/group/1000093191.json?includeParticipants=true&lang=en_GB&market=BE',
    "AUSTRALIAN_RULES": 'https://{host}/offering/v2018/{book}/event/group/1000449347.json?includeParticipants=true&lang=en_GB&market=BE',
    "BOXING": 'https://{host}/offering/v2018/{book}/event/group/1000093201.json?includeParticipants=true&lang=en_GB&market=BE',
    "CRICKET": 'https://{host}/offering/v2018/{book}/event/group/1000093178.json?includeParticipants=true&lang=en_GB&market=BE',
    "ESPORTS": 'https://{host}/offering/v2018/{book}/event/group/2000077768.json?includeParticipants=true&lang=en_GB&market=BE',
    "GOLF": 'https://{host}/offering/v2018/{book}/event/group/1000093187.json?includeParticipants=true&lang=en_GB&market=BE',
    "hostBALL": 'https://{host}/offering/v2018/{book}/event/group/1000093211.json?includeParticipants=true&lang=en_GB&market=BE',
    "RUGBY_LEAGUE": 'https://{host}/offering/v2018/{book}/event/group/1000154363.json?includeParticipants=true&lang=en_GB&market=BE',
    "RUGBY_UNION": 'https://{host}/offering/v2018/{book}/event/group/1000093230.json?includeParticipants=true&lang=en_GB&market=BE',
    "SNOOKER": 'https://{host}/offering/v2018/{book}/event/group/1000093176.json?includeParticipants=true&lang=en_GB&market=BE',
    "MMA": 'https://{host}/offering/v2018/{book}/event/group/1000093238.json?includeParticipants=true&lang=en_GB&market=BE',
    "VOLLEYBALL": 'https://{host}/offering/v2018/{book}/event/group/1000093214.json?includeParticipants=true&lang=en_GB&market=BE',
    "WRESTLING": 'https://{host}/offering/v2018/{book}/event/group/2000089034.json?includeParticipants=true&lang=en_GB&market=BE',
}


const kambi = {}

kambi.getParticipantsForCompetition = async (book, competition) => {
    const groupId = leagues.filter(league => league.name.toUpperCase() === competition).map(league => league.id)
    return await axios('https://eu-offering.kambicdn.org/offering/v2018/ubbe/event/group/' + groupId + '.json?includeParticipants=true').then(response => response.data.events.filter(event => event.tags.includes('MATCH')).map(event => event.participants.map(participant => {return {id: participant.participantId, name: participant.name.toUpperCase()}}))).catch(error => null)
}

kambi.getEventsForBookAndSport = async (book, sports) => {
    const bookmakerInfo = Object.entries(bookmakers).filter(pair => pair[0] === book.toUpperCase()).map(pair => pair[1])[0]

    if(!bookmakerInfo) throw new Error('Book not found: ' + book)
    
    if(sports && Array.isArray(sports)) {
        const sportsUpperCase = sports.map(sport => sport.toUpperCase())
        return resolve(Object.entries(requests).filter(pair => sportsUpperCase.includes(pair[0])).map(pair => createRequest(pair[1], book.toUpperCase(), bookmakerInfo)))
    } else if(sports) {
        return resolve(Object.entries(requests).filter(pair => sports.toUpperCase() === pair[0]).map(pair => createRequest(pair[1], book.toUpperCase(), bookmakerInfo)))
    } else {
        return resolve(Object.values(requests).map(url => createRequest(url, book.toUpperCase(), bookmakerInfo)))
    }
}

function createRequest(url, bookmakerName, bookmakerInfo) {
    return axios.get(url.replace('{book}', bookmakerInfo.code).replace('{host}', bookmakerInfo.host)).then(response => transform(response.data.events)).catch(error => null)
}

function transform(events) {
    return events.map(event => {return {
        id: event.id, 
        participants: event.participants.map(participant => {return {
            id: participant.participantId, 
            name: participant.name}})}})
}

async function resolve(requests) {
    let events
    await Promise.all(requests).then((values) => {
        events = values
    })
    return events
}


module.exports = kambi