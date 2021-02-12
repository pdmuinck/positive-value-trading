class BetOffer {
    constructor(betOfferId, markets, eventId, bookmakerId) {
        this.betOfferId = betOfferId;
        this.markets = markets;
        this.eventId = eventId;
        this.bookmakerId = bookmakerId;
    }
    publishBetOffer() {
    }
}
class Market {
    constructor(marketId, marketName, marketOptions) {
        this.marketId = marketId;
        this.marketName = marketName;
        this.marketOptions = marketOptions;
    }
}
class MarketOption {
    constructor(marketOptionId, marketOptionName, price) {
        this.marketOptionId = marketOptionId;
        this.marketOptionName = marketOptionName;
        this.price = price;
    }
}
class BetOfferPublished {
    constructor(betOfferId) {
        this.betOfferId = betOfferId;
    }
}
module.exports = {
    BetOffer, Market, MarketOption, BetOfferPublished
};
//# sourceMappingURL=betoffer.js.map