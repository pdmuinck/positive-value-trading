import {
    BetOffer,
    BetType,
    IdType,
    Participant,
    ParticipantName,
    RequestType
} from '../domain/betoffer'
import {ApiResponse} from "../client/scraper";
import {participantMap} from "./mapper";
import {Bookmaker, BookmakerId, Provider} from "./bookmaker";

const parser = require('node-html-parser')

export class Event {
    private readonly _startTime
    private readonly _participants: Participant[]
    private readonly _id: BookmakerId
    private readonly _marketIds: BookmakerId[]

    constructor(id: BookmakerId, startTime, participants: Participant[], marketIds?: BookmakerId[]){
        this._id = id
        this._startTime = startTime
        this._participants = participants
        this._marketIds = marketIds
    }

    get id(){
        return this._id
    }

    get startTime(){
        return this._startTime
    }

    get participants(){
        return this._participants
    }

    get marketIds(){
        return this._marketIds
    }
}

export class Parser {
    static parse(apiResponse: ApiResponse): any[] {
        if(apiResponse){
            switch(apiResponse.provider) {
                case Provider.BETCENTER:
                    return BetcenterParser.parse(apiResponse)
                case Provider.PINNACLE:
                    return PinnacleParser.parse(apiResponse)
                case Provider.KAMBI:
                    return KambiParser.parse(apiResponse)
                case Provider.ALTENAR:
                    return AltenarParser.parse(apiResponse)
                case Provider.SBTECH:
                    return SbtechParser.parse(apiResponse)
                case Provider.LADBROKES:
                    return LadbrokesParser.parse(apiResponse)
                case Provider.MERIDIAN:
                    return MeridianParser.parse(apiResponse)
                case Provider.BET90:
                    return Bet90Parser.parse(apiResponse)
                case Provider.BETCONSTRUCT:
                    return CircusParser.parse(apiResponse)
                case Provider.BINGOAL:
                    return BingoalParser.parse(apiResponse)
                default:
                    return []
            }
        } else {
            return []
        }
    }

    static toDecimalOdds(americanOdds): number {

        if(americanOdds < 0) {
            return parseFloat(((100 / Math.abs(americanOdds)) + 1).toFixed(2))
        } else {
            return parseFloat(((americanOdds / 100) + 1).toFixed(2))
        }

    }
}

export class BetradarParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType) {
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
            case RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse)
        }
    }

    static parseParticipants(apiResponse: ApiResponse): Participant[] {
        const events = this.parseEvents(apiResponse)
        return events.map(event => event.participants).flat()
    }

    static parseEvents(apiResponse: ApiResponse): Event[] {
        // expected bingoal response
        return apiResponse.data.sports.map(sport => sport.matches).flat().map(match => {
            const participants = [
                new Participant(getParticipantName(match.team1.name),
                    [new BookmakerId(Provider.BETRADAR, match.team1.betradarID.toString(), IdType.PARTICIPANT)]),
                new Participant(getParticipantName(match.team2.name),
                    [new BookmakerId(Provider.BETRADAR, match.team2.betradarID.toString(), IdType.PARTICIPANT)]),
            ]
            new Event(new BookmakerId(Provider.BETRADAR, match.betradarID.toString(), IdType.EVENT), match.date, participants)
        })
    }

    static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        const betOffers: BetOffer[] = []
        return betOffers
    }
}

