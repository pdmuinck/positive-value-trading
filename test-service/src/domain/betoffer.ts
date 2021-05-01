import {BetType, Bookmaker, BookmakerId, Provider} from "../service/bookmaker";
import {BetOffer} from "../service/betoffers";
import {EventInfo} from "../service/events";

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
    SPORT = 'SPORT',
    MARKET = 'MARKET'
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

export class Competition {
    private readonly _name: CompetitionName
    private readonly _bookmakerIds: BookmakerId[]
    private readonly _participants: Participant[]

    constructor(name: CompetitionName, bookmakerIds: BookmakerId[], participants: Participant[]) {
        this._name = name
        this._bookmakerIds = bookmakerIds
        this._participants = participants
    }

    get name() {
        return this._name
    }

    get bookmakerIds() {
        return this._bookmakerIds
    }

    get participants() {
        return this._participants
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
    MECHELEN = "K.V. Mechelen",
    CHELSEA = "CHELSEA",
    WOLVERHAMPTON = "WOLVERHAMPTON"
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

export class ValueBetFoundEvent {
    private readonly _eventInfo: EventInfo
    private readonly _betOffer: string
    private readonly _value: number
    private readonly _bookmaker: Bookmaker
    private readonly _price: number

    constructor(betOffer: string, value: number, eventInfo, bookmaker, price){
        this._betOffer = betOffer
        this._value = value
        this._eventInfo = eventInfo
        this._bookmaker = bookmaker
        this._price = price
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
}