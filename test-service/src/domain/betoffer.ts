class BetOffer {
    private readonly _betType: string
    private readonly _betOptions: BetOption[]
    private readonly _eventId: number
    private readonly _bookMaker: string

    constructor(betType, betOptions, eventId, bookMaker) {
        this._betType = betType
        this._betOptions = betOptions
        this._eventId = eventId
        this._bookMaker = bookMaker
    }

    get betType(){
        return this._betType
    }

    get betOptions(){
        return this._betOptions
    }

    get eventId() {
        return this._eventId
    }

    get bookMaker(){
        return this._bookMaker
    }
}

class BetOption {
    private readonly _betOptionName: string
    private readonly _price: number

    constructor(betOptionName, price) {
        this._betOptionName = betOptionName
        this._price = price
    }

    get betOptionName(){
        return this._betOptionName
    }

    get price(){
        return this._price
    }
}

const BetType = {
    '_1X2': {betOptions: 3, name: '1X2'},
    'MONEY_LINE': 2,
    'OVER_UNDER': 3,
    'HANDICAP': 4
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
    BetOffer, BetOfferPublished, BookMaker, BetOption, BetType
}