export class BingoalParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType) {
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
            case RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse)
        }
    }

    static parseParticipants(apiResponse: ApiResponse): Participant[] {
        const events = this.parseEvents(apiResponse)
        return events.map(event => event.participants).flat()
    }

    static parseEvents(apiResponse: ApiResponse): Event[] {
        return apiResponse.data.sports.map(sport => sport.matches).flat().filter(match => !match.outright).map(match => {
            const participants = [
                new Participant(getParticipantName(match.team1.name),
                    [new BookmakerId(Provider.BINGOAL, match.team1.ID, IdType.PARTICIPANT)]),
                new Participant(getParticipantName(match.team2.name),
                    [new BookmakerId(Provider.BINGOAL, match.team2.ID, IdType.PARTICIPANT)]),
            ]
            return new Event(new BookmakerId(Provider.BINGOAL, match.ID, IdType.EVENT), match.date, participants)
        })
    }

    static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        const betOffers: BetOffer[] = []
        apiResponse.data.sports.map(sport => sport.matches).flat().filter(match => !match.outright).forEach(match => {
            match.importantSubbets.forEach(subbet => {
                const betType: BetType = this.determineBetType(subbet)
                if(betType !== BetType.UNKNOWN) {
                    subbet.tips.forEach(tip => {
                        betOffers.push(new BetOffer(betType, match.ID, Bookmaker.BINGOAL, tip.shortName, tip.odd, NaN))
                    })
                }
            })
        })
        return betOffers
    }

    static determineBetType(subbet) {
        switch(subbet.name) {
            case "1X2":
                return BetType._1X2
            default:
                return BetType.UNKNOWN
        }
    }
}

export class CircusParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType) {
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
            case RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse)
        }
    }

    static parseParticipants(apiResponse: ApiResponse): Participant[] {
        const events = this.parseEvents(apiResponse)
        return events.map(event => event.participants).flat()
    }

    static parseEvents(apiResponse: ApiResponse): Event[] {
        const response =  JSON.parse(JSON.parse(apiResponse.data.Message).Requests[0].Content)
        return response.LeagueDataSource.LeagueItems.map(league => league.EventItems).flat()
            .filter(event => event.DefaultMarketType === "P1XP2").map(event => {
            const participants = [new Participant(getParticipantName(event.Team1Name),
                [new BookmakerId(Provider.BETCONSTRUCT, event.Team1Name.toUpperCase(), IdType.PARTICIPANT)]),
                new Participant(getParticipantName(event.Team2Name),
                    [new BookmakerId(Provider.BETCONSTRUCT, event.Team2Name.toUpperCase(), IdType.PARTICIPANT)])]
            return new Event(new BookmakerId(Provider.BETCONSTRUCT, event.EventId.toString(), IdType.EVENT), event.StartDate, participants)
        }).flat()
    }

    static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        const response =  JSON.parse(JSON.parse(apiResponse.data.Message).Requests[0].Content)
        const betOffers: BetOffer[] = []
        response.LeagueDataSource.LeagueItems.map(league => league.EventItems).flat()
            .filter(event => event.DefaultMarketType === "P1XP2").map(event => event.MarketItems).flat().forEach(marketItem => {
                const betType: BetType = this.determineBetOfferType(marketItem.BetType)
                marketItem.OutcomeItems.forEach(outcomeItem => {
                    let betOption = outcomeItem.Name
                    if(betType === BetType._1X2) {
                        if(outcomeItem.OrderPosition === 1) betOption = "1"
                        if(outcomeItem.OrderPosition === 2) betOption = "X"
                        if(outcomeItem.OrderPosition === 3) betOption = "2"
                    }
                    const line = outcomeItem.Base ? outcomeItem.Base : NaN
                    betOffers.push(new BetOffer(betType, marketItem.EventId, Provider.BETCONSTRUCT, betOption, outcomeItem.Odd, line))
                })
        })
        return betOffers
    }

    private static determineBetOfferType(typeId): BetType  {
        switch(typeId){
            case "P1XP2":
                return BetType._1X2
            case "total-OverUnder":
                return BetType.OVER_UNDER
            case "1X12X2":
                return BetType.DOUBLE_CHANCE
        }
    }
}

