import {BetType, Competition, CompetitionName, IdType, RequestType, Sport, SportName} from "../domain/betoffer"
import {sports} from "./config"
import axios from "axios"
import {SbtechTokenRepository} from "./sbtech/token"
import {bet90Map} from "./bet90/leagues";
import {Bookmaker, BookmakerId, Provider, providers} from "../service/bookmaker";
import {circusConfig} from "./websocket/config";

const WebSocketAwait = require("ws-await")
const WebSocket = require("ws")

let events
let starCasinoEvents

export class Scraper {
    private readonly _sbtechTokenRepository: SbtechTokenRepository
    private _betconstructWS
    constructor(){
        this._sbtechTokenRepository = new SbtechTokenRepository()
    }

    async getEventsForCompetition(competition: Competition) {
        const betConstructResponses: ApiResponse[] = []
        await this.startBetConstructWS(betConstructResponses)
        const magicBetting = await this.waitUntilMagicBetting(competition.bookmakerIds.filter(id => id.provider === Provider.MAGIC_BETTING)[0])
        const startCasino = await this.waitUntilStarCasino(competition.bookmakerIds.filter(id => id.provider === Provider.STAR_CASINO)[0])
        const requests = this.toApiRequests(competition.bookmakerIds, RequestType.EVENT)
        const httpResponses: ApiResponse[] = await this.getApiResponses(requests.flat())
        return httpResponses.filter(x => x).concat(betConstructResponses.filter(response => response.data && response.data.MessageType === 1000)[0])
            .concat(magicBetting).concat(startCasino)
    }

