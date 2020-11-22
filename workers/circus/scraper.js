const WebSocket = require("ws")

const circusWS = new WebSocket("wss://wss01.circus.be")

let count = 0

circusWS.on("open", function open() {
    circusWS.send(JSON.stringify({"Id":"a79a29cf-9b4d-5d29-65e8-dd113c1b0253","TTL":10,"MessageType":1,"Message":"{\"NodeType\":1,\"Identity\":\"502a445b-f50b-4edc-97c9-77d3f49d3592\",\"EncryptionKey\":\"\",\"ClientInformations\":{\"AppName\":\"Front;Registration-Origin: default\",\"ClientType\":\"Responsive\",\"Version\":\"1.0.0\",\"UserAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36\",\"LanguageCode\":\"nl\",\"RoomDomainName\":\"CIRCUS\"}}"}))
    circusWS.send(JSON.stringify({"Id":"f55029fc-d4c2-1e33-0579-3e2899104d0f","TTL":10,"MessageType":1000,"Message":"{\"Direction\":1,\"Id\":\"8bf87cbc-d14b-e018-3776-7054adac3d32\",\"Requests\":[{\"Id\":\"2b9836df-c5ab-24ae-9e7c-d48a38ff0d6c\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"nl\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"IncludeSportList\\\":true,\\\"EventType\\\":0,\\\"SportId\\\":844,\\\"RegionId\\\":0,\\\"LeagueId\\\":227875758}}\"}],\"Groups\":[]}"}))
    //circusWS.send(JSON.stringify({"Id":"9fec5b5a-a601-e5db-70e2-d2af5c531b06","TTL":10,"MessageType":1000,"Message":"{\"Direction\":1,\"Id\":\"1f0df7ee-0bff-507e-0173-518210cb8f4a\",\"Requests\":[{\"Id\":\"e3d9662f-7d3b-305e-680d-a076cb8bbd67\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"nl\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"IncludeSportList\\\":true,\\\"EventType\\\":0,\\\"SportId\\\":848,\\\"RegionId\\\":0,\\\"LeagueId\\\":1480,\\\"EventId\\\":7617649}}\"}],\"Groups\":[]}"}))
})

let events 

circusWS.on("message", function incoming(data) {
    count++
    if(count == 2) {
        circusWS.close()
    }
    events = data
})

console.log(events)
