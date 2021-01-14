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


export class ValueBetService {

    private _sportEventsCache = new NodeCache({ stdTTL: ttlSeconds * 60 * 24, checkperiod: ttlSeconds * 0.2, useClones: false })
    private _bookmakerEventIdCache = new NodeCache({ stdTTL: ttlSeconds * 60 * 24, checkperiod: ttlSeconds * 0.2, useClones: false })

    private readonly _scraper: Scraper

    constructor(scraper: Scraper, sportEvents: SportEvent[]){
        this._scraper = scraper
        sportEvents.forEach(sportEvent => {
            if(sportEvent.startDateTime && sportEvent.participants && sportEvent.participants.length == 2) {
                const eventKey = [sportEvent.startDateTime, sportEvent.participants.map(participant => participant.name).join(';')].join(';')
                this._sportEventsCache.set(eventKey, sportEvent)
                Object.keys(sportEvent.eventIds).forEach(bookmaker => {
                    this._bookmakerEventIdCache.set([bookmaker, sportEvent.eventIds[bookmaker]].join(';'), eventKey)
                })
            }
        })
    }

    async searchForValueBets(): Promise<ValueBetFoundEvent[]>{
        const apiResponses = await this.scrape()
        const betOffers: BetOffer[] = apiResponses.map(apiResponse => this.parse(apiResponse)).flat()
        betOffers.forEach(betOffer => {
            if(betOffer && betOffer.betType) {
                const eventKey = this._bookmakerEventIdCache.get([betOffer.bookMaker, betOffer.eventId].join(';'))
                if(eventKey) {
                    const sportEvent: SportEvent = this._sportEventsCache.get(eventKey)
                    sportEvent.registerBetOffer(betOffer)
                    this._sportEventsCache.set(eventKey, sportEvent)
                }
            }
        })
        const sportEvents: SportEvent[] = Object.values(this._sportEventsCache.mget(this._sportEventsCache.keys()))
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
        let results: ApiResponse[] = []
        await Promise.all(scrapeRequests).then(apiResponses => {
            results = apiResponses.filter(apiResponse => apiResponse).flat()
        })
        return results
    }

    get sportEvents(): SportEvent[] {
        return Object.values(this._sportEventsCache.mget(this._sportEventsCache.keys()))
    }

    get bookmakerEventCache() {
        return Object.values(this._bookmakerEventIdCache.mget(this._bookmakerEventIdCache.keys()))
    }


    // serves an endpoint to get value bets
    getValueBets(){

    }




}

