import {BetOffer} from "../domain/betoffer";
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const betOffers = {}
const mappedEvents = new NodeCache({ stdTTL: ttlSeconds * 60 * 24, checkperiod: ttlSeconds * 0.2, useClones: false })

class ValueBetDetector {

    private _books
    private _mappedEvents

    BetOfferConsumer() {
        this._books = {}
        this._mappedEvents = {}
        // get mapped events
    }
    consumeBetOffer(betOffer: BetOffer) {
        const key = [betOffer.eventId, betOffer.betType, betOffer.betOptionName, betOffer.line].join(';')
        if(!this._books[betOffer.bookMaker.toUpperCase()]) {
            const betOfferCache = new NodeCache({ stdTTL: ttlSeconds * 60 * 24, checkperiod: ttlSeconds * 0.2,
                useClones: false })
            betOfferCache.set(key, betOffer.price)
            this._books[betOffer.bookMaker.toUpperCase()] = betOfferCache
        } else {
            this._books[betOffer.bookMaker.toUpperCase()].set(key, betOffer.price)
        }
        this.detectValueBets(betOffer)
    }

    async detectValueBets(betOffer: BetOffer) {
        const pinnacleEventId = this._mappedEvents[betOffer.bookMaker.toUpperCase()].get(betOffer.eventId)['PINNACLE']
        const pinnacleBetOffer = this._books['PINNACLE']
            .get([pinnacleEventId, betOffer.betType, betOffer.betOptionName, betOffer.line].join(';'))
        const value = (1 / pinnacleBetOffer.vigFreePrice * betOffer.price) - 1
        if(value > 0){
            const valueBetFound = new ValueBetFoundEvent(betOffer, value)
            console.log(JSON.stringify(valueBetFound))
        }
    }
}

class ValueBetFoundEvent {
    private _betOffer: BetOffer
    private _value: number

    constructor(betOffer, value){
        this._betOffer = betOffer
        this._value = value
    }
}