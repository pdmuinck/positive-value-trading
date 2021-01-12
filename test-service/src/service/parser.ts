import {BetOffer, BetType, BookMaker} from '../domain/betoffer'
import {ApiResponse} from "../client/scraper";

export class KambiParser {
    static parse(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.betOffers) return []
        return apiResponse.data.betOffers.map(betOffer => this.transformToBetOffers(apiResponse.bookmaker, betOffer)).flat()
    }

    static transformToBetOffers(bookMaker: BookMaker, betOfferContent): BetOffer[] {
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

    private static determineBetOfferType(typeId): BetType  {
        switch(typeId){
            case 1001159858:
                return BetType._1X2
            case 1001159926:
                return BetType.OVER_UNDER
            case 1001159711:
                return BetType.HANDICAP
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

export class SbtechParser {
    static parse(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.markets) return []
        return apiResponse.data.markets.map(market => SbtechParser.transformToBetOffer(apiResponse.bookmaker, market)).flat()
    }

    private static transformToBetOffer(bookmaker: BookMaker, market: any): BetOffer[] {
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

    private static determineOutcomeType(outcomeType): string {
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

    private static determineBetOfferType(typeId: string): BetType {
        switch(typeId){
            case '1_0':
                return BetType._1X2

            case '3_0':
                return BetType.OVER_UNDER
        }
    }
}

export class AltenarParser {
    static parse(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.Result) return []
        return apiResponse.data.Result.Items[0].Events.map(event => AltenarParser.transformToBetOffer(apiResponse.bookmaker, event)).flat()
    }

    private static transformToBetOffer(bookMaker: BookMaker, event): BetOffer[] {
        const betOffers = []
        const eventId = event.Id
        event.Items.map(item => {
            const betType = AltenarParser.determineBetType(item.MarketTypeId)
            item.Items.forEach(option => {
                const price = option.Price
                let outcome = option.Name.toUpperCase()
                let line = item.SpecialOddsValue === '' ? NaN : parseFloat(item.SpecialOddsValue)
                if(betType === BetType.HANDICAP) {
                    outcome = option.Name.split('(')[0].trim().toUpperCase()
                    line = parseFloat(option.Name.split('(')[1].split(')')[0].trim().toUpperCase())
                } else if(betType === BetType.OVER_UNDER){
                    outcome = outcome.includes('OVER') ? 'OVER' : 'UNDER'
                }
                betOffers.push(new BetOffer(betType, eventId, bookMaker, outcome, price, line))
            })
        })
        return betOffers
    }

    private static determineBetType(typeId: string): BetType {
        if(typeId.startsWith("1_")) return BetType._1X2
        if(typeId.startsWith("10_")) return BetType.DOUBLE_CHANCE
        if(typeId.startsWith("16_")) return BetType.HANDICAP
        if(typeId.startsWith("18_")) return BetType.OVER_UNDER
    }
}

export class BetcenterParser {
    static parse(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.games) return []
        return apiResponse.data.games.map(event => BetcenterParser.transformToBetOffer(apiResponse.bookmaker, event)).flat()
    }

    private static transformToBetOffer(bookMaker: BookMaker, event): BetOffer[] {
        const betOffers = []
        event.markets.forEach(market => {
            const betType = BetcenterParser.determineBetType(market.id)
            const line = BetcenterParser.determineBetLine(market, betType)
            market.tips.forEach(tip => {
                let outcome = tip.text.toUpperCase()
                const price = tip.odds / 100
                if(betType === BetType.OVER_UNDER) {
                    outcome = outcome.includes('+') ? 'OVER' : 'UNDER'
                }
                betOffers.push(new BetOffer(betType, event.id, bookMaker, outcome, price, line))
            })
        })
        return betOffers
    }

    private static determineBetType(id): BetType {
        switch(id){
            case 22242:
                return BetType._1X2
            case 22462:
                return BetType.OVER_UNDER
            case 22252:
                return BetType.OVER_UNDER
            case 22472:
                return BetType.OVER_UNDER
            case 22482:
                return BetType.OVER_UNDER
            case 22492:
                return BetType.OVER_UNDER
            case 22502:
                return BetType.OVER_UNDER
            case 22512:
                return BetType.OVER_UNDER
            case 22522:
                return BetType.DOUBLE_CHANCE
        }

    }

    private static determineBetLine(market, betType) {
        if(betType === BetType.OVER_UNDER){
            return market.anchor
        } else {
            return NaN
        }
    }
}

export class LadbrokesParser {
    static parse(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.result.dataGroupList) return []
        return apiResponse.data.result.dataGroupList.map(group => group.itemList).flat()
            .map(event => LadbrokesParser.transformToBetOffer(apiResponse.bookmaker, event)).flat()
    }

    private static transformToBetOffer(bookMaker: BookMaker, event): BetOffer[] {
        const betOffers = []
        const eventId = event.eventInfo.aliasUrl
        event.betGroupList[0].oddGroupList.forEach(market => {
            const betType = LadbrokesParser.determineBetOfferType(market.betId)
            if(betType !== BetType.UNKNOWN) {
                const line = market.additionalDescription ? parseFloat(market.additionalDescription.toUpperCase().trim()): NaN
                market.oddList.forEach(option => {
                    const outcome = option.oddDescription.toUpperCase()
                    const price = option.oddValue / 100
                    betOffers.push(new BetOffer(betType, eventId, bookMaker, outcome, price, line))
                })
            }
        })
        return betOffers
    }

    // @ts-ignore
    private static determineBetOfferType(id: number): BetType {
        switch(id){
            case 24:
                return BetType._1X2
            case 1907:
                return BetType.OVER_UNDER
            default:
                return BetType.UNKNOWN
        }
    }
}

export class MeridianParser {
    static parse(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.events) return []
        return apiResponse.data.events.map(date => date.events).flat()
            .map(event => MeridianParser.parseBetOffers(apiResponse.bookmaker, event))
            .flat()
    }

    private static parseBetOffers(bookMaker: BookMaker, event): BetOffer[] {
        const betOffers = []
        const eventId = event.id
        event.market.forEach(betOffer => {
            const betType = MeridianParser.determineBetType(betOffer.templateId)
            if(betType !== BetType.UNKNOWN) {
                const line = betOffer.overUnder ? parseFloat(betOffer.overUnder) : NaN
                betOffer.selection.forEach(option => {
                    const price = parseFloat(option.price)
                    const outcome = option.nameTranslations.filter(trans => trans.locale === 'en')[0].translation.toUpperCase()
                    betOffers.push(new BetOffer(betType, eventId, bookMaker, outcome, price, line))
                })
            }
        })
        return betOffers
    }

    private static determineBetType(id: string): BetType {
        switch(id){
            case '3999':
                return BetType._1X2
            case '4004':
                return BetType.OVER_UNDER
            case '4008':
                return BetType.DOUBLE_CHANCE
            default:
                return BetType.UNKNOWN
        }
    }
}