export class KambiParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType) {
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
            case RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse)
        }
    }

    static parseParticipants(apiResponse: ApiResponse): Participant[] {
        if(!apiResponse.data.events) return []
        return apiResponse.data.events.filter(event => event.participants.length === 2).map(event => event.participants)
            .flat().map(participant => new Participant(
                getParticipantName(participant.name.toUpperCase()), [
                    new BookmakerId(apiResponse.provider, participant.participantId.toString(), IdType.PARTICIPANT)]))
    }

    static parseEvents(apiResponse: ApiResponse): Event[] {
        if(!apiResponse.data.events) return []
        return apiResponse.data.events.filter(event => event.participants.length === 2).map(event => {
            const participants = event.participants.map(participant => new Participant(getParticipantName(participant.name),
                [new BookmakerId(apiResponse.provider, participant.participantId.toString(), IdType.PARTICIPANT)]))
            return new Event(new BookmakerId(apiResponse.provider, event.id.toString(), IdType.EVENT), event.start, participants)
        })
    }

    static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.betOffers) return []
        return apiResponse.data.betOffers.map(betOffer => this.transformToBetOffers(apiResponse.provider, betOffer)).flat()
    }

    static transformToBetOffers(bookMaker: Provider, betOfferContent): BetOffer[] {
        const typeId = betOfferContent.criterion.id
        const betOfferType = this.determineBetOfferType(typeId)
        if(!betOfferType) return []
        const eventId = betOfferContent.eventId
        const betOffers = []
        if(betOfferContent.outcomes) {
            betOfferContent.outcomes.forEach(outcome => {
                const outcomeType = this.determineOutcomeType(outcome.type)
                const price = Math.round(outcome.odds + Number.EPSILON) / 1000
                const line = outcome.line / 1000
                betOffers.push(new BetOffer(betOfferType, eventId, bookMaker, outcomeType, price, line))
            })
        }
        return betOffers
    }

    private static determineBetOfferType(typeId): BetType  {
        switch(typeId){
            case 1001159858:
                return BetType._1X2
            case 1001159926:
                return BetType.OVER_UNDER
            case 1001159711:
                return BetType.HANDICAP
        }
    }

    private static determineOutcomeType(betOptionName) {
        switch(betOptionName){
            case 'OT_ONE':
                return '1'
            case 'OT_TWO':
                return '2'
            case 'OT_CROSS':
                return 'X'
            case 'OT_OVER':
                return 'OVER'
            case 'OT_UNDER':
                return 'UNDER'
        }
    }


}

export class SbtechParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType){
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
        }
    }

    private static parseParticipants(apiResponse: ApiResponse): Participant[] {
        if(!apiResponse.data.events) return []
        return apiResponse.data.events.map(event => event.participants.map(participant => new Participant(getParticipantName(participant.name),
            [new BookmakerId(apiResponse.provider, participant.id, IdType.PARTICIPANT)]))).flat()
    }

    private static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.markets) return []
        return apiResponse.data.markets.map(market => SbtechParser.transformToBetOffer(apiResponse.provider, market)).flat()
    }

    private static parseEvents(apiResponse: ApiResponse): Event[] {
        if(!apiResponse.data.events) return []
        return apiResponse.data.events.map(event => {
            const participants = event.participants.map(participant => {
                return new Participant(getParticipantName(participant.name),
                    [new BookmakerId(apiResponse.provider, participant.id, IdType.PARTICIPANT)])
            })
            return new Event(new BookmakerId(apiResponse.provider, event.id, IdType.EVENT), event.startEventDate, participants)
        })
    }

    private static transformToBetOffer(provider: Provider, market: any): BetOffer[] {
        const typeId = market.marketType.id
        const betOfferType = SbtechParser.determineBetOfferType(typeId)
        if(!betOfferType) return []
        const eventId = market.eventId
        const betOffers = []
        market.selections.forEach(selection => {
            const outcomeType = SbtechParser.determineOutcomeType(selection.outcomeType)
            const price = selection.trueOdds
            const line = selection.points ? selection.points : NaN
            betOffers.push(new BetOffer(betOfferType, eventId, provider, outcomeType, price, line))
        })
        return betOffers
    }

    private static determineOutcomeType(outcomeType): string {
        switch(outcomeType){
            case 'Home':
                return '1'
            case 'Away':
                return '2'
            case 'Tie':
                return 'X'
            case 'Under':
                return 'UNDER'
            case 'Over':
                return 'OVER'
        }
    }

    private static determineBetOfferType(typeId: string): BetType {
        switch(typeId){
            case '1_0':
                return BetType._1X2

            case '3_0':
                return BetType.OVER_UNDER
        }
    }
}

