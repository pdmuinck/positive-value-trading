import {BetType} from "./bookmaker";

export class BetOffer {
    private readonly _betType: BetType
    private readonly _eventId: string
    private readonly _bookMaker: string
    private readonly _betOptionName: string
    private readonly _price: number
    private readonly _line: number
    private readonly _margin: number

    constructor(betType: BetType, eventId, bookMaker, betOptionName, price, line, margin: number) {
        this._betOptionName = betOptionName
        this._price = price
        this._line = line
        this._betType = betType
        this._eventId = eventId
        this._bookMaker = bookMaker
        this._margin = margin
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

    get key(){
        return [this._betType, this._betOptionName, this._line].join(';')
    }

    get margin() {
        return this._margin
    }
}