export class Sport{
    private readonly _name: SportName
    private readonly _bookmakerIds: BookmakerId[]
    private readonly _competitions: Competition[]

    constructor(name: SportName, bookmakerIds: BookmakerId[], competitions: Competition[]) {
        this._name = name
        this._bookmakerIds = bookmakerIds
        this._competitions = competitions
    }

    get name(){
        return this._name
    }

    get bookmakerIds(){
        return this._bookmakerIds
    }

    get competitions(){
        return this._competitions
    }
}

export enum IdType {
    BET_OFFER = 'BET_OFFER',
    PARTICIPANT = 'PARTICIPANT',
    EVENT = 'EVENT',
    COMPETITION = 'COMPETITION',
    SPORT = 'SPORT'
}

export enum RequestType {
    BET_OFFER = "BET_OFFER",
    SPECIAL_BET_OFFER = "SPECIAL_BET_OFFER",
    EVENT = "EVENT",
    PARTICIPANT = "PARTICIPANT"
}

export enum SportName{
    FOOTBALL= 'FOOTBALL'
}

export class Competition{
    private readonly _name: CompetitionName
    private readonly _bookmakerIds: BookmakerId[]
    private readonly _participants: Participant[]

    constructor(name: CompetitionName, bookmakerIds: BookmakerId[], participants: Participant[]) {
        this._name = name
        this._bookmakerIds = bookmakerIds
        this._participants = participants
    }

    get name(){
        return this._name
    }

    get bookmakerIds(){
        return this._bookmakerIds
    }

    get participants(){
        return this._participants
    }
}

export class BookmakerId {
    private readonly _bookmaker: Bookmaker
    private readonly _id: string
    private readonly _idType: IdType

    constructor(bookmaker: Bookmaker, id: string, idType: IdType){
        this._bookmaker = bookmaker
        this._id = id
        this._idType = idType
    }

    get bookmaker(){
        return this._bookmaker
    }

    get id(){
        return this._id
    }

    get idType() {
        return this._idType
    }
}

export enum ParticipantName {
    NOT_FOUND = "Not Found",
    CLUB_BRUGGE = "Club Brugge KV",
    ANDERLECHT = "R.S.C Anderlecht",
    STANDARD_LIEGE = "Standard Liège",
    MOESKROEN = "Royal Excel Mouscron",
    CERCLE_BRUGGE = "Cercle Brugge K.S.V.",
    SINT_TRUIDEN = "Sint-Truidense V.V.",
    OHL = "Oud-Heverlee Leuven",
    BEERSCHOT = "K Beerschot VA",
    EUPEN = "K.A.S. Eupen",
    GENT = "K.A.A. Gent",
    GENK = "K.R.C. Genk",
    ANTWERP = "Royal Antwerp F.C.",
    WAASLAND_BEVEREN = "Waasland-Beveren",
    CHARLEROI = "R. Charleroi S.C.",
    OOSTENDE = "K.V. Oostende",
    ZULTE_WAREGEM = "S.V. Zulte Waregem",
    KORTRIJK = "K.V. Kortrijk",
    MECHELEN = "K.V. Mechelen"
}


export class SportEvent {
    private readonly _startDateTime: Date
    private readonly _competition: CompetitionName
    private readonly _sport: SportName
    private readonly _bookmakerIds: BookmakerId[]
    private readonly _betOffers: Map<string, Map<Bookmaker, BetOffer>>
    private readonly _closingLines: Map<string, Map<Bookmaker, BetOffer>>
    private readonly _participants: Participant[]

    constructor(startDateTime, competition: CompetitionName, sport: SportName, bookmakerIds: BookmakerId[], betOffers, closingLines, participants){
        this._startDateTime = startDateTime
        this._betOffers = betOffers
        this._bookmakerIds = bookmakerIds
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

    get bookmakerIds() {
        return this._bookmakerIds
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
        if(this._bookmakerIds.map(bookmakerId => bookmakerId.id).flat().includes(betOffer.eventId.toString())) {
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
        const pinnacleBetOffer = this._betOffers[betOfferKey][Bookmaker.PINNACLE]
        if(pinnacleBetOffer) {
            return Object.keys(this._betOffers[betOfferKey]).filter(bookmaker => bookmaker != Bookmaker.PINNACLE)
                .map(bookmaker => {
                if(bookmaker != Bookmaker.PINNACLE) {
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
        if(closingLine.bookMaker === Bookmaker.PINNACLE) {
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
    private readonly _name: ParticipantName
    private readonly _bookmakerIds: BookmakerId[]

    constructor(name: ParticipantName, bookmakerIds: BookmakerId[]) {
        this._name = name
        this._bookmakerIds = bookmakerIds
    }

    get name(){
        return this._name
    }

    get bookmakerIds(){
        return this._bookmakerIds
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

export enum CompetitionName {
    JUPILER_PRO_LEAGUE='JUPILER_PRO_LEAGUE',
    SERIE_A = 'SERIE_A',
    LA_LIGA = 'LA_LIGA',
    BUNDESLIGA= 'BUNDESLIGA',
    PREMIER_LEAGUE = 'PREMIER_LEAGUE',
    EREDIVISIE = 'EREDIVISIE',
    LIGUE_1 = 'LIGUE_1'
}

export class BetOffer {
    private readonly _betType: BetType
    private readonly _eventId: number
    private readonly _bookMaker: Bookmaker
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

export enum Bookmaker {
    UNIBET_BELGIUM= 'UNIBET_BELGIUM',
    NAPOLEON_GAMES = 'NAPOLEON_GAMES',
    PINNACLE= 'PINNACLE',
    BETFIRST= 'betfirst',
    GOLDEN_PALACE = 'goldenpalace',
    BETCENTER = 'BETCENTER',
    LADBROKES = 'LADBROKES',
    MERIDIAN = 'MERIDIAN',
    BET777 = 'bet777',
    BET90 = 'BET90',
    MAGIC_BETTING = 'MAGIC_BETTING',
    STAR_CASINO = 'STAR_CASINO',
    SCOOORE = 'SCOOORE',
    CIRCUS = 'CIRCUS',
    STANLEYBET = 'STANLEYBET'

}

export class Provider {
    static readonly KAMBI = new Provider('KAMBI', [Bookmaker.UNIBET_BELGIUM, Bookmaker.NAPOLEON_GAMES])
    static readonly SBTECH = new Provider('SBTECH', [Bookmaker.BETFIRST, Bookmaker.BET777])
    static readonly OTHER = new Provider('OTHER', [Bookmaker.BETCENTER, Bookmaker.BET90, Bookmaker.PINNACLE])

    // private to disallow creating other instances of this type
    private constructor(private readonly key: string, public readonly bookmakers: Bookmaker[]) {
    }

    toString() {
        return this.key
    }

    static keys(): Provider[] {
        return [this.KAMBI, this.SBTECH, this.OTHER]
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