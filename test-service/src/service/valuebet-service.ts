import {BetOffer} from "../domain/betoffer";
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const betOffers = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })
const mappedEvents = new NodeCache({ stdTTL: ttlSeconds * 60 * 24, checkperiod: ttlSeconds * 0.2, useClones: false })

class BetOfferConsumer {
    static consumeBetOffer(betOffer: BetOffer) {
        betOffers.set([betOffer.bookMaker.toUpperCase(), betOffer.eventId, betOffer.betType, betOffer.betOptionName, betOffer.line].join(';'), betOffer.price)
        this.detectValueBets(betOffer)
    }

    static async detectValueBets(betOffer: BetOffer) {
        const key = [betOffer.bookMaker, betOffer.eventId].join(';')
        const pinnacleEventId = mappedEvents.get(key)['PINNACLE'].eventId
        const pinnacleKey = ['PINNACLE', pinnacleEventId, betOffer.betType, betOffer.betOptionName, betOffer.line].join(';')
        const pinnacleBetOffer = betOffers.get(pinnacleKey)

    }
}