export class AltenarParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType) {
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
        }

    }

    private static parseEvents(apiResponse: ApiResponse): Event[] {
        if(!apiResponse.data.Result) return []
        return apiResponse.data.Result.Items[0].Events.map(event => new Event(
            new BookmakerId(apiResponse.provider, event.Id.toString(), IdType.EVENT),
            event.EventDate,
            event.Competitors.map(competitor => new Participant(
                getParticipantName(competitor.Name.toUpperCase()),
                [new BookmakerId(apiResponse.provider, competitor.Name.toUpperCase(), IdType.PARTICIPANT)]
            ))
        )).flat()
    }

    private static parseParticipants(apiResponse: ApiResponse): Participant[] {
        if(!apiResponse.data.Result) return []
        return apiResponse.data.Result.Items[0].Events.map(event => event.Competitors.map(participant => new Participant(
            getParticipantName(participant.Name), [new BookmakerId(apiResponse.provider, participant.Name.toUpperCase(),
                IdType.PARTICIPANT)])).flat())
    }

    private static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.Result) return []
        return apiResponse.data.Result.Items[0].Events.map(event => AltenarParser.transformToBetOffer(apiResponse.provider, event)).flat()
    }

    private static transformToBetOffer(bookMaker: Provider, event): BetOffer[] {
        const betOffers = []
        const eventId = event.Id
        event.Items.map(item => {
            const betType = AltenarParser.determineBetType(item.MarketTypeId)
            if(betType) {
                item.Items.forEach(option => {
                    const price = option.Price
                    let outcome = option.Name.toUpperCase()
                    let line = item.SpecialOddsValue === '' ? NaN : parseFloat(item.SpecialOddsValue)
                    if(betType === BetType.HANDICAP) {
                        outcome = option.Name.split('(')[0].trim().toUpperCase()
                        line = parseFloat(option.Name.split('(')[1].split(')')[0].trim().toUpperCase())
                    } else if(betType === BetType.OVER_UNDER){
                        outcome = outcome.includes('OVER') ? 'OVER' : 'UNDER'
                    }
                    betOffers.push(new BetOffer(betType, eventId, bookMaker, outcome, price, line))
                })
            }
        })
        return betOffers
    }

    private static determineBetType(typeId: string): BetType {
        if(typeId.startsWith("1_")) return BetType._1X2
        if(typeId.startsWith("10_")) return BetType.DOUBLE_CHANCE
        if(typeId.startsWith("16_")) return BetType.HANDICAP
        if(typeId.startsWith("18_")) return BetType.OVER_UNDER
    }
}

