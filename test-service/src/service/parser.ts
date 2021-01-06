import {BetOffer, BetType} from '../domain/betoffer'

class KambiParser {
    static parse(bookMaker, apiResponse): BetOffer[] {
        if(!apiResponse.betOffers) return []
        return apiResponse.betOffers.map(betOffer => this.transformToBetOffers(bookMaker, betOffer)).flat()
    }

    static transformToBetOffers(bookMaker, betOfferContent): BetOffer[] {
        const typeId = betOfferContent.criterion.id
        const betOfferType = this.determineBetOfferType(typeId)
        const eventId = betOfferContent.eventId
        const betOffers = []
        betOfferContent.outcomes.forEach(outcome => {
            const outcomeType = this.determineOutcomeType(outcome.type)
            const price = Math.round(outcome.odds + Number.EPSILON) / 1000
            const line = outcome.line / 1000
            betOffers.push(new BetOffer(betOfferType, eventId, bookMaker, outcomeType, price, line))
        })
        return betOffers
    }

    private static determineBetOfferType(typeId): string  {
        switch(typeId){
            case 1001159858:
                return BetType._1X2.name
            case 1001159926:
                return BetType.OVER_UNDER_TOTAL_GOALS.name
            case 1001159711:
                return BetType.HANDICAP_GOALS.name
        }
    }

    private static determineOutcomeType(betOptionName) {
        switch(betOptionName){
            case 'OT_ONE':
                return '1'
            case 'OT_TWO':
                return '2'
            case 'OT_CROSS':
                return 'X'
            case 'OT_OVER':
                return 'OVER'
            case 'OT_UNDER':
                return 'UNDER'
        }
    }
}

export {
    KambiParser
}

export class SbtechParser {
    static parse(bookmaker, apiResponse): BetOffer[] {
        if(!apiResponse.markets) return
        return apiResponse.markets.map(market => SbtechParser.transformToBetOffer(bookmaker, market)).flat()
    }

    private static transformToBetOffer(bookmaker, market: any): BetOffer[] {
        const typeId = market.marketType.id
        const betOfferType = SbtechParser.determineBetOfferType(typeId)
        const eventId = market.eventId
        const betOffers = []
        market.selections.forEach(selection => {
            const outcomeType = SbtechParser.determineOutcomeType(selection.outcomeType)
            const price = selection.trueOdds
            const line = selection.points ? selection.points : NaN
            betOffers.push(new BetOffer(betOfferType, eventId, bookmaker, outcomeType, price, line))
        })
        return betOffers
    }

    private static determineOutcomeType(outcomeType) {
        switch(outcomeType){
            case 'Home':
                return '1'
            case 'Away':
                return '2'
            case 'Tie':
                return 'X'
            case 'Under':
                return 'UNDER'
            case 'Over':
                return 'OVER'
        }
    }

    private static determineBetOfferType(typeId: string): string {
        switch(typeId){
            case '1_0':
                return BetType._1X2.name

            case '3_0':
                return BetType.OVER_UNDER_TOTAL_GOALS.name
        }
    }
}