    waitUntilMagicBetting(bookmakerId: BookmakerId): Promise<ApiResponse> {
        this.startMagicBettingWS(bookmakerId)
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (events) {
                    resolve(new ApiResponse(Provider.MAGIC_BETTING, events, RequestType.EVENT))
                    clearInterval(interval)
                }
            }, 100)
        })
    }

    waitUntilStarCasino(bookmakerId: BookmakerId): Promise<ApiResponse> {
        this.startStarCasino(bookmakerId)
        return new Promise(resolve => {
            const interval = setInterval(() => {
                if (starCasinoEvents) {
                    resolve(new ApiResponse(Provider.STAR_CASINO, starCasinoEvents, RequestType.EVENT))
                    clearInterval(interval)
                }
            }, 100)
        })
    }

    async startStarCasino(bookmakerId: BookmakerId) {
        const starWS = new WebSocket("wss://eu-swarm-ws-re.bcapps.net/")

        starWS.on('open', function open() {
            console.log('open')
            starWS.send(JSON.stringify({"command":"request_session","params":{"language":"eng","site_id":"385","release_date":"15/09/2020-16:48"},"rid":"16062033821871"}))
            starWS.send(JSON.stringify({"command":"get","params":{"source":"betting","what":{"game":["id"],"market":"@count"},"where":{"competition":{"id":parseInt(bookmakerId.id)}},"subscribe":true},"rid":"161497920766016"}))
            //starWS.send(JSON.stringify({"command":"get","params":{"source":"betting","what":{"game":["id","team1_id","team2_id","team1_name","team2_name"]},"where":{"game":{},"sport":{"id":1},"region":{},"competition":{"id":bookmakerId.id}},"subscribe":false},"rid": "161497920766016"}))
        })

        starWS.on('message', function incoming(data) {
            const bla = JSON.parse(data)
            if(bla.data.data) {
                const events = bla.data.data.game
                starCasinoEvents = events
            }

        })
    }

    async startMagicBettingWS(bookmakerId: BookmakerId) {

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


        function getMagicBettingApiUrl() {
            const generatedId = string(8)
            const server = numberString(1e3)
            const url = "wss://magicbetting.be/api/" + server + "/" + generatedId + "/websocket"
            return url
        }

        const leagueId = bookmakerId.id
        let ws = new WebSocket(getMagicBettingApiUrl(), null, {rejectUnauthorized: false})

        ws.on('open', function open() {
            ws.send(JSON.stringify(["CONNECT\nprotocol-version:1.5\naccept-version:1.1,1.0\nheart-beat:100000,100000\n\n\u0000"]))
            ws.send(JSON.stringify(["SUBSCRIBE\nid:/user/request-response\ndestination:/user/request-response\n\n\u0000"]))
            ws.send(JSON.stringify(["SUBSCRIBE\nid:/api/items/list/all-sports-with-events\ndestination:/api/items/list/all-sports-with-events\n\n\u0000"]))
            ws.send(JSON.stringify(["SUBSCRIBE\nid:/api/eventgroups/" + leagueId + "-all-match-events-grouped-by-type\ndestination:/api/eventgroups/" + leagueId + "-all-match-events-grouped-by-type\nlocale:nl\n\n\u0000"]))
        })

        ws.on('message', function incoming(data) {
            if(data.includes('soccer-be-sb_type_19372')) {
                events = data
                ws.close()
            }
        })
    }

    async startBetConstructWS(webSocketResponses: ApiResponse[]) {
        const options = {
            unpackMessage: data => {
                const parsedJson = JSON.parse(data)
                webSocketResponses.push(new ApiResponse(Provider.BETCONSTRUCT, parsedJson, RequestType.EVENT))
            },
            awaitTimeout: circusConfig.timeOut
        }
        this._betconstructWS = new WebSocketAwait(circusConfig.url, options)
        await this.waitForOpenConnection(this._betconstructWS)
        this._betconstructWS.sendAwait(circusConfig.getConnectMessage())
    }

    async getBetOffers(sportName: SportName, competition?: CompetitionName): Promise<ApiResponse[]> {
        const sport: Sport = sports.filter(sport => sport.name === sportName)[0]
        const requests = this.toApiRequests(sport.bookmakerIds, RequestType.BET_OFFER)
        return await this.getApiResponses(requests.flat())
    }

    async getParticipants(sportName: SportName, competitionName: CompetitionName): Promise<ApiResponse[]>{
        const requests = sports.filter(sport => sport.name === sportName)
            .map(sport => sport.competitions).flat()
            .filter(competition => competition.name === competitionName)
            .map(competition => this.toApiRequests(competition.bookmakerIds, RequestType.PARTICIPANT))
        return await this.getApiResponses(requests.flat())
    }

    waitForOpenConnection(socket) {
        return new Promise((resolve, reject) => {
            const maxNumberOfAttempts = 10
            const intervalTime = 200 //ms

            let currentAttempt = 0
            const interval = setInterval(() => {
                if (currentAttempt > maxNumberOfAttempts - 1) {
                    clearInterval(interval)
                    reject(new Error('Maximum number of attempts exceeded'))
                } else if (socket.readyState === socket.OPEN) {
                    clearInterval(interval)
                    // @ts-ignore
                    resolve()
                }
                currentAttempt++
            }, intervalTime)
        })
    }

    toApiRequests(bookmakerIds: BookmakerId[], requestType: RequestType) {
        return bookmakerIds.map(bookmakerId => {
            switch (bookmakerId.provider) {
                case Provider.KAMBI:
                    return this.toKambiRequests(bookmakerId, requestType)
                case Provider.PINNACLE:
                    return this.toPinnacleRequests(bookmakerId, requestType)
                case Provider.SBTECH:
                    return this.toSbtechRequests(bookmakerId, requestType)
                case Provider.ALTENAR:
                    return this.toAltenarRequests(bookmakerId, requestType)
                case Provider.BET90:
                    return this.toBet90Requests(bookmakerId, requestType)
                case Provider.BINGOAL:
                    return this.toBingoalRequests(bookmakerId, requestType)
                case Provider.BETCONSTRUCT:
                    return this.toBetConstructRequests(bookmakerId, requestType)
                case Provider.LADBROKES:
                    return this.toLadbrokesRequests(bookmakerId, requestType)
                case Provider.MERIDIAN:
                    return this.toMeridianRequests(bookmakerId, requestType)
                case Provider.SCOOORE:
                    return this.toScoooreRequests(bookmakerId, requestType)
                case Provider.STANLEYBET:
                    return this.toStanleyBet(bookmakerId, requestType)
            }
        })
    }

    toStanleyBet(bookmakerId: BookmakerId, requestType: RequestType) {
        const headers = {
            headers: {
                'Content-Type': 'text/plain'
            }
        }
        const getEventsUrl = 'https://sportsbook.stanleybet.be/XSport/dwr/call/plaincall/IF_GetAvvenimenti.getEventi.dwr'
        const body = 'callCount=1\nnextReverseAjaxIndex=0\nc0-scriptName=IF_GetAvvenimenti\nc0-methodName=getEventi\n' +
            'c0-id=0\nc0-param0=number:6\nc0-param1=string:\nc0-param2=string:\nc0-param3=number:1\nc0-param4=number:'
            + bookmakerId.id + '\nc0-param5=boolean:false\nc0-param6=string:STANLEYBET\nc0-param7=number:0\nc0-param8=' +
            'number:0\nc0-param9=string:nl\nbatchId=8\ninstanceId=0\npage=%2FXSport%2Fpages%2Fprematch.jsp%3Fsystem_code' +
            '%3DSTANLEYBET%26language%3Dnl%26token%3D%26ip%3D\nscriptSessionId=jUP0TgbNU12ga86ZyrjLTrS8NRSwl721Uon/AVY2Uon-upTglJydk\n'
        return [axios.post(getEventsUrl, body, headers).then(response =>
            new ApiResponse(Provider.STANLEYBET, response.data, requestType))
            .catch(error => console.log(error))]
    }

    toScoooreRequests(bookmakerId: BookmakerId, requestType: RequestType) {
        return [
            axios.get('https://www.e-lotto.be/cache/evenueMarketGroupLimited/NL/' + bookmakerId.id + '.1-0.json')
                .then(response => new ApiResponse(Provider.SCOOORE, response.data, requestType))
                .catch(error => new ApiResponse(Provider.SCOOORE, null, requestType))
        ]
    }

    toMeridianRequests(bookmakerId: BookmakerId, requestType: RequestType) {
        return [
            axios.get(bookmakerId.id).then(response => new ApiResponse(Provider.MERIDIAN, response.data, RequestType.EVENT))
                .catch(error => new ApiResponse(Provider.SCOOORE, null, requestType))
        ]
    }

    toLadbrokesRequests(bookmakerId: BookmakerId, requestType: RequestType) {
        const headers = {
            headers: {
                'x-eb-accept-language': 'en_BE',
                'x-eb-marketid': 5,
                'x-eb-platformid': 2
            }
        }
        return [
            axios.get('https://www.ladbrokes.be/detail-service/sport-schedule/services/meeting/calcio/'
                + bookmakerId.id + '?prematch=1&live=0', headers).then(response =>
                new ApiResponse(bookmakerId.provider, response, requestType))
        ]
    }

    toBetConstructRequests(bookmakerId: BookmakerId, requestType: RequestType) {
        return [
            this._betconstructWS.sendAwait(circusConfig.getEventRequestMessage("844", bookmakerId.id)).then(
                response => {
                    return new ApiResponse(bookmakerId.provider, response, requestType)}
            ).catch(error => console.log(error))
        ]
    }

    toBingoalRequests(bookmakerId: BookmakerId, requestType: RequestType) {
        return [axios.get("https://www.bingoal.be/nl/Sport").then(response => {
            const cookie = response.headers["set-cookie"].map(entry => entry.split(";")[0]).join("; ")
            const headers = {
                headers : {
                    "Cookie": cookie
                }
            }
            const ieVars = response.data.split("var _ie")[1]
            const k = ieVars.split("_k")[1].split(',')[0].split("=")[1].split("'").join("").trim()
            return axios.get("https://www.bingoal.be/A/sport?k=" + k + "&func=" + (RequestType.BET_OFFER ? "detail" : "sport")
                + "&id=" + bookmakerId.id, headers)
        }).then(response => {return new ApiResponse(bookmakerId.provider, response.data, requestType)})
            .catch(error => {return new ApiResponse(bookmakerId.provider, null, requestType)})]
    }

    toBet90Requests(bookmakerId: BookmakerId, requestType: RequestType) {
        const headers = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json; charset=UTF-8',
            }
        }
        switch(requestType) {
            case RequestType.BET_OFFER:
                return [axios.get('https://bet90.be/Bet/SpecialBetsCustomer', headers)
                    .then(response => {return new ApiResponse(bookmakerId.provider,
                        {data: response.data, id: bookmakerId.id}, requestType)})]
            default:
                const map = bet90Map.filter(key => key.id === parseInt(bookmakerId.id))[0]
                const body = {leagueId: bookmakerId.id, categoryId: map.categoryId, sportId: map.sport}
                return [axios.post('https://bet90.be/Sports/SportLeagueGames', body, headers)
                    .then(response => {return new ApiResponse(bookmakerId.provider, response.data, requestType)})
                    .catch(error => {return new ApiResponse(bookmakerId.provider, null, requestType)})]
        }

    }

    toAltenarRequests(bookmakerId: BookmakerId, requestType: RequestType) {
        const url = 'https://sb1capi-altenar.biahosted.com/Sportsbook/GetEvents?timezoneOffset=-60&langId=1' +
            '&skinName=goldenpalace&configId=1&culture=en-GB&deviceType=Mobile&numformat=en&sportids=0&categoryids=0' +
            '&champids=' + bookmakerId.id  +'&group=AllEvents&period=periodall&withLive=false&outrightsDisplay=none' +
            '&couponType=0&startDate=2020-04-11T08%3A28%3A00.000Z&endDate=2200-04-18T08%3A27%3A00.000Z'
        return [axios.get(url)
            .then(response => {return new ApiResponse(bookmakerId.provider, response.data, requestType)})
            .catch(error => {return new ApiResponse(bookmakerId.provider, null, requestType)})]
    }

    toPinnacleRequests(bookmakerId: BookmakerId, requestType: RequestType) {
        const requestConfig = {
            headers: {
                "X-API-Key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
                "Referer": "https://www.pinnacle.com/",
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        }
        let url = 'https://guest.api.arcadia.pinnacle.com/0.1/' + (bookmakerId.idType === IdType.SPORT ?
            'sports/' : 'leagues/') + bookmakerId.id + (requestType === RequestType.EVENT || requestType === RequestType.PARTICIPANT
        ? '/matchups' : '/markets/straight?primaryOnly=true')
        return [
            axios.get(
                url,
                requestConfig
            ).then(response => {return new ApiResponse(bookmakerId.provider, response.data, requestType)})
                .catch(error => {return new ApiResponse(bookmakerId.provider, null, requestType)})
        ]
    }

    toKambiRequests(bookmakerId: BookmakerId, requestType: RequestType) {
        if(RequestType.EVENT) return this.toKambiEventRequests(bookmakerId)
        if(RequestType.BET_OFFER) return this.toKambiBetOfferRequests(bookmakerId)
    }

    toKambiEventRequests(bookmakerId: BookmakerId) {
        return [
            axios('https://eu-offering.kambicdn.org/offering/v2018/ubbe/event/group/'
                + bookmakerId.id + '.json?includeParticipants=true')
                .then(response => {return new ApiResponse(bookmakerId.provider, response.data, RequestType.EVENT)})
                .catch(error => {return new ApiResponse(bookmakerId.provider, null, RequestType.EVENT)})
        ]
    }

    toKambiBetOfferRequests(bookmakerId: BookmakerId) {
        const kambiBetOfferTypes = {}
        kambiBetOfferTypes[BetType._1X2] = 2
        kambiBetOfferTypes[BetType.OVER_UNDER] = 6
        const books = providers[Provider.KAMBI]
        return books.map(book => {
            return Object.keys(kambiBetOfferTypes).map(key => {
                const betOfferType = kambiBetOfferTypes[key]
                return [axios.get(
                    'https://eu-offering.kambicdn.org/offering/v2018/' +  book + '/betoffer/group/'
                    + bookmakerId.id + '.json?type=' + betOfferType
                ).then(response => {return new ApiResponse(bookmakerId.provider, response.data, RequestType.BET_OFFER)})
                    .catch(error => {return new ApiResponse(bookmakerId.provider, null, RequestType.BET_OFFER)})]
            })
        })
    }


    toSbtechRequests(bookmakerId: BookmakerId, requestType: RequestType) {

        const tokenData = [
            new SbtechTokenRequest(Bookmaker.BET777, 'https://sbapi.sbtech.com/bet777/auth/platform/v1/api/GetTokenBySiteId/72', SbtechApi.V1),
            new SbtechTokenRequest(Bookmaker.BETFIRST, 'https://sbapi.sbtech.com/bet777/auth/platform/v1/api/GetTokenBySiteId/28', SbtechApi.V1),
        ]

        const id = bookmakerId.id

        const pages = [
            {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[id],"pagination":{"top":300,"skip":0}},
            {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[id],"pagination":{"top":300,"skip":300}},
            {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[id],"pagination":{"top":300,"skip":600}},
            {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[id],"pagination":{"top":300,"skip":900}},
            {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[id],"pagination":{"top":300,"skip":1200}},
            {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[id],"pagination":{"top":300,"skip":1500}},
        ]

        const tokenRequest = tokenData[0]

        return pages.map(page => {
            if(requestType === RequestType.BET_OFFER) {
                page["marketTypeRequests"] = [{"marketTypeIds":["1_0", "1_39", "2_0", "2_39", "3_0", "3_39"]}]
            }
            if(tokenRequest.api === SbtechApi.V2) {
                return axios.get(tokenRequest.url).then(res => this.toSbtechBetOfferRequest(bookmakerId, res.data.token, page, requestType))
                    .catch(error => console.log(error))
            } else {
               return axios.get(tokenRequest.url).then(res => this.toSbtechBetOfferRequest(bookmakerId,
                   res.data.split('ApiAccessToken = \'')[1].replace('\'', ''), page, requestType)).catch(error => console.log(error))
            }
        })
    }

    toSbtechBetOfferRequest(bookmakerId: BookmakerId, token, page, requestType: RequestType) {
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                'locale': 'en'
            }
        }
        return axios.post('https://sbapi.sbtech.com/' + Bookmaker.BET777 +
            '/sportscontent/sportsbook/v1/Events/' + (bookmakerId.idType === IdType.SPORT ? 'GetBySportId' : 'GetByLeagueId')
            , page, headers)
            .then(response => {
                if(response.data.events.length > 0) {
                    return new ApiResponse(bookmakerId.provider, response.data, requestType)
                }})
            .catch(error => {
                return new ApiResponse(bookmakerId.provider, null, requestType)})
    }


    async getApiResponses(requests): Promise<ApiResponse[]> {
        const apiResponses: ApiResponse[] = []
        if(requests){
            await Promise.all(requests.flat().filter(x => x)).then(responses => {
                responses.forEach((response: ApiResponse) => {
                    apiResponses.push(response)
                })
            })
        }
        return apiResponses
    }
}

export class FakeScraper extends Scraper {
    private readonly _testData
    constructor(testData){
        super()
        this._testData = testData
    }

    async getBetOffers(sport: SportName, competition?: CompetitionName): Promise<ApiResponse[]> {
        return [
            this._testData[Provider.KAMBI],
            this._testData[Provider.PINNACLE]
            ].flat()
    }
}

export class ApiResponse {
    private readonly _provider: Provider
    private readonly _data
    private readonly _requestType: RequestType

    constructor(provider: Provider, data, requestType: RequestType){
        this._provider = provider
        this._data = data
        this._requestType = requestType
    }

    get provider(){
        return this._provider
    }

    get data(){
        return this._data
    }

    get requestType(){
        return this._requestType
    }
}

class SbtechTokenRequest {
    private readonly _bookmaker: Bookmaker
    private readonly _url: string
    private readonly _api: SbtechApi

    constructor(bookmaker: Bookmaker, url: string, api: SbtechApi) {
        this._bookmaker = bookmaker
        this._url = url
        this._api = api
    }

    get bookmaker(){
        return this._bookmaker
    }

    get url(){
        return this._url
    }

    get api(){
        return this._api
    }
}

enum SbtechApi {
    V1= "V1",
    V2 = "V2"
}