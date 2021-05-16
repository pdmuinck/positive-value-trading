exports.calculateMargin = function calculateMargin(odds) {
    let margin = 0
    odds.forEach(odd => {
        margin += 1/odd
    })
    return margin
}

exports.BetOffer = class BetOffer {
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

exports.ValueBetFoundEvent = class ValueBetFoundEvent {
    constructor(betOffer, value, eventInfo, bookmaker, price, margin, prediction, pinnaclePrice, pinnacleMargin){
        this.betOffer = betOffer
        this.value = value
        this.eventInfo = eventInfo
        this.bookmaker = bookmaker
        this.price = price
        this.margin = margin
        this.prediction = prediction
        this.pinnacleMargin = pinnacleMargin
        this.pinnaclePrice = pinnaclePrice
    }
}