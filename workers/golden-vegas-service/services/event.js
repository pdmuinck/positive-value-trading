const WebSocket = require("ws")
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })

const goldenvegasWS = new WebSocket("wss://wss.goldenvegas.be")

let leagues = []

goldenvegasWS.on('open', function open() {
    goldenvegasWS.send(JSON.stringify({"Id":"ad92eff2-7e71-0626-5917-1f5ac121cd8a","TTL":10,"MessageType":1,"Message":"{\"NodeType\":1,\"Identity\":\"2251ebbf-e153-4b49-ac5d-2477d1ac7644\",\"EncryptionKey\":\"\",\"ClientInformations\":{\"AppName\":\"Front;Registration-Origin: default\",\"ClientType\":\"Responsive\",\"Version\":\"1.0.0\",\"UserAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36\",\"LanguageCode\":\"nl\",\"RoomDomainName\":\"GOLDENVEGAS\"}}"}))
})

goldenvegasWS.on('message', function incoming(data) {
    const response = JSON.parse(JSON.parse(data).Message)
    if(response.Requests) {
        const test = JSON.parse(response.Requests[0].Content)
        leagues = test.PrematchLeaguesIds
        const events = test.LeagueDataSource.LeagueItems.map(league => league.EventItems).flat().map(event => {return {id: event.EventId, participants: [{id: event.Team1Name, name: event.Team1Name}, {id: event.Team2Name, name: event.Team2Name}], betOffers: event.MarketItems}})
        cache.set('FOOTBALL', events)
        events.forEach(event => {
            cache.set(event.id, event.betOffers)
        })
    }
})

setInterval(() => {
    goldenvegasWS.send(JSON.stringify(goldenvegasWS.send(JSON.stringify({"Id":"f523d44b-d825-f9ff-ff02-aa3ae9f0f24b","TTL":10,"MessageType":1000,"Message":"{\"Direction\":1,\"Id\":\"960eed4c-b820-64bb-8592-1114ee3f3d19\",\"Requests\":[{\"Id\":\"53c1e25b-2397-5a49-cbfb-570e9f748f22\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"OnlyShowcaseMarket\\\":true,\\\"IncludeSportList\\\":true,\\\"EventSkip\\\":0,\\\"EventTake\\\":1000,\\\"EventType\\\":0,\\\"PlayerFavoritesLeagueIds\\\":[],\\\"SportId\\\":844,\\\"PeriodicFilter\\\":-1}}\"}],\"Groups\":[]}"}))))
    if(leagues.length > 0) {
        const leagueIds = 'LeagueIds=' + leagues.join('&LeagueIds=')
        goldenvegasWS.send(JSON.stringify({"Id":"cf75aa4b-31ff-c8c9-4e7e-9eb6acdde7c7","TTL":10,"MessageType":1000,"Message":"{\"Direction\":1,\"Id\":\"6db135c5-74b1-8ffa-d4f6-bf5e2a486f8b\",\"Requests\":[{\"Id\":\"26df74df-2a79-7c1b-913c-a4efba523ed5\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"OnlyShowcaseMarket\\\":true,\\\"IncludeSportList\\\":true,\\\"EventSkip\\\":0,\\\"EventTake\\\":1000,\\\"EventType\\\":0,\\\"SportId\\\":844,\\\"RequestString\\\":\\\"" + leagueIds + "&OnlyMarketGroup=Main\\\"}}\"}],\"Groups\":[]}"}))
    }
    
}, 10000)

const event = {}

event.getBySport = async (sport) => {
    return cache.get('FOOTBALL')
}

event.getBetOffersByEventId = async (eventId) => {
    return cache.get(eventId)
}

module.exports = event