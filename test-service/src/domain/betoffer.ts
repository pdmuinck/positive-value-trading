
export class SportEvent {
    private readonly _startDateTime: Date
    private readonly _competition: SportCompetition
    private readonly _sport: Sport
    private readonly _eventIds: Map<BookMaker, string>
    private readonly _betOffers: Map<string, Map<BookMaker, BetOffer>>
    private readonly _closingLines: Map<string, Map<BookMaker, BetOffer>>
    private readonly _participants: Participant[]

    constructor(startDateTime, competition, sport, eventIds, betOffers, closingLines, participants){
        this._startDateTime = startDateTime
        this._betOffers = betOffers
        this._eventIds = eventIds
        this._sport = sport
        this._competition = competition
        this._betOffers = betOffers
        this._closingLines = closingLines
        this._participants = participants
    }

    get startDateTime(){
        return this._startDateTime
    }

    get competition(){
        return this._competition
    }

    get sport(){
        return this._sport
    }

    get eventIds() {
        return this._eventIds
    }

    get betOffers() {
        return this._betOffers
    }

    get closingLines(){
        return this._closingLines
    }
    get participants(){
        return this._participants
    }

    registerBetOffer(betOffer: BetOffer): BetOfferRegistered {
        return this.registerBetOfferInCollection(betOffer, this._betOffers)
    }

    registerClosingLine(betOffer: BetOffer): ClosingLineRegistered {
        return this.registerBetOfferInCollection(betOffer, this._closingLines)
    }

    private registerBetOfferInCollection(betOffer: BetOffer, betOfferCollection) {
        if(Object.values(this._eventIds).includes(betOffer.eventId.toString())) {
            const key = betOffer.key
            const betOffers = betOfferCollection[key]
            if(betOffers) {
                betOffers[betOffer.bookMaker] = betOffer
                betOfferCollection[key] = betOffers
            } else {
                const toRegister = {}
                toRegister[betOffer.bookMaker] = betOffer
                betOfferCollection[key] = toRegister
            }
            return new BetOfferRegistered(betOffer)
        }
    }

    detectValueBets(betOfferKey?: string): ValueBetFoundEvent[] {
        if(betOfferKey) {
            return this.findValue(betOfferKey)
        } else {
            const foundValueBets = []
            Object.keys(this._betOffers).forEach(betOfferKey => {
                const valueBets = this.findValue(betOfferKey)
                if(valueBets) foundValueBets.push(valueBets.filter(valueBet => valueBet))
            })
            return foundValueBets.flat()
        }
    }

    private findValue(betOfferKey): ValueBetFoundEvent[]{
        const pinnacleBetOffer = this._betOffers[betOfferKey][BookMaker.PINNACLE]
        if(pinnacleBetOffer) {
            return Object.keys(this._betOffers[betOfferKey]).filter(bookmaker => bookmaker != BookMaker.PINNACLE)
                .map(bookmaker => {
                if(bookmaker != BookMaker.PINNACLE) {
                    const betOffer = this._betOffers[betOfferKey][bookmaker]
                    const value = (1 / pinnacleBetOffer.vigFreePrice * betOffer.price) - 1
                    if (value > 0) {
                        return new ValueBetFoundEvent(betOffer, value)
                    }
                }
            })
        }
    }

    calculateMetrics(tradedBetOffer: TradedBetOffer, closingLine: ClosingLineRegistered): PerformanceMetric {
        if(closingLine.bookMaker === BookMaker.PINNACLE) {
            // only check closing line pinnacle or other sharp, because that is the best guess of outcome game
            const realValue = (1 / closingLine.betOffer.vigFreePrice + tradedBetOffer.betOffer.price) - 1
            return new PerformanceMetric(realValue, tradedBetOffer)
        }
    }
}

export class PerformanceMetric {
    private readonly _realValue: number
    private readonly _tradedBetOffer: TradedBetOffer

    constructor(realValue, tradedBetOffer) {
        this._realValue = realValue
        this._tradedBetOffer = tradedBetOffer
    }

    get realValue() {
        return this._realValue
    }

    get tradedBetOffer() {
        return this._tradedBetOffer
    }
}

export class TradedBetOffer {
    private readonly _stake: number
    private readonly _dateTimeOfTrade: Date
    private readonly _betOffer: BetOffer
    private readonly _value: number

    constructor(stake, dateTimeOfTrade, betOffer, value) {
        this._stake = stake
        this._dateTimeOfTrade = dateTimeOfTrade
        this._betOffer = betOffer
        this._value = value
    }

