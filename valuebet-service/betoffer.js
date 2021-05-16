import {parseKambiBetOffers} from "./books/kambi";
import {parseBwinBetOffers} from "./books/bwin";
import {parsePinnacleBetOffers} from "./books/pinnacle";
import {parseAltenarBetOffers} from "./books/altenar";
import {parserMeridianBetOffers} from "./books/meridian";
import {parseBetwayBetOffers} from "./books/betway";
import {parseZetBetBetOffers} from "./books/zetbet";
import {parseStanleybetBetOffers} from "./books/stanleybet";
import {parseScoooreBetOffers} from "./books/scooore";
import {parseBingoalBetOffers} from "./books/bingoal";
import {EventInfo} from "../valuebet-service-ts/src/service/events";
import {Bookmaker} from "../valuebet-service-ts/src/service/bookmaker";
import {parseLadbrokesBetOffers} from "./books/ladbrokes";
import {parseSbtechBetOffers} from "./books/sbtech";
import {parseCashPointBetOffers} from "./books/cashpoint";

class BetOffer {
    constructor(betType, eventId, bookMaker, betOptionName, price, line, margin) {
        this.betOptionName = betOptionName
        this.price = price
        this.line = line
        this.betType = betType
        this.eventId = eventId
        this.bookMaker = bookMaker
        this.margin = margin
    }
}

class ValueBetFoundEvent {
    constructor(betOffer, value, eventInfo, bookmaker, price, margin, prediction, pinnaclePrice, pinnacleMargin){
        this.betOffer = betOffer
        this.value = value
        this.eventInfo = eventInfo
        this.bookmaker = bookmaker
        this.price = price
        this.margin = margin
        this.prediction = prediction
        this.pinnacleMargin = pinnacleMargin
        this.pinnaclePrice = pinnaclePrice
    }
}

function identifyValueBets(eventInfo){
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

async function getBetOffers(event) {
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

function mergeBetOffers(betOffers) {
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

async function getBetOffersForEvents(events) {
    const requests = events.map(event => {
        return getBetOffers(event)
    })
    return Promise.all(requests).then(values => {
        return values
    })
}

function getParserForBook(provider, bookmaker) {
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
            return parseCashPointBetOffers
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

exports.BetOffer = BetOffer
exports.getBetOffersForEvents = getBetOffersForEvents
exports.ValueBetFoundEvent = ValueBetFoundEvent
exports.identifyValueBets = identifyValueBets