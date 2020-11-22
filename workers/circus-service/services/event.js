const WebSocket = require("ws")
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })

const circusWS = new WebSocket("wss://wss01.circus.be")

circusWS.on('open', function open() {
    circusWS.send(JSON.stringify({"Id":"a79a29cf-9b4d-5d29-65e8-dd113c1b0253","TTL":10,"MessageType":1,"Message":"{\"NodeType\":1,\"Identity\":\"502a445b-f50b-4edc-97c9-77d3f49d3592\",\"EncryptionKey\":\"\",\"ClientInformations\":{\"AppName\":\"Front;Registration-Origin: default\",\"ClientType\":\"Responsive\",\"Version\":\"1.0.0\",\"UserAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36\",\"LanguageCode\":\"nl\",\"RoomDomainName\":\"CIRCUS\"}}"}))
})

circusWS.on('message', function incoming(data) {
    const bla = JSON.parse(data)
    // if statement because we receive more messages than data packets
    if(JSON.parse(bla.Message)["$type"] === 'APR.Packets.DataPacket, APR.Packets') {
        console.log('renew cache')
        cache.set('FOOTBALL', JSON.parse(JSON.parse(bla.Message).Requests["$values"][0].Content).LeagueDataSource.LeagueItems.map(league => league.EventItems).flat().map(event => {return {id: event.EventId, participants: [{id: event.Team1Name, name: event.Team1Name}, {id: event.Team2Name, name: event.Team2Name}]}}))
    }
})

/*
const payload = {
    Id: "f55029fc-d4c2-1e33-0579-3e2899104d0f",
    TTL: 10,
    MessageType: 1000,
    Message: {
        Direction: 1,
        Id: "8bf87cbc-d14b-e018-3776-7054adac3d32",
        Requests: [
            {
                Id: "2b9836df-c5ab-24ae-9e7c-d48a38ff0d6c",
                Type: 201,
                Identifier: "GetLeaguesDataSourceFromCache",
                AuthRequired: false,
                Content: {
                    Entity: {
                        Language: "en",
                        BettingActivity: 0,
                        PageNumber: 0,
                        IncludeSportList: true,
                        EventType: 0,
                        SportId: 844,
                        RegionId: 0,
                        LeagueId: 227875758
                    }
                }
            }
        ]
    }
}

*/

setInterval(() => {
    console.log('send circus event request')
    circusWS.send(JSON.stringify({"Id":"f55029fc-d4c2-1e33-0579-3e2899104d0f","TTL":10,"MessageType":1000,"Message":"{\"Direction\":1,\"Id\":\"8bf87cbc-d14b-e018-3776-7054adac3d32\",\"Requests\":[{\"Id\":\"2b9836df-c5ab-24ae-9e7c-d48a38ff0d6c\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"IncludeSportList\\\":true,\\\"EventType\\\":0,\\\"SportId\\\":844,\\\"RegionId\\\":0,\\\"LeagueId\\\":0}}\"}],\"Groups\":[]}"}))
}, 10000)

const event = {}

event.getBySport = async (sport) => {
    return cache.get('FOOTBALL')
}

module.exports = event