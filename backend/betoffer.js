const {parseCashPointBetOffers}= require("./parser/cashpoint");
const {parserMeridianBetOffers}= require("./parser/meridian");
const {parseBetwayBetOffers}= require("./parser/betway");
const {parseZetBetBetOffers}= require("./parser/zetbet");
const {parseStanleybetBetOffers}= require("./parser/stanleybet");
const {parseScoooreBetOffers}= require("./parser/scooore");
const {parseLadbrokesBetOffers}= require("./parser/ladbrokes");
const {parseBingoalBetOffers}= require("./parser/bingoal");
const {parseAltenarBetOffers} = require("./parser/altenar");
const {parsePinnacleBetOffers} = require("./parser/pinnacle");
const {parseBwinBetOffers} = require("./parser/bwin");
const {parseSbtechBetOffers} = require("./parser/sbtech");
const {parseKambiBetOffers} = require("./parser/kambi");

const axios = require("axios")
const {ApiResponse} = require("./parser/bookmaker");
const {Bookmaker, Provider} = require("./bookmaker");
const {ValueBetFoundEvent} = require("./utils");
const {Event} = require("./event")


function identifyValueBets(eventInfo){
    return Object.keys(eventInfo.betOffers).map(betOfferKey => {
        const betOffers = eventInfo.betOffers[betOfferKey]
        if(Object.keys(betOffers).includes("PINNACLE")) {
            const pinnaclePrice = betOffers["PINNACLE"]
            const vigFreePrediction = pinnaclePrice.price * pinnaclePrice.margin
            return Object.keys(betOffers).filter(bookmaker => bookmaker !== "PINNACLE").map(bookmaker => {
                const bookmakerPrice = betOffers[bookmaker]
                const value = (1 / vigFreePrediction * bookmakerPrice.price) - 1
                if (value > 0) {
                    return new ValueBetFoundEvent(betOfferKey, value, eventInfo, bookmaker, bookmakerPrice.price,
                        bookmakerPrice.margin, vigFreePrediction, pinnaclePrice.price, pinnaclePrice.margin);
                }
            }).filter(x => x).flat()
        }
    }).filter(x => x).flat()
}

exports.identifyValueBets = identifyValueBets

async function getBetOffers(event) {
    if(event) {
        const pinnacleBookmakerInfo = event.bookmakerInfo.filter(bookmaker => bookmaker.bookmaker === Bookmaker.PINNACLE)[0]
        const pinnacleRequests = pinnacleBookmakerInfo?.eventUrl.map(eventUrl => {
            return axios.get(eventUrl, pinnacleBookmakerInfo.headers)
                .then(response => response.data)
                .catch(error => console.log(error))
        })
        const requests = event.bookmakerInfo.filter(bookmaker => bookmaker.bookmaker !== Bookmaker.PINNACLE
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
                return parsePinnacleBetOffers(values[0], values[1])
            })
        }
        return Promise.all(requests).then(values => {
            // @ts-ignore
            const betOffers = mergeBetOffers(values.flat().concat(pinnacleOffers))
            return new Event(event.sportRadarId, event.sportRadarEventUrl, event.bookmakers, event.sportRadarMatch, betOffers)
        })
    }
}

exports.getBetOffers = getBetOffers

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
    if(events) {
        const requests = events.map(event => {
            return getBetOffers(event)
        })
        return Promise.all(requests).then(values => {
            return values.map(value => identifyValueBets(value)).flat()
        })
    }

}

exports.getBetOffersForEvents = getBetOffersForEvents

function getParserForBook(provider, bookmaker) {
    switch (provider) {
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