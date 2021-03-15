import {BetType, Bookmaker, Period} from "./bookmaker";

export class BetOffer {
    private readonly _betType: BetType
    private readonly _eventId: number
    private readonly _bookMaker: Bookmaker
    private readonly _betOptionName: string
    private readonly _price: number
    private readonly _vigFreePrice: number
    private readonly _line: number
    private readonly _handicap: string

    constructor(betType: BetType, eventId, bookMaker, betOptionName, price, line, vigFreePrice?: number, handicap?: string) {
        this._betOptionName = betOptionName
        this._price = price
        this._line = line
        this._betType = betType
        this._eventId = eventId
        this._bookMaker = bookMaker
        this._vigFreePrice = vigFreePrice
        this._handicap = handicap
    }

    get handicap() {
        return this._handicap
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

    get vigFreePrice(){
        return this._vigFreePrice
    }

    get key(){
        return [this._betType, this._betOptionName, this._line].join(';')
    }
}