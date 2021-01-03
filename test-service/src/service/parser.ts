import {BetOffer, BetOption, BetType} from '../domain/betoffer'

class KambiParser {
    static parse(bookMaker, apiResponse): BetOffer[] {
        if(!apiResponse.betOffers) return []
        return apiResponse.betOffers.map(betOffer => this.transformToBetOffer(bookMaker, betOffer))
    }

    static transformToBetOffer(bookMaker, betOfferContent): BetOffer {
        const typeId = betOfferContent.criterion.id
        const betOfferType = this.determineBetOfferType(typeId)
        const betOptions = betOfferContent.outcomes.map(outcome => this.transformToBetOption(outcome))
        const eventId = betOfferContent.eventId
        return new BetOffer(betOfferType, betOptions, eventId, bookMaker)
    }

    private static determineBetOfferType(typeId): string  {
        switch(typeId){
            case 1001159858:
                return BetType._1X2.name
        }
    }

    private static transformToBetOption(outcome): BetOption {
        return new BetOption(outcome.englishLabel, Math.round(outcome.odds + Number.EPSILON) / 1000)
    }
}

export {
    KambiParser
}