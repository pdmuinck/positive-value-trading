import {EventInfo} from "../service/events";
import axios from "axios";
import {ApiResponse} from "./scraper";
import {RequestType} from "../domain/betoffer";
import {Provider} from "../service/bookmaker";
import {parseBwinBetOffers, parseKambiBetOffers, parseSbtechBetOffers} from "../service/parser";
import {BetOffer} from "../service/betoffers";

export async function getBetOffers(event: EventInfo): Promise<EventInfo> {
    if(event instanceof EventInfo) {
        const requests = event.bookmakers.map(bookmaker => {
            return axios.get(bookmaker.eventUrl, bookmaker.headers)
                .then(response => {
                    const parser = getParserForBook(bookmaker.provider)
                    return parser(new ApiResponse(bookmaker.provider, response.data, RequestType.BET_OFFER, bookmaker.bookmaker))})
                .catch(error => console.log(error))
        })
        return Promise.all(requests).then(values => {
            const betOffers = mergeBetOffers(values)
            return new EventInfo(event.sportRadarId, event.sportRadarEventUrl, event.bookmakers, betOffers)
        })
    }
}

function mergeBetOffers(betOffers: BetOffer[]) {
    const merged = {}
    betOffers.flat().forEach(betOffer => {
        const key = betOffer.betType + ";" + betOffer.betOptionName
        const existing = merged[key]
        if(existing) {
            existing[betOffer.bookMaker] = betOffer.price
        } else {
            const prices = {}
            prices[betOffer.bookMaker] = betOffer.price
            merged[key] = prices
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

function getParserForBook(provider: Provider) {
    switch(provider) {
        case(Provider.KAMBI):
            return parseKambiBetOffers
        case(Provider.SBTECH):
            return parseSbtechBetOffers
        case(Provider.BWIN):
            return parseBwinBetOffers
    }
}