import {RequestType} from "../domain/betoffer"
import axios from "axios"
import {bet90Map} from "./bet90/leagues";
import {Bookmaker, BookmakerId, Provider, providers} from "../service/bookmaker";
import {
    Bet90Parser,
} from "../service/parser";
import {BookMakerInfo, EventInfo} from "../service/events";
import {getSbtechEventsForCompetition} from "./sbtech/sbtech";
import {getKambiEventsForCompetition} from "./kambi/kambi";
import {getBwinEventsForCompetition} from "./bwin";
import {getPinnacleEventsForCompetition} from "./pinnacle/pinnacle";
import {getSportRadarMatch} from "./sportradar/sportradar";
import {getAltenarEventsForCompetition} from "./altenar/altenar";
import {getCashpointEventsForCompetition} from "./cashpoint/cashpoint";
import {getMeridianEventsForCompetition} from "./meridian/meridian";
import {getBetwayEventsForCompetition} from "./betway/betway";
import {getZetBetEventsForCompetition} from "./zetbet/zetbet";
import {getStanleybetEventsForCompetition} from "./stanleybet/stanleybet";
import {getScoooreEventsForCompetition} from "./scooore/scooore";
import {getLadbrokesEventsForCompetition} from "./ladbrokes/ladbrokes";
import {getBingoalEventsForCompetition} from "./bingoal/bingoal";
import {getBet90EventsForCompetition} from "./bet90/bet90";

const parser = require('node-html-parser')

let events


export class Scraper {

    static async getEventsForLeague(leagueName: string): Promise<EventInfo[]> {
        const requests = {
            "JUPILER_PRO_LEAGUE": [
                getSbtechEventsForCompetition("40815"),
                getKambiEventsForCompetition("1000094965"),
                getBwinEventsForCompetition("16409"),
                getCashpointEventsForCompetition("6898"),
                getAltenarEventsForCompetition("1000000490"),
                getMeridianEventsForCompetition("https://meridianbet.be/sails/sport/58/region/26/league/first-division-a"),
                getBetwayEventsForCompetition("first-division-a"),
                getZetBetEventsForCompetition("101-pro_league_1a"),
                getStanleybetEventsForCompetition("38"),
                getScoooreEventsForCompetition("18340"),
                getLadbrokesEventsForCompetition("be-jupiler-league1"),
                getBingoalEventsForCompetition("25")
                //getBetconstructEventsForCompetition("227875758"),
            ]
        }

        const leagueRequests = requests[leagueName.toUpperCase()]
        // @ts-ignore
        events = await Promise.all(leagueRequests).then(values => this.mergeEvents(values))

        const sportRadarMatches = await Promise.all(events.map(event => getSportRadarMatch(event.sportRadarId))).then(values => values)
        const requestsNotMappedToSportRadar = {
            "JUPILER_PRO_LEAGUE": [
                getPinnacleEventsForCompetition("1817", sportRadarMatches),
                //getBet90EventsForCompetition("457", sportRadarMatches)
                //getBetconstructBcapsEventsForCompetition("557", sportRadarMatches),
                //getPlaytechEventsForCompetition("soccer-be-sb_type_19372", sportRadarMatches)
            ]
        }

        const leagueRequestsNotMapped = requestsNotMappedToSportRadar[leagueName.toUpperCase()]
        // @ts-ignore
        return Promise.all(leagueRequestsNotMapped).then(values => {
            // @ts-ignore
            return this.mergeEvents(values.flat().filter(x => x), events)
        })
    }

    static mergeEvents(events: EventInfo[], other?: EventInfo[]): EventInfo[] {
        if (other) {
            events = events.flat().concat(other.flat())
        }
        const result: Map<number, EventInfo> = new Map()
        events.flat().forEach(event => {
            if(event && event.sportRadarId) {
                const sportRadarId = event.sportRadarId.toString()
                const storedEvent: EventInfo = result[sportRadarId]
                if (storedEvent) {
                    if (storedEvent.bookmakers) {
                        const bookMakerInfos: BookMakerInfo[] = storedEvent.bookmakers.concat(event.bookmakers)
                        result[sportRadarId] = new EventInfo(sportRadarId, event.sportRadarEventUrl, bookMakerInfos)
                    }
                } else {
                    result[sportRadarId] = event
                }
            }
        })
        return Object.values(result).filter(event => event.sportRadarId != "")

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
                const map = bet90Map.filter(key => key.id === parseInt(bookmakerId.id))[0]
                const body = {leagueId: bookmakerId.id, categoryId: map.categoryId, sportId: map.sport}
                return axios.post('https://bet90.be/Sports/SportLeagueGames', body, headers)
                    .then(response => {
                        const events = Bet90Parser.parse(new ApiResponse(bookmakerId.provider, response.data, RequestType.EVENT))
                        const _1X2 = Bet90Parser.parse(new ApiResponse(bookmakerId.provider, response.data, RequestType.BET_OFFER))
                        const test =  events.map(event => {
                            return axios.get('https://bet90.be/Bet/SpecialBetsCustomer?gameid=' + event.id.id + '&bettypeID=10&_=1610123136993&Cookie=culture%3Dnl', headers)
                                .then(response => {
                                    const data = {eventId: event.id.id, specialBetOffers: response.data, _1X2: _1X2.filter(betOffer => betOffer.eventId === event.id.id)}
                                    return new ApiResponse(bookmakerId.provider, data, requestType)})
                                .catch(error => console.log(error))
                        })
                        return Promise.all(test).then(responses => {
                            const data = []
                            responses.forEach(response => {
                                if (response instanceof ApiResponse) {
                                    data.push(response.data)
                                }
                            })
                            return new ApiResponse(Provider.BET90, data, requestType)
                        })
                    })
                    .catch(error => {return new ApiResponse(bookmakerId.provider, null, requestType)})

            default:
                const bookMap = bet90Map.filter(key => key.id === parseInt(bookmakerId.id))[0]
                const eventBodyRequest = {leagueId: bookmakerId.id, categoryId: bookMap.categoryId, sportId: bookMap.sport}
                return [axios.post('https://bet90.be/Sports/SportLeagueGames', eventBodyRequest, headers)
                    .then(response => {return new ApiResponse(bookmakerId.provider, response.data, requestType)})
                    .catch(error => {return new ApiResponse(bookmakerId.provider, null, requestType)})]
        }

    }

}

export class ApiResponse {
    private readonly _provider: Provider
    private readonly _data
    private readonly _requestType: RequestType
    private readonly _bookmaker: string

    constructor(provider: Provider, data, requestType: RequestType, bookmaker?: string){
        this._provider = provider
        this._data = data
        this._requestType = requestType
        this._bookmaker = bookmaker
    }

    get bookmaker() {
        return this._bookmaker
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