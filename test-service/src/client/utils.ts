import {EventInfo} from "../service/events";
import axios from "axios";
import {ApiResponse} from "./scraper";
import {RequestType} from "../domain/betoffer";
import {Bookmaker, Provider} from "../service/bookmaker"
import {BetOffer} from "../service/betoffers";
import {parseKambiBetOffers} from "./kambi/kambi";
import {parseSbtechBetOffers} from "./sbtech/sbtech";
import {parseBwinBetOffers} from "./bwin";
import {parsePinnacleBetOffers} from "./pinnacle/pinnacle";
import {parseCashpointBetOffers} from "./cashpoint/cashpoint";
import {parseAltenarBetOffers} from "./altenar/altenar";
import {parserMeridianBetOffers} from "./meridian/meridian";

export async function getBetOffers(event: EventInfo): Promise<EventInfo> {
    if(event instanceof EventInfo) {
        const pinnacleBookmakerInfo = event.bookmakers.filter(bookmaker => bookmaker.bookmaker === Bookmaker.PINNACLE)[0]
        const pinnacleRequests = pinnacleBookmakerInfo?.eventUrl.map(eventUrl => {
            return axios.get(eventUrl, pinnacleBookmakerInfo.headers)
                .then(response => response.data)
                .catch(error => console.log(error))
        })
        const requests = event.bookmakers.filter(bookmaker => bookmaker.bookmaker !== Bookmaker.PINNACLE).map(bookmaker => {
            return bookmaker.eventUrl.map(eventUrl => {
                if(bookmaker.httpMethod === "GET") {
                    return axios.get(eventUrl, bookmaker.headers)
                        .then(response => {
                            const parser = getParserForBook(bookmaker.provider)
                            return parser(new ApiResponse(bookmaker.provider, response.data, RequestType.BET_OFFER, bookmaker.bookmaker))})
                        .catch(error => console.log(error))
                } else {
                    return axios.post(eventUrl, bookmaker.requestBody, bookmaker.headers)
                        .then(response => {
                            const parser = getParserForBook(bookmaker.provider, bookmaker.bookmaker)
                            return parser(new ApiResponse(bookmaker.provider, response.data, RequestType.BET_OFFER, bookmaker.bookmaker))})
                        .catch(error => console.log(error))
                }
            })
        }).flat().filter(x => x)
        let pinnacleOffers = []
        if(pinnacleRequests) {
            pinnacleOffers = await Promise.all(pinnacleRequests).then(values => {
                return parsePinnacleBetOffers(new ApiResponse(Provider.PINNACLE, values, RequestType.BET_OFFER))
            })
        }
        return Promise.all(requests).then(values => {
            // @ts-ignore
            const betOffers = mergeBetOffers(values.concat(pinnacleOffers))
            return new EventInfo(event.sportRadarId, event.sportRadarEventUrl, event.bookmakers, betOffers)
        })
    }
}

function mergeBetOffers(betOffers: BetOffer[]) {
    const merged = {}
    betOffers.flat().forEach(betOffer => {
        if(betOffer) {
            const key = betOffer.key
            const existing = merged[key]
            if(existing) {
                existing[betOffer.bookMaker] = betOffer.price
            } else {
                const prices = {}
                prices[betOffer.bookMaker] = betOffer.price
                merged[key] = prices
            }
        }
    })
    return merged
}

export async function getBetOffersForEvents(events: EventInfo[]) {
    const requests = events.map(event => {
        return getBetOffers(event)
    })
    return Promise.all(requests).then(values => {
        return values
    })
}

function getParserForBook(provider: Provider, bookmaker?: string) {
    switch(provider) {
        case(Provider.KAMBI):
            return parseKambiBetOffers
        case(Provider.SBTECH):
            return parseSbtechBetOffers
        case(Provider.BWIN):
            return parseBwinBetOffers
        case(Provider.PINNACLE):
            return parsePinnacleBetOffers
        case(Provider.CASHPOINT):
            return parseCashpointBetOffers
        case(Provider.ALTENAR):
            return parseAltenarBetOffers
        case(Provider.MERIDIAN):
            return parserMeridianBetOffers

    }
}