export class BetcenterParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType) {
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
            case RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse)
        }
    }

    private static parseEvents(apiResponse: ApiResponse): Event[]{
        if(!apiResponse.data.games) return []
        return apiResponse.data.games.map(event => {
            const participants = event.teams.map(team => {
                return new Participant(getParticipantName(team.name),
                    [new BookmakerId(Provider.BETCENTER, team.id.toString(), IdType.PARTICIPANT)])
            })
            return new Event(new BookmakerId(Provider.BETCENTER, event.id.toString(), IdType.EVENT), event.startTime, participants)
        })
    }

    private static parseParticipants(apiResponse: ApiResponse): Participant[] {
        const events = this.parseEvents(apiResponse)
        return events.map(event => event.participants).flat()
    }

    private static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.games) return []
        const betOffers = []
        apiResponse.data.games.forEach(event => {
            event.markets.forEach(market => {
                const betType = BetcenterParser.determineBetType(market.id)
                const line = BetcenterParser.determineBetLine(market, betType)
                if(betType) {
                    market.tips.forEach(tip => {
                        let outcome = tip.text.toUpperCase()
                        const price = tip.odds / 100
                        if(betType === BetType.OVER_UNDER) {
                            outcome = outcome.includes('+') ? 'OVER' : 'UNDER'
                        }
                        betOffers.push(new BetOffer(betType, event.id, Provider.BETCENTER, outcome, price, line))
                    })
                }
            })
        })

        return betOffers
    }

    private static determineBetType(id): BetType {
        switch(id){
            case 22242:
                return BetType._1X2
            case 22462:
                return BetType.OVER_UNDER
            case 22252:
                return BetType.OVER_UNDER
            case 22472:
                return BetType.OVER_UNDER
            case 22482:
                return BetType.OVER_UNDER
            case 22492:
                return BetType.OVER_UNDER
            case 22502:
                return BetType.OVER_UNDER
            case 22512:
                return BetType.OVER_UNDER
            case 22522:
                return BetType.DOUBLE_CHANCE
        }

    }

    private static determineBetLine(market, betType) {
        if(betType === BetType.OVER_UNDER){
            return market.anchor
        } else {
            return NaN
        }
    }
}

export class LadbrokesParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType) {
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
            case RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse)
        }

        return
    }

    private static parseEvents(apiResponse: ApiResponse): Event[]{
        if(!apiResponse.data.result.dataGroupList) return []
        return apiResponse.data.result.dataGroupList.map(group => group.itemList).flat()
            .map(event => {
                const eventId = event.eventInfo.aliasUrl
                const participants = [
                    new Participant(getParticipantName(event.eventInfo.teamHome.description),
                        [new BookmakerId(Provider.LADBROKES, event.eventInfo.teamHome.description.toUpperCase(), IdType.PARTICIPANT)]),
                    new Participant(getParticipantName(event.eventInfo.teamAway.description),
                        [new BookmakerId(Provider.LADBROKES, event.eventInfo.teamAway.description.toUpperCase(), IdType.PARTICIPANT)])
                ]
                return new Event(new BookmakerId(Provider.LADBROKES, eventId, IdType.EVENT), event.eventInfo.eventData.toString(), participants)
            }).flat()
    }

    private static parseParticipants(apiResponse: ApiResponse): Participant[] {
        const events = this.parseEvents(apiResponse)
        return events.map(event => event.participants).flat()
    }

    private static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.result.dataGroupList) return []
        const betOffers = []
        apiResponse.data.result.dataGroupList.map(group => group.itemList).flat()
            .forEach(event => {
                const eventId = event.eventInfo.aliasUrl
                event.betGroupList[0].oddGroupList.forEach(market => {
                    const betType = LadbrokesParser.determineBetOfferType(market.betId)
                    if(betType !== BetType.UNKNOWN) {
                        const line = market.additionalDescription ? parseFloat(market.additionalDescription.toUpperCase().trim()): NaN
                        market.oddList.forEach(option => {
                            const outcome = option.oddDescription.toUpperCase()
                            const price = option.oddValue / 100
                            betOffers.push(new BetOffer(betType, eventId, Provider.LADBROKES, outcome, price, line))
                        })
                    }
                })
            })
        return betOffers
    }

    // @ts-ignore
    private static determineBetOfferType(id: number): BetType {
        switch(id){
            case 24:
                return BetType._1X2
            case 1907:
                return BetType.OVER_UNDER
            default:
                return BetType.UNKNOWN
        }
    }
}

