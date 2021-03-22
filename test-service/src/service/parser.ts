import {IdType, Participant, ParticipantName, RequestType} from '../domain/betoffer'
import {ApiResponse} from "../client/scraper";
import {participantMap} from "./mapper";
import {BetType, Bookmaker, BookmakerId, Provider} from "./bookmaker";
import {BetOffer} from "./betoffers";

const parser = require('node-html-parser')

export class Event {
    private readonly _startTime
    private readonly _participants: Participant[]
    private readonly _id: BookmakerId
    private readonly _sportsRadarId: string

    constructor(id: BookmakerId, startTime, participants: Participant[], sportsRadarId?:string){
        this._id = id
        this._startTime = startTime
        this._participants = participants
        this._sportsRadarId = sportsRadarId
    }

    get sportsRadarId() {
        return this._sportsRadarId
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
                    return BetConstructParser.parse(apiResponse)
                case Provider.BINGOAL:
                    return BingoalParser.parse(apiResponse)
                case Provider.BETWAY:
                    return BetwayParser.parse(apiResponse)
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

export class ScoooreParser {
    static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        return apiResponse.data.eventmarketgroups.map(marketGroup => marketGroup.fullmarkets).flat().map(betOffer => {
            const betType = this.determineBetType(betOffer.idfomarket)

        })
    }$

    static determineBetType(betType): BetType {
        switch(betType){
            case "28315031.1":
                return BetType._1X2
            case "28315030.1":
                return BetType.DOUBLE_CHANCE
            case "28447076.1":
                return BetType._1X2_FIRST_HALF
            case "28447079.1":
                return BetType.BOTH_TEAMS_SCORE
            case "28447101.1":
                return BetType.OVER_UNDER
            case "28447098.1":
                return BetType.OVER_UNDER
            case "28447110.1":
                return BetType.OVER_UNDER
            case "28447081.1":
                return BetType.OVER_UNDER
            case "28447094.1":
                return BetType.OVER_UNDER
            case "28315032.1":
                return BetType.DRAW_NO_BET
            case "28447090.1":
                return BetType.HANDICAP
            case "28447112.1":
                return BetType.HANDICAP
            case "28447113.1":
                return BetType.HANDICAP
            case "28447113.1":
                return BetType.HANDICAP
            case "28447100.1":
                return BetType.HANDICAP
            case "28447103.1":
                return BetType._1X2_H2
            case "28447089.1":
                return BetType.DOUBLE_CHANCE_1H
            case "28447061.1":
                return BetType.HANDICAP_H1
            case "28590916.1":
                return BetType.ODD_EVEN_H1
            case "28590878.1":
                return BetType.OVER_UNDER_TEAM1
            case "28590877.1":
                return BetType.OVER_UNDER_TEAM2
            case "28590921.1":
                return BetType.OVER_UNDER_TEAM1_H1
            case "28590910.1":
                return BetType.OVER_UNDER_TEAM2_H1
            case "28590876.1":
                return BetType.ODD_EVEN_TEAM1
            case "28590875.1":
                return BetType.ODD_EVEN_TEAM2
            case "28590903.1":
                return BetType.CORRECT_SCORE
            case "28590880.1":
                return BetType.CORRECT_SCORE_H1
            case "28590908.1":
                return BetType.ODD_EVEN






        }
    }
}

export class BetwayParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType) {
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
        }
    }



    private static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        const betOffers = []
        apiResponse.data.forEach(data => {
            const events = data.Events
            const markets = data.Markets
            const outcomes = data.Outcomes
            markets.forEach(market => {
                const sportsRadarId = events.filter(event => event.Id === market.EventId)[0].SportsRadarId
                const betType = BetwayParser.determineBetType(market.TypeCName)
                market.Outcomes[0].forEach(outcomeToSearch => {
                    const outcome = outcomes.fiter(outcome => outcome.Id === outcomeToSearch)[0]
                    betOffers.push(new BetOffer(betType, sportsRadarId, Bookmaker.BETWAY, outcome.CouponName, outcome.OddsDecimalDisplay, NaN))
                })

            })
        })
        return betOffers
    }
    private static determineBetType(typeName) {
        switch(typeName) {
            case "win-draw-win":
                return BetType._1X2
            case "double-chance":
                return BetType.DOUBLE_CHANCE
            case "goals-over":
                return BetType.OVER_UNDER
            case "handicap-goals-over":
                return BetType.HANDICAP
        }
    }

    private static parseEvents(apiResponse: ApiResponse): Event[] {
        return apiResponse.data[0].Events.map(event => {
            const sportsRadarId = event.SportsRadarId
            return new Event(new BookmakerId(Provider.BETWAY, event.Id, IdType.EVENT), undefined, undefined, sportsRadarId)
        })
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
        }
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
        const event = apiResponse.data.box[0].match
        event.importantSubbets.forEach(subbet => {
            const betType: BetType = this.determineBetType(subbet)
            if(betType !== BetType.UNKNOWN) {
                subbet.tips.forEach(tip => {
                    betOffers.push(new BetOffer(betType, event.ID, Bookmaker.BINGOAL, tip.shortName, tip.odd, NaN))
                })
            }
        })
        return betOffers
    }

    static determineBetType(subbet) {
        switch(subbet.marketID) {
            case "1":
                return BetType._1X2
            case "10":
                return BetType.DOUBLE_CHANCE
            case "11":
                return BetType.DRAW_NO_BET
            case "14":
                return BetType.HANDICAP
            case "17":
                return BetType.OVER_UNDER
            case "27":
                return BetType.BOTH_TEAMS_SCORE
            case "55":
                return BetType._1X2_FIRST_HALF
            default:
                return BetType.UNKNOWN
        }
    }
}

