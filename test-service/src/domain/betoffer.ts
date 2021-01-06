class BetOffer {
    private readonly _betType: string
    private readonly _eventId: number
    private readonly _bookMaker: string
    private readonly _betOptionName: string
    private readonly _price: number
    private readonly _line: number

    constructor(betType, eventId, bookMaker, betOptionName, price, line) {
        this._betOptionName = betOptionName
        this._price = price
        this._line = line
        this._betType = betType
        this._eventId = eventId
        this._bookMaker = bookMaker
    }

    get betOptionName(){
        return this._betOptionName
    }

    get price(){
        return this._price
    }

    get line(){
        return this._line
    }

    get betType(){
        return this._betType
    }

    get eventId() {
        return this._eventId
    }

    get bookMaker(){
        return this._bookMaker
    }
}

const BetType = {
    '_1X2': {betOptions: 3, name: '1X2'},
    'MONEY_LINE': 2,
    'OVER_UNDER_TOTAL_GOALS': {betOptions: 2, name: "OVER_UNDER_TOTAL_GOALS"},
    'HANDICAP_GOALS': {betOptions: 2, name: "HANDICAP_GOALS"}
}

const BookMaker = {
    'UNIBET_BELGIUM': 1,
    'NAPOLEON_GAMES': 2
}

class BetOfferPublished {
    betOfferId: number

    constructor(betOfferId) {
        this.betOfferId = betOfferId
    }
}

export {
    BetOfferPublished, BookMaker, BetOffer, BetType
}