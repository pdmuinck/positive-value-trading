import {EventInfo} from "../service/events";
import axios from "axios";
import {Bookmaker, Provider} from "../service/bookmaker"
import {BetOffer} from "../service/betoffers";
import {parseKambiBetOffers} from "./kambi/kambi";
import {parseSbtechBetOffers} from "./sbtech/sbtech";
import {parseBwinBetOffers} from "./bwin";
import {parsePinnacleBetOffers} from "./pinnacle/pinnacle";
import {parseCashpointBetOffers} from "./cashpoint/cashpoint";
import {parseAltenarBetOffers} from "./altenar/altenar";
import {parserMeridianBetOffers} from "./meridian/meridian";
import {parseBetwayBetOffers} from "./betway/betway";
import {parseZetBetBetOffers} from "./zetbet/zetbet";
import {parseStanleybetBetOffers} from "./stanleybet/stanleybet";
import {parseScoooreBetOffers} from "./scooore/scooore";
import {parseLadbrokesBetOffers} from "./ladbrokes/ladbrokes";
import {parseBingoalBetOffers} from "./bingoal/bingoal";
import {ValueBetFoundEvent} from "../domain/valuebet";
import {ApiResponse} from "./apiResponse";

export function calculateMargin(odds): number {
    let margin = 0
    odds.forEach(odd => {
        margin += 1/odd
    })
    return margin
}

export function identifyValueBets(eventInfo: EventInfo){
    return Object.keys(eventInfo.betOffers).map(betOfferType => {
        const betOffers = eventInfo.betOffers[betOfferType]
        if(Object.keys(betOffers).includes("PINNACLE")) {
            const pinnaclePrice = betOffers["PINNACLE"]
            const vigFreePrediction = pinnaclePrice.price * pinnaclePrice.margin
            return Object.keys(betOffers).filter(bookmaker => bookmaker !== "PINNACLE").map(bookmaker => {
                const bookmakerPrice = betOffers[bookmaker]
                const value = (1 / vigFreePrediction * bookmakerPrice.price) - 1;
                if (value > 0) {
                    return new ValueBetFoundEvent(betOfferType, value, eventInfo, bookmaker, bookmakerPrice.price,
                        bookmakerPrice.margin, vigFreePrediction, pinnaclePrice.price, pinnaclePrice.margin);
                }
            }).filter(x => x).flat()
        }
    }).filter(x => x).flat()
}

export async function getBetOffers(event: EventInfo): Promise<EventInfo> {
    if(event instanceof EventInfo) {
        const pinnacleBookmakerInfo = event.bookmakers.filter(bookmaker => bookmaker.bookmaker === Bookmaker.PINNACLE)[0]
        const pinnacleRequests = pinnacleBookmakerInfo?.eventUrl.map(eventUrl => {
            return axios.get(eventUrl, pinnacleBookmakerInfo.headers)
                .then(response => response.data)
                .catch(error => console.log(error))
        })
        const requests = event.bookmakers.filter(bookmaker => bookmaker.bookmaker !== Bookmaker.PINNACLE
            && bookmaker.provider !== Provider.BETCONSTRUCT).map(bookmaker => {
            return bookmaker.eventUrl.map(eventUrl => {
                if(bookmaker.httpMethod === "GET") {
                    return axios.get(eventUrl, bookmaker.headers)
                        .then(response => {
                            const parser = getParserForBook(bookmaker.provider)
                            return parser(new ApiResponse(bookmaker.provider, response.data, bookmaker.bookmaker))})
                        .catch(error => console.log(error))
                } else if(bookmaker.httpMethod === "POST") {
                    return axios.post(eventUrl, bookmaker.requestBody, bookmaker.headers)
                        .then(response => {
                            const parser = getParserForBook(bookmaker.provider, bookmaker.bookmaker)
                            return parser(new ApiResponse(bookmaker.provider, response.data, bookmaker.bookmaker))})
                        .catch(error => console.log(error))
                } else {
                    // wss taken care before, see betconstructRequests

                }
            })
        }).flat().filter(x => x)
        let pinnacleOffers = []
        if(pinnacleRequests) {
            pinnacleOffers = await Promise.all(pinnacleRequests).then(values => {
                return parsePinnacleBetOffers(new ApiResponse(Provider.PINNACLE, values))
            })
        }
        return Promise.all(requests).then(values => {
            // @ts-ignore
            const betOffers = mergeBetOffers(values.flat().concat(pinnacleOffers))
            return new EventInfo(event.sportRadarId, event.sportRadarEventUrl, event.bookmakers, betOffers, event.sportRadarMatch)
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
                existing[betOffer.bookMaker] = {price: betOffer.price, margin: betOffer.margin}
            } else {
                const prices = {}
                prices[betOffer.bookMaker] = {price: betOffer.price, margin: betOffer.margin}
                merged[key] = prices
            }
        }
    })
    return merged
}

export async function getBetOffersForEvents(events: EventInfo[]) {
    /*const magicBettingMarketIds = events.map(event => event.bookmakers).flat().filter(bookmaker => bookmaker.provider === Provider.PLAYTECH).map(bookmaker => bookmaker.eventUrl).flat()
    const websocketRequests = events[1].bookmakers.filter(bookmaker => bookmaker.provider === Provider.BETCONSTRUCT).map(bookmaker => {
        return getBetconstructBetOffersForCompetition(bookmaker)
    })
    websocketRequests.push(getPlaytechBetOffers(magicBettingMarketIds))
    const websocketOffers = await Promise.all(websocketRequests).then(values => {
        return values.flat()
    })*/
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
        case(Provider.BETWAY):
            return parseBetwayBetOffers
        case(Provider.ZETBET):
            return parseZetBetBetOffers
        case(Provider.STANLEYBET):
            return parseStanleybetBetOffers
        case(Provider.SCOOORE):
            return parseScoooreBetOffers
        case(Provider.LADBROKES):
            return parseLadbrokesBetOffers
        case(Provider.BINGOAL):
            return parseBingoalBetOffers

    }
}