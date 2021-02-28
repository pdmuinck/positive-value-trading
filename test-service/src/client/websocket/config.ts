import {Bookmaker} from "../../domain/betoffer"

export class WebSocketConfig {
    private readonly _bookmaker: Bookmaker
    private readonly _url: String
    private readonly _timeOut

    constructor(bookmaker: Bookmaker, url: String, timeOut) {
        this._bookmaker = bookmaker
        this._url = url
        this._timeOut = timeOut
    }

    get bookmaker() {
        return this._bookmaker
    }

    get url() {
        return this._url
    }

    get timeOut() {
        return this._timeOut
    }

    getConnectMessage() {
        return {}
    }

    getEventRequestMessage(sportId, leagueId) {
        {}
    }
}

export class BetConstructWebSocketConfig extends WebSocketConfig{

    constructor(bookmaker: Bookmaker, url: String, timeOut) {
        super(bookmaker, url, timeOut)
    }

    getConnectMessage() {
        return {"TTL":10,"MessageType":1,
            "Message":"{\"NodeType\":1,\"ClientInformations\":{\"RoomDomainName\":\"" + this.bookmaker + "\"}}"}
    }

    getEventRequestMessage(sportId, leagueId) {
        return {"TTL":10,"MessageType":1000,"Message":"{\"Requests\":[{\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"OnlyShowcaseMarket\\\":true,\\\"IncludeSportList\\\":false,\\\"EventSkip\\\":0,\\\"EventTake\\\":20,\\\"EventType\\\":0,\\\"SportId\\\":" + sportId + ",\\\"RequestString\\\":\\\"LeagueIds=" + leagueId + "&OnlyMarketGroup=Main\\\"}}\"}],\"Groups\":[]}"}
    }
}

export class MagicBettingConfig extends WebSocketConfig {
    get url() {
        function string(t) {
            const crypto = require("crypto")
            const s = "abcdefghijklmnopqrstuvwxyz012345"
            const i = 43
            for (var e = s.length, n = crypto.randomBytes(t), r = [], o = 0; o < t; o++) r.push(s.substr(n[o] % e, 1));
            return r.join("")
        }

        function number(t) {
            return Math.floor(Math.random() * t)
        }

        function numberString(t) {
            var e = ("" + (t - 1)).length;
            return (new Array(e + 1).join("0") + number(t)).slice(-e)
        }

        return super.url + numberString(1e3) + string(8)
    }

    getEventRequestMessage(sportId, leagueId) {
        return ["SUBSCRIBE\nid:/api/eventgroups/" + leagueId + "-all-match-events-grouped-by-type\ndestination:/api/eventgroups/" + leagueId + "-all-match-events-grouped-by-type\nlocale:nl\n\n\u0000"]
    }

    getConnectMessage() {
        return ["CONNECT\nprotocol-version:1.5\naccept-version:1.1,1.0\nheart-beat:10000,10000\n\n\u0000"]
    }
}

export const circusConfig: BetConstructWebSocketConfig = new BetConstructWebSocketConfig(
    Bookmaker.CIRCUS,
    "wss://wss01.circus.be",
    2000
)

export const goldenVegasConfig: BetConstructWebSocketConfig = new BetConstructWebSocketConfig(
    Bookmaker.GOLDENVEGAS,
    "wss://wss.goldenvegas.be",
    2000
)



export const magicBettingConfig: WebSocketConfig = new MagicBettingConfig(
    Bookmaker.MAGIC_BETTING,
    "wss://magicbetting.be/api/",
    10000
)