export class ValueBetFoundEvent {
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