export class PinnacleParser {
    static parse(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data) return []
        return apiResponse.data.map(offer => PinnacleParser.parseBetOffers(apiResponse.bookmaker, offer)).flat()
    }

    private static parseBetOffers(bookMaker: BookMaker, offer): BetOffer[] {
        const betOffers = []
        const eventId = offer.matchupId
        const betType = PinnacleParser.determineBetType(offer.key)
        const vigFreePrices = PinnacleParser.calculateVigFreePrices(offer.prices)
        offer.prices.forEach(price => {
            const outcome = PinnacleParser.determineOutcome(price.designation.toUpperCase())
            const line = price.points ? price.points : NaN
            const odds = this.toDecimalOdds(price.price)
            betOffers.push(new BetOffer(betType, eventId, bookMaker, outcome, odds, line,
                parseFloat(vigFreePrices.filter(vigFreePrice => vigFreePrice.outcomeType === outcome)[0].vigFreePrice)))
        })
        return betOffers
    }

    private static determineBetType(key): BetType {
        if(key === 's;0;m') return BetType._1X2
        if(key.includes('s;0;ou')) return BetType.OVER_UNDER
    }

    static toDecimalOdds(americanOdds): number {

        if(americanOdds < 0) {
            return parseFloat(((100 / Math.abs(americanOdds)) + 1).toFixed(2))
        } else {
            return parseFloat(((americanOdds / 100) + 1).toFixed(2))
        }

    }

    private static determineOutcome(outcome: string) {
        switch(outcome) {
            case 'HOME':
                return '1'
            case 'AWAY':
                return '2'
            case 'DRAW':
                return 'X'
            default:
                return outcome
        }
    }

    private static calculateVigFreePrices(prices) {
        const decimalOdds = prices.map(price => this.toDecimalOdds(price.price))
        let vig = 0

        decimalOdds.forEach(odd => {
            vig += 1/odd
        })

        const vigFreePrices = []
        prices.forEach(price => {
            const outcomeType = this.determineOutcome(price.designation.toUpperCase())
            const vigFreePrice = this.toDecimalOdds(price.price) / vig
            vigFreePrices.push({outcomeType: outcomeType, vigFreePrice: vigFreePrice.toFixed(2)})
        })
        return vigFreePrices
    }
}