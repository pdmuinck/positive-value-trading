import {circusLeagues} from "./leagues";

export class WebSocketConfig {
    private readonly _url: String
    private readonly _connectMessage
    private readonly _requestFootballMessage

    constructor(url: String, connectMessage, requestFootballMessage) {
        this._url = url
        this._connectMessage = connectMessage
        this._requestFootballMessage = requestFootballMessage
    }

    get url() {
        return this._url
    }

    get connectMessage() {
        return this._connectMessage
    }

    get requestFootballMessage() {
        return this._requestFootballMessage
    }
}

export const circusConfig: WebSocketConfig = new WebSocketConfig(
    "wss://wss01.circus.be",
    '{"Id":"a79a29cf-9b4d-5d29-65e8-dd113c1b0253","TTL":10,"MessageType":1,"Message":"{\"NodeType\":1,\"Identity\":\"502a445b-f50b-4edc-97c9-77d3f49d3592\",\"EncryptionKey\":\"\",\"ClientInformations\":{\"AppName\":\"Front;Registration-Origin: default\",\"ClientType\":\"Responsive\",\"Version\":\"1.0.0\",\"UserAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36\",\"LanguageCode\":\"nl\",\"RoomDomainName\":\"CIRCUS\"}}"}',
    '{"Id":"36701684-e389-bdbc-ea1d-804acb40e169","TTL":10,"MessageType":1000,"Message":"{\"Direction\":1,\"Id\":\"ef6b43a6-3f69-da7f-b962-644100e612ed\",\"Requests\":[{\"Id\":\"ba7ecb09-731f-87eb-0f46-a38a8d8efc3e\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"OnlyShowcaseMarket\\\":true,\\\"IncludeSportList\\\":true,\\\"EventSkip\\\":0,\\\"EventTake\\\":1000,\\\"EventType\\\":0,\\\"RequestString\\\":\\\"LeagueIds=' + circusLeagues.map(league => league.id).flat().join(',') + '&OnlyMarketGroup=Main\\\"}}\"}],\"Groups\":[]}"}'
)