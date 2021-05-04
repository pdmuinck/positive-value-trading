class BetOffer {
    constructor(betType, eventId, bookMaker, betOptionName, price, line, margin) {
        this.betOptionName = betOptionName
        this.price = price
        this.line = line
        this.betType = betType
        this.eventId = eventId
        this.bookMaker = bookMaker
        this.margin = margin
    }
}

exports.BetOffer = BetOffer