    get stake() {
        return this._stake
    }

    get dateTimeOfTrade(){
        return this._dateTimeOfTrade

    }

    get betOffer(){
        return this._betOffer
    }

    get value(){
        return this._value
    }
}

export class Participant {
    private readonly _name: string

    constructor(name) {
        this._name = name
    }

    get name(){
        return this._name
    }
}

export class BetOfferRegistered{
    private readonly _betOffer: BetOffer

    constructor(betOffer) {
        this._betOffer = betOffer
    }

    get betOffer(){
        return this._betOffer
    }

    get bookMaker(){
        return this._betOffer.bookMaker
    }
}

export class ClosingLineRegistered extends BetOfferRegistered {
    constructor(betOffer) {
        super(betOffer);
    }
}

export enum SportCompetition {
    JUPILER_PRO_LEAGUE='JUPILER_PRO_LEAGUE',
    SERIE_A = 'SERIE_A',
    LA_LIGA = 'LA_LIGA',
    BUNDESLIGA= 'BUNDESLIGA',
    PREMIER_LEAGUE = 'PREMIER_LEAGUE',
    EREDIVISIE = 'EREDIVISIE',
    LIGUE_1 = 'LIGUE_1'
}

export enum Sport {
    FOOTBALL='FOOTBALL'
}


export class BetOffer {
    private readonly _betType: BetType
    private readonly _eventId: number
    private readonly _bookMaker: BookMaker
    private readonly _betOptionName: string
    private readonly _price: number
    private readonly _vigFreePrice: number
    private readonly _line: number

    constructor(betType: BetType, eventId, bookMaker, betOptionName, price, line, vigFreePrice?: number) {
        this._betOptionName = betOptionName
        this._price = price
        this._line = line
        this._betType = betType
        this._eventId = eventId
        this._bookMaker = bookMaker
        this._vigFreePrice = vigFreePrice
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

export enum BetType {
    _1X2 = '1X2',
    DOUBLE_CHANCE = 'DOUBLE_CHANCE',
    OVER_UNDER = 'OVER_UNDER',
    HANDICAP= 'HANDICAP',
    UNKNOWN = 'UNKNOWN'
}

export enum BookMaker {
    UNIBET_BELGIUM= 'UNIBET_BELGIUM',
    NAPOLEON_GAMES = 'NAPOLEON_GAMES',
    PINNACLE= 'PINNACLE',
    BETFIRST= 'BETFIRST',
    GOLDEN_PALACE = 'GOLDEN_PALACE',
    BETCENTER = 'BETCENTER',
    LADBROKES = 'LADBROKES',
    MERIDIAN = 'MERIDIAN'
}

export enum Provider {
    KAMBI='KAMBI',
    SBTECH='SBTECH'
}

export class BookmakerClient {
    private readonly _bookmaker: BookMaker
    private readonly _sports: BookmakerClientSport[]

    constructor(bookmaker: BookMaker, sports: BookmakerClientSport[]){
        this._bookmaker = bookmaker
        this._sports = sports
    }

    get bookmaker(){
        return this._bookmaker
    }

    get sports() {
        return this._sports
    }
}

export class BookmakerClientSport {
    private readonly _sport: Sport
    private readonly _competitions: BookmakerClientCompetition[]

    constructor(sport: Sport, competitions: BookmakerClientCompetition[]){
        this._sport = sport
        this._competitions = competitions
    }

    get sport(){
        return this._sport
    }

    get competitions(){
        return this._competitions
    }
}

export class BookmakerClientCompetition {
    private readonly _competition: SportCompetition
    private readonly _betOfferRequests: []
    private readonly _participantRequests: []
    private readonly _eventRequests: []

    constructor(competition: SportCompetition, betOfferRequests, participantRequests, eventRequests) {
        this._competition = competition
        this._betOfferRequests = betOfferRequests
        this._eventRequests = eventRequests
        this._participantRequests = participantRequests
    }

    get competition(){
        return this._competition
    }

    get betOfferRequests(){
        return this._betOfferRequests
    }

    get particpantRequests(){
        return this._participantRequests
    }

    get eventRequests(){
        return this._eventRequests
    }
}


export class ValueBetFoundEvent {
    private readonly _betOffer: BetOffer
    private readonly _value: number

    constructor(betOffer: BetOffer, value: number){
        this._betOffer = betOffer
        this._value = value
    }

    get betOffer(){
        return this._betOffer
    }

    get value() {
        return this._value
    }
}