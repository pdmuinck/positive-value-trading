const bookmakers = require('./bookmakers')
const WebSocket = require("ws")
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })
const leagues = require('./resources/leagues.json')
const sports = require('./resources/sports')

websocket = new WebSocket(bookmakers['CIRCUS'])

websocket.on('open', function open() {
    websocket.send(JSON.stringify({"Id":"a79a29cf-9b4d-5d29-65e8-dd113c1b0253","TTL":10,"MessageType":1,"Message":"{\"NodeType\":1,\"Identity\":\"502a445b-f50b-4edc-97c9-77d3f49d3592\",\"EncryptionKey\":\"\",\"ClientInformations\":{\"AppName\":\"Front;Registration-Origin: default\",\"ClientType\":\"Responsive\",\"Version\":\"1.0.0\",\"UserAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36\",\"LanguageCode\":\"nl\",\"RoomDomainName\":\"CIRCUS\"}}"}))
    // send football request
    console.log('betconstruct is open')
    const leagueIds = leagues.map(league => league.id).flat().join(',')
    websocket.send(JSON.stringify({"Id":"36701684-e389-bdbc-ea1d-804acb40e169","TTL":10,"MessageType":1000,"Message":"{\"Direction\":1,\"Id\":\"ef6b43a6-3f69-da7f-b962-644100e612ed\",\"Requests\":[{\"Id\":\"ba7ecb09-731f-87eb-0f46-a38a8d8efc3e\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"OnlyShowcaseMarket\\\":true,\\\"IncludeSportList\\\":true,\\\"EventSkip\\\":0,\\\"EventTake\\\":1000,\\\"EventType\\\":0,\\\"RequestString\\\":\\\"LeagueIds=" + leagueIds + "&OnlyMarketGroup=Main\\\"}}\"}],\"Groups\":[]}"}))
})

websocket.on('message', function incoming(data) {
    const bla = JSON.parse(data)
    // if statement because we receive more messages than data packets
    if(JSON.parse(bla.Message)["$type"] === 'APR.Packets.DataPacket, APR.Packets') {
        const response =  JSON.parse(JSON.parse(bla.Message).Requests["$values"][0].Content)
        const leagues = response.LeagueDataSource.LeagueItems.map(league => {return {sportId: league.SportId, events: league.EventItems.map(event => {return {id: event.EventId, leagueId: event.LeagueId, participants: [{id: event.Team1Name, name: event.Team1Name}, {id: event.Team2Name, name: event.Team2Name}]}})}}).flat()
        leagues.forEach(league => league.events.forEach(event => event["sportId"] = league.sportId))
        const events = leagues.map(league => league.events).flat()
        events.forEach(event => {
            const sportEvents = cache.get(event.sportId)
            const leagueEvents = cache.get(event.leagueId)
            if(leagueEvents) {
                leagueEvents.push(event)
                cache.set(event.leagueId, leagueEvents)
            } else {
                cache.set(event.leagueId, [event])
            }

            if(sportEvents) {
                sportEvents.push(event)
                cache.set(event.sportId, sportEvents)
            } else {
                if(!event.sportId) console.log(event)
                cache.set(event.sportId, [event])
            }
        })
    }
})

const betconstruct = {}

betconstruct.openWebSocket = () => {
    console.log('About to open websocket for betconstruct')
}

betconstruct.getEventsForBookAndSport = async (book, sport) => {
    const id = sports[sport.toUpperCase()]
    const result = cache.get(id)
    if(result) return result
}

betconstruct.getParticipantsForCompetition = async(book, competition) => {
    const league = leagues.filter(league => league.name === competition)[0]
    return cache.get(league.id).map(event => event.participants).flat()
}

setInterval(() => {
    const leagueIds = leagues.map(league => league.id).flat().join(',')
    websocket.send(JSON.stringify({"Id":"36701684-e389-bdbc-ea1d-804acb40e169","TTL":10,"MessageType":1000,"Message":"{\"Direction\":1,\"Id\":\"ef6b43a6-3f69-da7f-b962-644100e612ed\",\"Requests\":[{\"Id\":\"ba7ecb09-731f-87eb-0f46-a38a8d8efc3e\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"OnlyShowcaseMarket\\\":true,\\\"IncludeSportList\\\":true,\\\"EventSkip\\\":0,\\\"EventTake\\\":1000,\\\"EventType\\\":0,\\\"RequestString\\\":\\\"LeagueIds=" + leagueIds + "&OnlyMarketGroup=Main\\\"}}\"}],\"Groups\":[]}"}))
}, 60000)

module.exports = betconstruct