import {ApiResponse, Scraper} from "../client/scraper";
import {BetOffer, BookMaker, SportEvent, ValueBetFoundEvent} from "../domain/betoffer";
import {
    AltenarParser,
    BetcenterParser,
    KambiParser,
    LadbrokesParser,
    MeridianParser,
    PinnacleParser,
    SbtechParser
} from "./parser";

const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const sportEventsCache = new NodeCache({ stdTTL: ttlSeconds * 60 * 24, checkperiod: ttlSeconds * 0.2, useClones: false })
const bookmakerEventIdCache = new NodeCache({ stdTTL: ttlSeconds * 60 * 24, checkperiod: ttlSeconds * 0.2, useClones: false })

export class ValueBetService {

    private readonly _scraper: Scraper

    constructor(scraper: Scraper, sportEvents: SportEvent[]){
        this._scraper = scraper
        sportEvents.forEach(sportEvent => {
            const eventKey = [sportEvent.startDateTime, sportEvent.participants.map(participant => participant.name).join(';')].join(';')
            sportEventsCache.set(eventKey, sportEvent)
            Object.keys(sportEvent.eventIds).forEach(bookmaker => {
                bookmakerEventIdCache.set([bookmaker, sportEvent.eventIds[bookmaker]].join(';'), eventKey)
            })
        })
    }

    async searchForValueBets(): Promise<ValueBetFoundEvent[]>{
        const apiResponses = await this.scrape()
        const betOffers: BetOffer[] = apiResponses.map(apiResponse => this.parse(apiResponse)).flat()
        betOffers.forEach(betOffer => {
            const eventKey = bookmakerEventIdCache.get([betOffer.bookMaker, betOffer.eventId].join(';'))
            const sportEvent: SportEvent = sportEventsCache.get(eventKey)
            sportEvent.registerBetOffer(betOffer)
            sportEventsCache.set(eventKey, sportEvent)
        })
        const sportEvents: SportEvent[] = Object.values(sportEventsCache.mget(sportEventsCache.keys()))
        const valueBets: ValueBetFoundEvent[] = sportEvents.map(sportEvent => sportEvent.detectValueBets()).flat()
        // produce kafka messages
        return valueBets
    }

    private parse(apiResponse: ApiResponse): BetOffer[] {
        switch(apiResponse.bookmaker) {
            case BookMaker.BETCENTER:
                return BetcenterParser.parse(apiResponse)
            case BookMaker.PINNACLE:
                return PinnacleParser.parse(apiResponse)
            case BookMaker.UNIBET_BELGIUM:
                return KambiParser.parse(apiResponse)
            case BookMaker.NAPOLEON_GAMES:
                return KambiParser.parse(apiResponse)
            case BookMaker.GOLDEN_PALACE:
                return AltenarParser.parse(apiResponse)
            case BookMaker.BETFIRST:
                return SbtechParser.parse(apiResponse)
            case BookMaker.LADBROKES:
                return LadbrokesParser.parse(apiResponse)
            case BookMaker.MERIDIAN:
                return MeridianParser.parse(apiResponse)
            default:
                return []
        }
    }

    private async scrape(): Promise<ApiResponse[]> {
        const scrapeRequests = Object.keys(BookMaker).map(key => {
            return this._scraper.getBetOffersByBook(BookMaker[key])
        })
        const results: ApiResponse[] = []
        await Promise.all(scrapeRequests).then(apiResponses => {
            apiResponses.forEach(response => {
                for(let i = 0; i < response.length; i++){
                    results.push(response[i])
                }
            })
        })
        return results
    }


    // serves an endpoint to get value bets
    getValueBets(){

    }




}