export class MeridianParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType) {
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
            case RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse)
        }
    }

    private static parseEvents(apiResponse: ApiResponse): Event[] {
        if(!apiResponse.data[0].events) return []
        return apiResponse.data[0].events.map(event => {
            const participants = event.team.map(team => {
                return new Participant(getParticipantName(team.name), [new BookmakerId(Provider.MERIDIAN, team.id, IdType.PARTICIPANT)])
            })
            return new Event(new BookmakerId(Provider.MERIDIAN, event.id, IdType.EVENT), event.startTime, participants)
        })
    }

    private static parseParticipants(apiResponse: ApiResponse): Participant[] {
        const events: Event[] = this.parseEvents(apiResponse)
        return events.map(event => event.participants).flat()
    }

    private static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.events) return []
        const betOffers = []
        apiResponse.data.events.map(date => date.events).flat().forEach(event => {
            const eventId = event.id
            event.market.forEach(betOffer => {
                const betType = MeridianParser.determineBetType(betOffer.templateId)
                if(betType !== BetType.UNKNOWN) {
                    const line = betOffer.overUnder ? parseFloat(betOffer.overUnder) : NaN
                    betOffer.selection.forEach(option => {
                        const price = parseFloat(option.price)
                        const outcome = option.nameTranslations.filter(trans => trans.locale === 'en')[0].translation.toUpperCase()
                        betOffers.push(new BetOffer(betType, eventId, Provider.MERIDIAN, outcome, price, line))
                    })
                }
            })
        })
        return betOffers
    }

    private static determineBetType(id: string): BetType {
        switch(id){
            case '3999':
                return BetType._1X2
            case '4004':
                return BetType.OVER_UNDER
            case '4008':
                return BetType.DOUBLE_CHANCE
            default:
                return BetType.UNKNOWN
        }
    }
}

function getParticipantName(name: string): ParticipantName{
    let found
    const test = Object.keys(participantMap)
    Object.keys(participantMap).forEach(key => {
        if(participantMap[key].includes(name.toUpperCase())) {
            found = key
        }
    })
    if(found) return found
    return ParticipantName.NOT_FOUND
}

