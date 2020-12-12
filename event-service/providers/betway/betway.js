const axios = require('axios')
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const eventCache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })
const leagues = require('./resources/leagues')

const betway = {}

betway.getEventsForBookAndSport = async(book, sport) => {
    const cacheResult = eventCache.get(sport.toUpperCase())
    if(cacheResult) return cacheResult
    const eventIds = await getEventIds(sport)
    return axios.post('https://sports.betway.be/api/Events/V2/GetEvents',
    {"LanguageId":1,"ClientTypeId":2,"BrandId":3,"JurisdictionId":3,"ClientIntegratorId":1,"ExternalIds": eventIds,"MarketCName":"win-draw-win","ScoreboardRequest":{"ScoreboardType":3,"IncidentRequest":{}}}
    ).then(response => parseEvents(response.data.Events)).catch(error => null)
}

betway.getParticipantsForCompetition = async(book, competition) => {
    const league = leagues.filter(league => league.name === competition.toUpperCase())[0]
    const cacheResult = eventCache.get(league.id)
    return cacheResult ? cacheResult.map(event => event.participants) : []
}

function parseEvents(events) {
    console.log('parse events')
    const parsedEvents = events.map(event => {return {id: event.Id, leagueId: event.GroupCName, participants: [{id: event.HomeTeamName, name: event.HomeTeamName}, {id: event.AwayTeamName, name: event.AwayTeamName}]}})
    eventCache.set('FOOTBALL', parsedEvents)
    parsedEvents.forEach(event => {
        const leagueEvents = eventCache.get(event.leagueId)
        if(leagueEvents) {
            leagueEvents.push(event)
            eventCache.set(event.leagueId, leagueEvents)
        } else {
            eventCache.set(event.leagueId, [event])
        }
    })

    return parsedEvents
}

async function createRequests(sport) {

    const sports = {
        'FOOTBALL': 'soccer'
    }

    const sportId = sports[sport.toUpperCase()]

    return axios.post('https://sports.betway.be/api/Events/V2/GetCategoryDetails',
    {"LanguageId":1,"ClientTypeId":2,"BrandId":3,"JurisdictionId":3,"ClientIntegratorId":1,"CategoryCName":sportId}).then(response => parseGroups(response.data)).catch(error => null)

}

function parseGroups(groups) {
    const betwayGroupsUrl = 'https://sports.betway.be/api/Events/V2/GetGroup'
    const eventRequests = []
    const sport = groups.CategoryCName
    const subCategories = groups.SubCategories
    subCategories.forEach(subCategory => {
        subCategory.Groups.forEach(group => {
            eventRequests.push(axios.post(betwayGroupsUrl, {"LanguageId":1,"ClientTypeId":2,"BrandId":3,"JurisdictionId":3,"ClientIntegratorId":1,
            "CategoryCName":sport,"SubCategoryCName": subCategory.SubCategoryCName,"GroupCName":group.GroupCName}).then(response => response.data).catch(error => null))
        })
    })
    return eventRequests
}

async function getEventIds(sport) {

    const requests = await createRequests(sport)

    let betwayEventIds

    await Promise.all(requests).then((values) => {
        betwayEventIds = values.filter(x => x).filter(value => value.Categories[0]).map(value => value.Categories[0].Events).flat()
    }) 

    return betwayEventIds
}

module.exports = betway
