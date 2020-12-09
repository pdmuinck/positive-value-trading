const axios = require('axios')
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const eventCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })
const leagues = require('./resources/leagues.json')


const altenar = {}

const sports = {
    "FOOTBALL": 1
}

altenar.getEventsForBookAndSport = async (book, sport) => {
    if(eventCache.get('EVENTS')) return eventCache.get('EVENTS')
    const events = await axios.get('https://sb1capi-altenar.biahosted.com/Sportsbook/GetEvents?timezoneOffset=-120&langId=1&skinName=' + book +'&configId=1&culture=en&countryCode=BE&deviceType=Mobile&numformat=en&sportids={sportId}&categoryids=0&group=AllEvents&period=periodall&withLive=true&outrightsDisplay=none&couponType=0&startDate=2020-04-11T08%3A28%3A00.000Z&endDate=2200-04-18T08%3A28%3A00.000Z'.replace('{sportId}', sports[sport.toUpperCase()])).then(response => parse(response.data.Result.Items[0].Events)).catch(error => null)
    eventCache.set('EVENTS', events)
    return events
}

altenar.getParticipantsForCompetition = async (book, competition) => {
    const league = leagues.filter(league => league.name === competition.toUpperCase())[0]
    const url = 'https://sb1capi-altenar.biahosted.com/Sportsbook/GetEvents?timezoneOffset=-60&langId=1&skinName=goldenpalace&configId=1&culture=en-GB&deviceType=Mobile&numformat=en&sportids=0&categoryids=0&champids=' + league.id  +'&group=AllEvents&period=periodall&withLive=false&outrightsDisplay=none&couponType=0&startDate=2020-04-11T08%3A28%3A00.000Z&endDate=2200-04-18T08%3A27%3A00.000Z'
    return await axios.get(url).then(response => parseParticipants(response.data.Result.Items[0].Events)).catch(error => console.log(error))
}

function parseParticipants(events) {
    return events.map(event => event.Competitors.map(competitor => {return {id: competitor.Name.toUpperCase(), name: competitor.Name.toUpperCase()}}))
}

function parse(events) {
    return events.map(event => { return {id: event.Id, participants: event.Competitors.map(competitor => {return {id: competitor.Name.toUpperCase(), name: competitor.Name.toUpperCase()}})}})
}

module.exports = altenar