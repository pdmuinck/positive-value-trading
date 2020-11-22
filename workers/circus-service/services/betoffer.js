const WebSocket = require("ws")
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })

const circusWS = new WebSocket("wss://wss01.circus.be")

circusWS.on('open', function open() {
    circusWS.send(JSON.stringify({"Id":"a79a29cf-9b4d-5d29-65e8-dd113c1b0253","TTL":10,"MessageType":1,"Message":"{\"NodeType\":1,\"Identity\":\"502a445b-f50b-4edc-97c9-77d3f49d3592\",\"EncryptionKey\":\"\",\"ClientInformations\":{\"AppName\":\"Front;Registration-Origin: default\",\"ClientType\":\"Responsive\",\"Version\":\"1.0.0\",\"UserAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36\",\"LanguageCode\":\"nl\",\"RoomDomainName\":\"CIRCUS\"}}"}))
})

const betoffer = {}

betoffer.findByEventId =  async (eventId) => {
    return cache.get('test')
}

circusWS.on('message', function incoming(data) {
    const bla = JSON.parse(data)
    // if statement because we receive more messages than data packets
    if(JSON.parse(bla.Message)["$type"] === 'APR.Packets.DataPacket, APR.Packets') {
        console.log('renew betoffer cache')
        cache.set('test', JSON.parse(JSON.parse(bla.Message).Requests["$values"][0].Content))
    }
})

setInterval(() => {
    console.log('send circus betoffer request')
    circusWS.send(JSON.stringify({"Id":"f7ae76a9-dce9-6e84-4a3f-8053ae3e389e","TTL":10,"MessageType":1000,"Message":"{\"Direction\":1,\"Id\":\"e5344f60-0ef9-d326-3a4c-72b2b3b589b6\",\"Requests\":[{\"Id\":\"fab32c95-6c69-eef9-e61d-6cd1b3a4bca9\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"nl\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"IncludeSportList\\\":true,\\\"EventType\\\":1,\\\"SportId\\\":844,\\\"RegionId\\\":0,\\\"LeagueId\\\":54210798,\\\"EventId\\\":2320394901}}\"}],\"Groups\":[]}"}))
}, 10000)

module.exports = betoffer