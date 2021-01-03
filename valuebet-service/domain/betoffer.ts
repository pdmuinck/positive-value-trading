class BetOffer {
    private betOfferId: bigint
    private markets: Market[]
    private eventId: bigint
    private bookmakerId: number

    constructor(betOfferId, markets, eventId, bookmakerId) {
        this.betOfferId = betOfferId
        this.markets = markets
        this.eventId = eventId
        this.bookmakerId = bookmakerId
    }

    publishBetOffer() {


    }
}

class Market {
    private marketId: number
    private marketName: string
    private marketOptions: MarketOption[]

    constructor(marketId, marketName, marketOptions) {
        this.marketId = marketId
        this.marketName = marketName
        this.marketOptions = marketOptions
    }
}

class MarketOption {
    private marketOptionId: number
    private marketOptionName: string
    private price: number

    constructor(marketOptionId, marketOptionName, price) {
        this.marketOptionId = marketOptionId
        this.marketOptionName = marketOptionName
        this.price = price
    }
}

class BetOfferPublished {
    betOfferId: bigint

    constructor(betOfferId) {
        this.betOfferId = betOfferId
    }
}

module.exports = {
    BetOffer, Market, MarketOption, BetOfferPublished
}