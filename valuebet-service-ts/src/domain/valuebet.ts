import {EventInfo} from "../service/events";
import {Bookmaker} from "../service/bookmaker";

export class ValueBetFoundEvent {
    private readonly _eventInfo: EventInfo
    private readonly _betOffer: string
    private readonly _value: number
    private readonly _bookmaker: Bookmaker
    private readonly _price: number
    private readonly _prediction: number
    private readonly _pinnaclePrice: number
    private readonly _pinnacleMargin: number
    private readonly _margin: number

    constructor(betOffer: string, value: number, eventInfo, bookmaker, price, margin, prediction, pinnaclePrice, pinnacleMargin){
        this._betOffer = betOffer
        this._value = value
        this._eventInfo = eventInfo
        this._bookmaker = bookmaker
        this._price = price
        this._margin = margin
        this._prediction = prediction
        this._pinnacleMargin = pinnacleMargin
        this._pinnaclePrice = pinnaclePrice
    }

    get margin() {
        return this._margin
    }

    get pinnaclePrice() {
        return this._pinnaclePrice
    }

    get getPinnacleMargin() {
        return this._pinnacleMargin
    }

    get betOffer(){
        return this._betOffer
    }

    get value() {
        return this._value
    }

    get bookmaker() {
        return this._bookmaker
    }

    get eventInfo() {
        return this._eventInfo
    }

    get price() {
        return this._price
    }

    get prediction() {
        return this._prediction
    }
}