export class Bet90Parser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType) {
            case RequestType.SPECIAL_BET_OFFER:
                return this.parseSpecialBetOffers(apiResponse)
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
            case RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse)
        }
    }

    private static parseParticipants(apiResponse: ApiResponse): Participant[]{
        if(!apiResponse.data) return []
        const events = this.parseEvents(apiResponse)
        return events.map(event => event.participants).flat()
    }

    private static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        const eventsParsed = parser.parse(apiResponse.data)
        const foundBetOffers = []

        eventsParsed.querySelectorAll('.dropd').forEach(event => {
            const eventId = event.rawAttrs.split('"')[1]
            const betOffers = event.querySelectorAll('.point')
            for(const i in betOffers){
                const betOffer = betOffers[i]
                foundBetOffers.push(new BetOffer(BetType._1X2, eventId, apiResponse.provider,
                    i === "0" ? "1" : i === "1" ? "X" : "2", betOffer.childNodes[0].rawText.trim().replace(",", "."), NaN))

            }
        })
        return foundBetOffers
    }

    private static parseSpecialBetOffers(apiResponse: ApiResponse): BetOffer[]{
        const betOffers = apiResponse.data.data
        const betOffersParsed = parser.parse(betOffers)
        const betOffersFound: BetOffer[] = []
        betOffersParsed.querySelectorAll('.betTitle').forEach(bet => {
            const betType: BetType = Bet90Parser.determineBetType(bet.childNodes[0].rawText.trim())
            if(betType !== BetType.UNKNOWN) {
                const line = BetType.OVER_UNDER === betType ? bet.childNodes[0].rawText.trim().split(' ')[1].replace(",", ".") : NaN
                const prices = bet.parentNode.parentNode.querySelectorAll('.point')
                prices.forEach(price => {
                    const priceValue = price.childNodes[0].rawText.trim()
                    const betOption = price.parentNode.querySelectorAll('span.text')[0].childNodes[0].rawText.trim()
                    betOffersFound.push(new BetOffer(betType, apiResponse.data.id, apiResponse.provider,
                        betOption === '+' ? "OVER" : betOption === "-" ? "UNDER": betOption,
                        priceValue.replace(",", "."), line))
                })
            }
        })
        return betOffersFound
    }

    private static determineBetType(betTypeString: string): BetType {
        switch(betTypeString.toUpperCase()) {
            case "DOPPELTE CHANCE":
                return BetType.DOUBLE_CHANCE
            case "&#220;BER/UNTER 2,5":
                return BetType.OVER_UNDER
            case "&#220;BER/UNTER 0,5":
                return BetType.OVER_UNDER
            case "&#220;BER/UNTER 1,5":
                return BetType.OVER_UNDER
            case "&#220;BER/UNTER 3,5":
                return BetType.OVER_UNDER
            case "&#220;BER/UNTER 4,5":
                return BetType.OVER_UNDER
            case "&#220;BER/UNTER 5,5":
                return BetType.OVER_UNDER
            default:
                return BetType.UNKNOWN

        }
    }

    private static parseEvents(apiResponse: ApiResponse): Event[] {
        if(!apiResponse.data) return []
        const events = apiResponse.data
        const parsedEvents: Event[] = []

        const eventsParsed = parser.parse(events)

        const rows = eventsParsed.querySelectorAll('.divTableBody').map(row => row.childNodes)

        let gameDate = ""

        for(const i in rows) {
            const row = rows[i]
            if(row.length === 3) {
                gameDate = row[1].childNodes.filter(child => child.classNames && child.classNames.includes("GameDate"))[0]
                    .childNodes[0].rawText
                gameDate = gameDate.split('\n')[1].trim()
            } else {

                const eventNodes = row.filter(el => el.classNames && el.classNames.includes("dropd"))
                eventNodes.forEach(node => {
                    const eventId = node.rawAttrs.split('"')[1]
                    const time = node.childNodes.filter(node => node.classNames && node.classNames.includes("sportsTime"))[0]
                        .childNodes[1].childNodes[0].rawText.split('\n')[1].trim()
                    const homeTeamName = node.childNodes.filter(node => node.classNames
                        && node.classNames.includes("first-team"))[0].childNodes[1].childNodes[0].rawText
                    const awayTeamName = node.childNodes.filter(node => node.classNames
                        && node.classNames.includes("second-team"))[0].childNodes[1].childNodes[0].rawText
                    const homeTeamId = node.childNodes.filter(node => node.classNames
                        && node.classNames.includes("league_cell_5"))[0].childNodes[3].childNodes[1].rawAttrs.split("data-team")[1].split('id="')[1].split('\n')[0].trim().split('"')[0].trim()
                    const awayTeamId = node.childNodes.filter(node => node.classNames
                        && node.classNames.includes("league_cell_5"))[0].childNodes[3].childNodes[1].rawAttrs.split("data-team")[2].split('id="')[1].split('"')[0].trim()

                    parsedEvents.push(new Event(new BookmakerId(Provider.BET90, eventId, IdType.EVENT),
                        gameDate + "T" + time, [new Participant(getParticipantName(homeTeamName),
                            [new BookmakerId(Provider.BET90, homeTeamId, IdType.PARTICIPANT)]),
                            new Participant(getParticipantName(awayTeamName),
                                [new BookmakerId(Provider.BET90, awayTeamId, IdType.PARTICIPANT)])
                        ]))
                })

            }
        }
        return parsedEvents
    }


}

