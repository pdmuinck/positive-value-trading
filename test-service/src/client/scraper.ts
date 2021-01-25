import {
    BetType,
    Bookmaker,
    BookmakerId,
    CompetitionName,
    IdType,
    RequestType,
    Sport,
    SportName
} from "../domain/betoffer"
import {sports} from "./config"
import axios from "axios"
import {SbtechTokenRepository} from "./sbtech/token";

export class Scraper {
    private readonly _sbtechTokenRepository: SbtechTokenRepository
    constructor(){
        this._sbtechTokenRepository = new SbtechTokenRepository()
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

    async getEvents(bookmaker: Bookmaker, sportName: SportName, competitionName: CompetitionName): Promise<ApiResponse[]>{
        const requests = sports.filter(sport => sport.name === sportName)
            .map(sport => sport.competitions).flat()
            .filter(competition => competition.name === competitionName)
            .map(competition => this.toApiRequests(competition.bookmakerIds, RequestType.EVENT))
        return await this.getApiResponses(requests)
    }

    toApiRequests(bookmakerIds: BookmakerId[], requestType: RequestType) {
        return bookmakerIds.map(bookmakerId => {
            switch (bookmakerId.bookmaker) {
                case Bookmaker.UNIBET_BELGIUM:
                    return this.toKambiRequests(bookmakerId, requestType)
                case Bookmaker.NAPOLEON_GAMES:
                    return this.toKambiRequests(bookmakerId, requestType)
                case Bookmaker.PINNACLE:
                    return this.toPinnacleRequests(bookmakerId, requestType)
                case Bookmaker.BET777:
                    return this.toSbtechRequests(bookmakerId, requestType)
                case Bookmaker.BETFIRST:
                    return this.toSbtechRequests(bookmakerId, requestType)
            }
        })
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
            ).then(response => {return new ApiResponse(Bookmaker.PINNACLE, response.data, requestType, bookmakerId.idType)})
                .catch(error => {return new ApiResponse(Bookmaker.PINNACLE, null, requestType, bookmakerId.idType)})
        ]
    }

    toKambiRequests(bookmakerId: BookmakerId, requestType: RequestType){
        const kambiBetOfferTypes = {}
        kambiBetOfferTypes[BetType._1X2] = 2
        kambiBetOfferTypes[BetType.OVER_UNDER] = 6

        const kambiBooks = {}
        kambiBooks[Bookmaker.UNIBET_BELGIUM] = 'ubbe'
        kambiBooks[Bookmaker.NAPOLEON_GAMES] = 'ngbe'

        const bookmaker = bookmakerId.bookmaker
        const groupId = bookmakerId.id

        switch(requestType){
            case RequestType.BET_OFFER:
                return Object.keys(kambiBetOfferTypes).map(key => {
                    const betOfferType = kambiBetOfferTypes[key]
                    return [axios.get(
                        'https://eu-offering.kambicdn.org/offering/v2018/' +  kambiBooks[bookmaker] + '/betoffer/group/'
                        + groupId + '.json?type=' + betOfferType
                    ).then(response => {return new ApiResponse(bookmaker, response.data, requestType, bookmakerId.idType)})
                        .catch(error => {return new ApiResponse(bookmaker, null, requestType, bookmakerId.idType)})]
                })

            default:
                return [
                    axios('https://eu-offering.kambicdn.org/offering/v2018/' + kambiBooks[bookmaker] + '/event/group/'
                        + groupId + '.json?includeParticipants=true')
                        .then(response => {return new ApiResponse(bookmaker, response.data, requestType, bookmakerId.idType)})
                        .catch(error => {return new ApiResponse(bookmaker, null, requestType, bookmakerId.idType)})
                ]
        }
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

        const tokenRequest = tokenData.filter(data => data.bookmaker === bookmakerId.bookmaker)[0]

        return pages.map(page => {
            if(requestType === RequestType.BET_OFFER) {
                page["marketTypeRequests"] = [{"marketTypeIds":["1_0", "1_39", "2_0", "2_39", "3_0", "3_39"]}]
            }
            if(tokenRequest.api === SbtechApi.V2) {
                return axios.get(tokenRequest.url).then(res => this.toSbtechBetOfferRequest(bookmakerId, res.data.token, page, requestType))
                    .catch(error => null)
            } else {
               return axios.get(tokenRequest.url).then(res => this.toSbtechBetOfferRequest(bookmakerId,
                   res.data.split('ApiAccessToken = \'')[1].replace('\'', ''), page, requestType)).catch(error => null)
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
        return axios.post('https://sbapi.sbtech.com/' + bookmakerId.bookmaker +
            '/sportscontent/sportsbook/v1/Events/' + (bookmakerId.idType === IdType.SPORT ? 'GetBySportId' : 'GetByLeagueId')
            , page, headers)
            .then(response => {return new ApiResponse(bookmakerId.bookmaker, response.data, requestType, bookmakerId.idType)})
            .catch(error => {
                return new ApiResponse(bookmakerId.bookmaker, null, requestType, bookmakerId.idType)})
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
            this._testData[Bookmaker.UNIBET_BELGIUM],
            this._testData[Bookmaker.PINNACLE]
            ].flat()
    }
}

export class ApiResponse {
    private readonly _bookmaker: Bookmaker
    private readonly _data
    private readonly _requestType: RequestType
    private readonly _idType: IdType

    constructor(bookmaker: Bookmaker, data, requestType: RequestType, idType: IdType){
        this._bookmaker = bookmaker
        this._data = data
        this._idType = idType
        this._requestType = requestType
    }

    get bookmaker(){
        return this._bookmaker
    }

    get data(){
        return this._data
    }

    get requestType(){
        return this._requestType
    }

    get idType(){
        return this._idType
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