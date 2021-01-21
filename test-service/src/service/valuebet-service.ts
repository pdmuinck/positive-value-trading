import {Scraper} from "../client/scraper";
import {BetOffer, SportEvent, SportName, ValueBetFoundEvent} from "../domain/betoffer";
import { Parser } from "./parser";

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
                sportEvent.bookmakerIds.forEach(bookmakerId => {
                    this._bookmakerEventIdCache.set([bookmakerId.bookmaker, bookmakerId.id].join(';'), eventKey)
                })
            }
        })
    }

    async searchForValueBets(): Promise<ValueBetFoundEvent[]>{
        const apiResponses = await this._scraper.getBetOffers(SportName.FOOTBALL)
        const betOffers: BetOffer[] = apiResponses.map(apiResponse => Parser.parse(apiResponse)).flat()
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