export class BetConstructParser {
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
        const response =  JSON.parse(apiResponse.data.Requests[0].Content)
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
        const response =  JSON.parse(apiResponse.data.Requests[0].Content)
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
                    betOffers.push(new BetOffer(betType, marketItem.EventId, apiResponse.bookmaker, betOption, outcomeItem.Odd, line))
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
            case "both-teams-to-score":
                return BetType.BOTH_TEAMS_SCORE
            case "handicap-TeamNumber":
                return BetType.HANDICAP
            case "draw-no-bet":
                return BetType.DRAW_NO_BET
            case "1st-half-1x2":
                return BetType._1X2_FIRST_HALF
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
        if(!apiResponse.data) return []
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
                const line = outcome.line ? outcome.line/ 1000 : outcome.label
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
            case 1001642858:
                return BetType.BOTH_TEAMS_SCORE
            case 1001159897:
                return BetType.OVER_UNDER_CORNERS
            case 1001239606:
                return BetType.ODD_EVEN_CORNERS
            case 1000316018:
                return BetType._1X2_FIRST_HALF
            case 1002244276:
                return BetType.ASIAN_OVER_UNDER
            case 1001642858:
                return BetType.BOTH_TEAMS_SCORE
            case 1001159922:
                return BetType.DOUBLE_CHANCE
            case 1001159967:
                return BetType.OVER_UNDER_TEAM1
            case 1001159633:
                return BetType.OVER_UNDER_TEAM2
            case 1001159780:
                return BetType.CORRECT_SCORE
            case 1001568619:
                return BetType.CORRECT_SCORE_H2
            case 1000505272:
                return BetType.CORRECT_SCORE_H1
            case 1001568621:
                return BetType._3_WAY_HANDICAP_H2
            case 1001224081:
                return BetType._3_WAY_HANDICAP
            case 1001568620:
                return BetType._3_WAY_HANDICAP_H1
            case 1002275572:
                return BetType.ASIAN_HANDICAP
            case 1002275573:
                return BetType.ASIAN_HANDICAP_H1
            case 1001160024:
                return BetType.ODD_EVEN_TEAM2
            case 1001160038:
                return BetType.ODD_EVEN
            case 1001159808:
                return BetType.ODD_EVEN_TEAM2


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
            case "OT_ONE_OR_CROSS":
                return "1X"
            case "OT_ONE_OR_TWO":
                return "12"
            case "OT_CROSS_OR_TWO":
                return "X2"
            case "OT_YES":
                return "YES"
            case "OT_NO":
                return "NO"
            case "OT_ODD":
                return "ODD"
            case "OT_EVEN":
                return "EVEN"
            default:
                return betOptionName.toUpperCase()
        }
    }


}