export class PinnacleParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType){
            case RequestType.BET_OFFER:
                return this.parseOffers(apiResponse)
            case RequestType.PARTICIPANT:
                return this.parseParticipants(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
        }
    }

    private static parseEvents(apiResponse: ApiResponse): Event[]{
        if(!apiResponse.data || apiResponse.data.constructor !== Array) return []
        const parsedEvents = {}
        apiResponse.data.filter(event => !event.parentId).forEach(event => {
            parsedEvents[event.id] = this.parseEvent(event, undefined)
        })
        apiResponse.data.filter(event => event.parentId).forEach(event => {
            const parsedEvent = parsedEvents[event.parentId]
            if(parsedEvent) {
                parsedEvent.marketIds.push(new BookmakerId(Provider.PINNACLE, event.id.toString(), IdType.MARKET))
            } else {
                const parent = event.parent
                parsedEvents[parent.id] = this.parseEvent(parent, event.id.toString())
            }
        })
        return Object.values(parsedEvents)
    }

    private static parseEvent(event, marketId): Event {
        const participants: Participant[] = event.participants.map(participant => {
            return new Participant(getParticipantName(participant.name),
                [new BookmakerId(Provider.PINNACLE, participant.name.toUpperCase(), IdType.PARTICIPANT)])
        })
        return new Event(new BookmakerId(Provider.PINNACLE, event.id.toString(), IdType.EVENT), event.startTime, participants,
            marketId ? [new BookmakerId(Provider.PINNACLE, marketId, IdType.MARKET)] : [])
    }

    private static parseParticipants(apiResponse: ApiResponse): Participant[] {
        if(!apiResponse.data || apiResponse.data.constructor !== Array) return []
        const events: Event[] = this.parseEvents(apiResponse)
        return events.map(event => event.participants).flat()
    }

    private static parseOffers(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data || apiResponse.data.constructor !== Array) return []
        return apiResponse.data.filter(offer => offer.prices.filter(price => price.designation).length > 0)
            .map(offer => PinnacleParser.parseBetOffers(apiResponse.provider, offer)).flat()
    }

    private static parseBetOffers(bookMaker: Provider, offer): BetOffer[] {
        const betOffers = []
        const eventId = offer.matchupId
        const betType = PinnacleParser.determineBetType(offer.key)
        if(betType === BetType.UNKNOWN) return []
        const vigFreePrices = PinnacleParser.calculateVigFreePrices(offer.prices)
        offer.prices.forEach(price => {
            const outcome = PinnacleParser.determineOutcome(price.designation.toUpperCase())
            const line = price.points ? price.points : NaN
            const odds = this.toDecimalOdds(price.price)
            betOffers.push(new BetOffer(betType, eventId, bookMaker, outcome, odds, line,
                parseFloat(vigFreePrices.filter(vigFreePrice => vigFreePrice.outcomeType === outcome)[0].vigFreePrice)))
        })
        return betOffers
    }

    private static determineBetType(key): BetType {
        if(key === 's;0;m') return BetType._1X2
        if(key.includes('s;0;ou')) return BetType.OVER_UNDER
        return BetType.UNKNOWN
    }

    static toDecimalOdds(americanOdds): number {

        if(americanOdds < 0) {
            return parseFloat(((100 / Math.abs(americanOdds)) + 1).toFixed(2))
        } else {
            return parseFloat(((americanOdds / 100) + 1).toFixed(2))
        }

    }

    private static determineOutcome(outcome: string) {
        switch(outcome) {
            case 'HOME':
                return '1'
            case 'AWAY':
                return '2'
            case 'DRAW':
                return 'X'
            default:
                return outcome
        }
    }

    private static calculateVigFreePrices(prices) {
        const decimalOdds = prices.map(price => this.toDecimalOdds(price.price))
        let vig = 0

        decimalOdds.forEach(odd => {
            vig += 1/odd
        })

        const vigFreePrices = []
        prices.forEach(price => {
            const outcomeType = this.determineOutcome(price.designation.toUpperCase())
            const vigFreePrice = this.toDecimalOdds(price.price) / vig
            vigFreePrices.push({outcomeType: outcomeType, vigFreePrice: vigFreePrice.toFixed(2)})
        })
        return vigFreePrices
    }
}

function toDecimalOdds(americanOdds): number {

    if(americanOdds < 0) {
        return parseFloat(((100 / Math.abs(americanOdds)) + 1).toFixed(2))
    } else {
        return parseFloat(((americanOdds / 100) + 1).toFixed(2))
    }

}