export class SbtechParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType){
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
        }
    }

    private static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        return apiResponse.data.markets
            .map(market => SbtechParser.transformToBetOffer(apiResponse.provider, market)).flat()
    }

    private static parseEvents(apiResponse: ApiResponse): Event[] {
        return apiResponse.data.map(page => page.events).flat().map(event => {
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
        const betOffers = []
        if(betOfferType !== BetType.UNKNOWN) {
            const eventId = market.eventId
            market.selections.forEach(selection => {
                const outcomeType = SbtechParser.determineOutcomeType(selection.outcomeType)
                const price = selection.trueOdds
                const line = selection.points ? selection.points : NaN
                betOffers.push(new BetOffer(betOfferType, eventId, provider, outcomeType, price, line))
            })
        }
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
            default:
                return outcomeType.toUpperCase()
        }
    }

    private static determineBetOfferType(typeId: string): BetType {
        switch(typeId){
            case '1_0':
                return BetType._1X2
            case "2_0":
                return BetType.ASIAN_HANDICAP
            case '3_0':
                return BetType.OVER_UNDER
            case "158":
                return BetType.BOTH_TEAMS_SCORE
            case "61":
                return BetType.DOUBLE_CHANCE
            case "60":
                return BetType.CORRECT_SCORE
            case "2_157":
                return BetType.DRAW_NO_BET
            case "3_7":
                return BetType.OVER_UNDER_TEAM
            default:
                return BetType.UNKNOWN

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
        return apiResponse.data.Result.Items[0].Events.map(event => {
            return {eventId: event.Id, sportRadarId: event.ExtId}
            new Event(
                new BookmakerId(apiResponse.provider, event.Id.toString(), IdType.EVENT),
                event.EventDate,
                event.Competitors.map(competitor => new Participant(
                    getParticipantName(competitor.Name.toUpperCase()),
                    [new BookmakerId(apiResponse.provider, competitor.Name.toUpperCase(), IdType.PARTICIPANT)]
                ))
            )
        }).flat()
    }

    private static parseParticipants(apiResponse: ApiResponse): Participant[] {
        if(!apiResponse.data.Result) return []
        return apiResponse.data.Result.Items[0].Events.map(event => event.Competitors.map(participant => new Participant(
            getParticipantName(participant.Name), [new BookmakerId(apiResponse.provider, participant.Name.toUpperCase(),
                IdType.PARTICIPANT)])).flat()).flat()
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
        if(typeId.startsWith("11_")) return BetType.DRAW_NO_BET
        if(typeId.startsWith("16_")) return BetType.HANDICAP
        if(typeId.startsWith("18_")) return BetType.OVER_UNDER
        if(typeId.startsWith("26_")) return BetType.ODD_EVEN
    }
}

export class BetcenterParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType) {
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
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

    private static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.games) return []
        const betOffers = []
        apiResponse.data.games.forEach(event => {
            event.markets.forEach(market => {
                const betType = BetcenterParser.determineBetType(market.id)
                const line = market.anchor
                const handicap = market.hc
                if(betType) {
                    market.tips.forEach(tip => {
                        let outcome = tip.text.toUpperCase()

                        const price = tip.odds / 100
                        if(betType === BetType.OVER_UNDER || betType === BetType.OVER_UNDER_TEAM2
                            || betType === BetType.OVER_UNDER_H1 || betType === BetType.OVER_UNDER_TEAM1) {
                            outcome = outcome.includes('+') ? 'OVER' : 'UNDER'
                        }
                        betOffers.push(new BetOffer(betType, event.id, Provider.BETCENTER, outcome, price, line, NaN, handicap))
                    })
                }
            })
        })

        return betOffers
    }

    private static determineBetType(id): BetType {
        const overUnders = [22462, 22252, 22472, 22482, 22492, 22502, 22512]
        const overUnders_1H = [22342, 22352, 22362]
        const handicaps_1H = [23482, 23462]
        const handicaps = [22272, 22282, 22292, 22302, 22312, 22322]
        if(id === 22242) return BetType._1X2
        if(id === 22332) return BetType._1X2_FIRST_HALF
        if(id === 22522) return BetType.DOUBLE_CHANCE
        if(id === 22262) return BetType.BOTH_TEAMS_SCORE
        if(id === 23662) return BetType.OVER_UNDER_TEAM1
        if(id === 23672) return BetType.OVER_UNDER_TEAM2
        if(id === 22532) return BetType.ODD_EVEN
        if(id === 23432) return BetType.DOUBLE_CHANCE_1H
        if(overUnders.includes(id)) return BetType.OVER_UNDER
        if(handicaps.includes(id)) return BetType.HANDICAP
        if(overUnders_1H.includes(id)) return BetType.OVER_UNDER_H1
        if(handicaps_1H.includes(id)) return BetType.HANDICAP_H1
    }
}

export class LadbrokesParser {
    static parse(apiResponse: ApiResponse): any[] {
        switch(apiResponse.requestType) {
            case RequestType.BET_OFFER:
                return this.parseBetOffers(apiResponse)
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
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

    static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        const betOffers = []
        apiResponse.data.result.betGroupList.map(betGroup => betGroup.oddGroupList).flat().forEach(oddGroup => {
            const betType = LadbrokesParser.determineBetOfferType(oddGroup.betId)
            const line = oddGroup.additionalDescription ? parseFloat(oddGroup.additionalDescription.toUpperCase().trim()): NaN
            oddGroup.oddList.forEach(option => {
                const outcome = option.oddDescription.toUpperCase()
                const price = option.oddValue / 100
                betOffers.push(new BetOffer(betType, apiResponse.data.result.eventInfo.aliasUrl, Provider.LADBROKES, outcome, price, line))
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
            case 1550:
                return BetType.BOTH_TEAMS_SCORE
            case 1555:
                return BetType.DOUBLE_CHANCE
            case 53:
                return BetType.HANDICAP
            case 74:
                return BetType.HALF_TIME_FULL_TIME
            case 51:
                return BetType.CORRECT_SCORE
            case 79:
                return BetType.ODD_EVEN
            case 363:
                return BetType._1X2_FIRST_HALF
            case 372:
                return BetType.BOTH_TEAMS_SCORE_H1
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

    static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        const betOffers = []
        apiResponse.data.market.forEach(betOffer => {
            const betType = MeridianParser.determineBetType(betOffer.templateId)
            if(betType !== BetType.UNKNOWN) {
                const line = betOffer.overUnder ? parseFloat(betOffer.overUnder) : NaN
                betOffer.selection.forEach(option => {
                    const price = parseFloat(option.price)
                    const outcome = MeridianParser.determineOutcome(option)
                    betOffers.push(new BetOffer(betType, apiResponse.data.id, Provider.MERIDIAN, outcome, price, line))
                })
            }
        })
        return betOffers
    }

    private static determineOutcome(option) {
        if(option.name === "[[Rival1]]") return "1"
        if(option.name === "[[Rival2]]") return "2"
        if(option.name === "draw") return "X"
        if(option.name.toUpperCase() === "[[DRAW]]") return "X"
        if(option.name.toUpperCase() === "[[UNDER]]") return "UNDER"
        if(option.name.toUpperCase() === "[[OVER]]") return "OVER"
        if(option.name.toUpperCase() === "I NG") return "NG"
        if(option.name.toUpperCase() === "I GG") return "GG"
        if(option.name.toUpperCase() === "II NG") return "NG"
        if(option.name.toUpperCase() === "II GG") return "GG"
        if(option.name.toUpperCase() === "I X2") return "X2"
        if(option.name.toUpperCase().toUpperCase() === "I 12") return "12"
        if(option.name.toUpperCase() === "I 1X") return "1X"
        if(option.name.toUpperCase() === "II X2") return "X2"
        if(option.name.toUpperCase() === "II 12") return "12"
        if(option.name.toUpperCase() === "II 1X") return "1X"
        return option.name.toUpperCase()
    }

    private static determineBetType(id: string): BetType {
        switch(id){
            case '3999':
                return BetType._1X2
            case '4004':
                return BetType.OVER_UNDER
            case '4008':
                return BetType.DOUBLE_CHANCE
            case '4007':
                return BetType.BOTH_TEAMS_SCORE
            case "4117":
                return BetType.DRAW_NO_BET
            case "4637":
                return BetType.HALF_TIME_FULL_TIME
            case "4653":
                return BetType.OVER_UNDER_TEAM1
            case "4656":
                return BetType.OVER_UNDER_TEAM2
            case "4654":
                return BetType.OVER_UNDER_TEAM1_H1
            case "4657":
                return BetType.OVER_UNDER_TEAM2_H1
            case "4655":
                return BetType.OVER_UNDER_TEAM1_H2
            case "4658":
                return BetType.OVER_UNDER_TEAM2_H2
            case "4098":
                return BetType.HANDICAP
            case "4097":
                return BetType.ASIAN_HANDICAP
            case "4016":
                return BetType.EXACT_GOALS
            case "4010":
                return BetType.ODD_EVEN_TEAM1
            case "4012":
                return BetType.ODD_EVEN_TEAM2
            case "4072":
                return BetType.HALF_TIME_FULL_TIME
            case "4017":
                return BetType._1X2_FIRST_HALF
            case "4022":
                return BetType.DOUBLE_CHANCE_1H
            case "4040":
                return BetType.DRAW_NO_BET_1H
            case "4018":
                return BetType.OVER_UNDER_H1
            case "4041":
                return BetType.ODD_EVEN_H1
            case "4021":
                return BetType.BOTH_TEAMS_SCORE_H1
            case "4038":
                return BetType.CORRECT_SCORE_H1
            case "4042":
                return BetType._1X2_H2
            case "4046":
                return BetType.DOUBLE_CHANCE_H2
            case "4059":
                return BetType.DRAW_NO_BET_H2
            case "4043":
                return BetType.OVER_UNDER_H2
            case "4051":
                return BetType.EXACT_GOALS_H2
            case "4060":
                return BetType.ODD_EVEN_H2
            case "4045":
                return BetType.BOTH_TEAMS_SCORE_H2
            case "4058":
                return BetType.CORRECT_SCORE_H2
            case "4036":
                return BetType.HANDICAP_H1
            case "4056":
                return BetType.HANDICAP_H2
            default:
                return BetType.UNKNOWN
        }
    }
}

function getParticipantName(name: string): ParticipantName{
    let found
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
        }
    }

    private static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        const eventsParsed = parser.parse(apiResponse.data.data)
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
        const betOffers = apiResponse.data.specialBetOffers
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
                    betOffersFound.push(new BetOffer(betType, apiResponse.data.eventId, apiResponse.provider,
                        betOption === '+' ? "OVER" : betOption === "-" ? "UNDER": betOption,
                        priceValue.replace(",", "."), line))
                })
            }
        })
        return betOffersFound.concat(apiResponse.data._1X2)
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
        const events = apiResponse.data.data
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
            case RequestType.EVENT:
                return this.parseEvents(apiResponse)
        }
    }

    private static parseEvents(apiResponse: ApiResponse): Event[]{
        let events = []
        for(let i = 0; i < apiResponse.data.length; i +=2) {
            events = events.concat(apiResponse.data[i].filter(event => !event.parent).map(event => {
                return this.parseEvent(event)
            }))
        }
        return events
    }

    private static parseEvent(event): Event {
        const participants: Participant[] = event.participants.map(participant => {
            return new Participant(getParticipantName(participant.name),
                [new BookmakerId(Provider.PINNACLE, participant.name.toUpperCase(), IdType.PARTICIPANT)])
        })
        return new Event(new BookmakerId(Provider.PINNACLE, event.id.toString(), IdType.EVENT), event.startTime, participants)
    }

    private static parseOffers(apiResponse: ApiResponse): BetOffer[] {
        let betOffers = []
        for(let i = 0; i < apiResponse.data.length; i +=2) {
            const test = PinnacleParser.parseBetOffers(apiResponse.data[i], apiResponse.data[i+1])
            betOffers = betOffers.concat(test)
        }
        return betOffers
    }

    private static parseBetOffers(marketIds, offers): BetOffer[] {
        const betOffers = []
        marketIds.forEach(marketId => {
            const marketOffers = offers.filter(offer => offer.matchupId === marketId.id).flat()
            marketOffers.forEach(offer => {
                const betType = PinnacleParser.determineBetType(offer.key, marketId)
                if(betType !== BetType.UNKNOWN) {
                    const vigFreePrices = PinnacleParser.calculateVigFreePrices(offer.prices, marketId)
                    offer.prices.forEach(price => {
                        const outcome = PinnacleParser.determineOutcome(price.designation, marketId, price.participantId)
                        const line = price.points ? price.points : NaN
                        const odds = this.toDecimalOdds(price.price)
                        betOffers.push(new BetOffer(betType, marketId.parent ? marketId.parent.id : marketId.id, Bookmaker.PINNACLE, outcome, odds, line,
                            parseFloat(vigFreePrices.filter(vigFreePrice => vigFreePrice.outcomeType === outcome)[0].vigFreePrice)))
                    })
                }
            })
        })
        return betOffers
    }

    private static determineBetType(key, marketId): BetType {
        const splitted = key.split(";")
        const period = splitted[1]
        const type = splitted[2]
        if(!marketId.parent) {
            // primary markets
            if(type === "m") {
                if(period === "0") return BetType._1X2
                if(period === "1") return BetType._1X2_FIRST_HALF
            }
            if(type === "tt"){
                if(splitted[4] === "home") {
                    if(period === "0") return BetType.OVER_UNDER_TEAM1
                    if(period === "1") return BetType.OVER_UNDER_TEAM1_H1
                }
                if(splitted[4] === "away") {
                    if(period === "0") return BetType.OVER_UNDER_TEAM2
                    if(period === "1") return BetType.OVER_UNDER_TEAM2_H1
                }
            }
            if(type === "s") {
                if(period === "0") return BetType.ASIAN_HANDICAP
                if(period === "1") return BetType.ASIAN_HANDICAP_H1
            }

            if(type === "ou") {
                if(period === "0") return BetType.ASIAN_OVER_UNDER
                if(period === "1") return BetType.ASIAN_OVER_UNDER_H1
            }
        } else if(marketId.type === "special") {
            if(marketId.special.description.includes("3-way Handicap")) return BetType.HANDICAP
            // specials
            switch(marketId.special.description) {
                case "Double Chance 1st Half":
                    return BetType.DOUBLE_CHANCE_1H
                case "Double Chance":
                    return BetType.DOUBLE_CHANCE
                case "Total Goals Odd/Even 1st Half":
                    return BetType.ODD_EVEN_H1
                case "Both Teams To Score":
                    return BetType.BOTH_TEAMS_SCORE
                case "Draw No Bet 1st Half":
                    return BetType.DRAW_NO_BET_1H
                case "Exact Total Goals":
                    return BetType.EXACT_GOALS
                case "Draw No Bet":
                    return BetType.DRAW_NO_BET
                case "Total Goals Odd/Even":
                    return BetType.ODD_EVEN

            }
        }

        if(splitted)
        if(key === 's;0;m') return BetType._1X2
        if(key.includes('s;0;ou')) return BetType.ASIAN_OVER_UNDER
        if(key.includes("s;0;s")) return BetType.ASIAN_HANDICAP
        if(key.includes(""))
        return BetType.UNKNOWN
    }

    static toDecimalOdds(americanOdds): number {

        if(americanOdds < 0) {
            return parseFloat(((100 / Math.abs(americanOdds)) + 1).toFixed(2))
        } else {
            return parseFloat(((americanOdds / 100) + 1).toFixed(2))
        }

    }

    private static determineOutcome(outcome: string, marketId, participantId) {
        if(!marketId.parent) {
            switch(outcome.toUpperCase()) {
                case 'HOME':
                    return '1'
                case 'AWAY':
                    return '2'
                case 'DRAW':
                    return 'X'
                default:
                    return outcome
            }
        } else {
            return marketId.participants.filter(participant => participant.id === participantId)[0].name.toUpperCase()
        }

    }

    private static calculateVigFreePrices(prices, marketId) {
        const decimalOdds = prices.map(price => this.toDecimalOdds(price.price))
        let vig = 0

        decimalOdds.forEach(odd => {
            vig += 1/odd
        })

        const vigFreePrices = []
        prices.forEach(price => {
            const outcomeType = this.determineOutcome(price.designation, marketId, price.participantId)
            const vigFreePrice = this.toDecimalOdds(price.price) / vig
            vigFreePrices.push({outcomeType: outcomeType, vigFreePrice: vigFreePrice.toFixed(2)})
        })
        return vigFreePrices
    }
}