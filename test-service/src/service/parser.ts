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

export class StanleyBetParser {
    static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        const eventId = apiResponse.data.split("avv:")[1].split(',')[0].toString()
        const betOffers = apiResponse.data.split("ScommessaDTO").slice(1)
        return betOffers.map(betOffer => {
            const betType = this.determineBetType(betOffer.split('"id_scom":')[1].split(",")[0])
            const line = parseInt(betOffer.split("handicap:")[1].split(",")[0])/100
            if(betType !== BetType.UNKNOWN) {
                const selections = betOffer.split("EsitoDTO").slice(1)
                return selections.map(selection => {
                    const outcome = this.determineOutcome(selection.split('"desc_esito":"')[1].split('","')[0])
                    const price = parseInt(selection.split("quota:")[1])/100
                    return new BetOffer(betType, eventId, Bookmaker.STANLEYBET, outcome, price, line)
                })
            }

        }).flat().filter(x => x)
    }

    static determineOutcome(outcome) {
        switch(outcome) {
            case "GOAL":
                return "YES"
            case "NO GOAL":
                return "NO"
            case "ONEVEN":
                return "ODD"
            case "JA":
                return "YES"
            case "NEE":
                return "NO"
            default:
                return outcome.toUpperCase()
        }
    }

    static determineBetType(id) {
        switch(id) {
            case "5":
                return BetType._1X2
            case "-8000":
                return BetType.DOUBLE_CHANCE
            case "7554":
                return BetType.DOUBLE_CHANCE_H2
            case "7557":
                return BetType.DOUBLE_CHANCE_1H
            case "20":
                return BetType.BOTH_TEAMS_SCORE
            case "9":
                return BetType.CORRECT_SCORE
            case "16":
                return BetType._1X2_FIRST_HALF
            case "21":
                return BetType.ODD_EVEN
            case "122":
                return BetType._1X2_H2
            case "409":
                return BetType.CORRECT_SCORE_H1
            case "548":
                return BetType.CORRECT_SCORE_H2
            case "549":
                return BetType.ODD_EVEN_TEAM1
            case "550":
                return BetType.ODD_EVEN_TEAM2
            case "556":
                return BetType.OVER_UNDER_TEAM1
            case "557":
                return BetType.OVER_UNDER_TEAM2
            case "1843":
                return BetType.HANDICAP
            case "1844":
                return BetType.HANDICAP
            case "1845":
                return BetType.HANDICAP
            case "1846":
                return BetType.HANDICAP
            case "4168":
                return BetType.HANDICAP_H2
            case "5193":
                return BetType.OVER_UNDER_TEAM1
            case "5196":
                return BetType.OVER_UNDER_TEAM1
            case "5274":
                return BetType.OVER_UNDER_TEAM1
            case "5305":
                return BetType.OVER_UNDER_TEAM2
            case "5876":
                return BetType.OVER_UNDER_TEAM2
            case "6218":
                return BetType.OVER_UNDER_TEAM2
            case "12640":
                return BetType.OVER_UNDER
            case "12636":
                return BetType.OVER_UNDER
            case "12626":
                return BetType.OVER_UNDER
            case "12193":
                return BetType.OVER_UNDER
            case "12207":
                return BetType.OVER_UNDER
            default:
                return BetType.UNKNOWN
        }
    }
}

export class ScoooreParser {
    static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        return apiResponse.data.eventmarketgroups.map(marketGroup => marketGroup.fullmarkets).flat().map(betOffer => {
            const betType = this.determineBetType(betOffer.idfomarkettype.toString())
            if(betType !== BetType.UNKNOWN) {
                const line = betOffer.currentmatchhandicap
                return betOffer.selections.map(selection => {
                    const outcome = this.determineOutcome(betType, selection)
                    return new BetOffer(betType, betOffer.idfoevent.toString(), Bookmaker.SCOOORE, outcome, selection.price, line)
                }).flat()
            }
        })
    }

    static determineOutcome(betType: BetType, selection) {
        if(betType === BetType.CORRECT_SCORE || betType === BetType.CORRECT_SCORE_H1 || betType === BetType.CORRECT_SCORE_H2
            ) {
            return selection.name
        } else if(betType === BetType.DOUBLE_CHANCE || betType === BetType.DOUBLE_CHANCE_1H || betType === BetType.DOUBLE_CHANCE_H2) {
            switch (selection.internalorder) {
                case 1:
                    return "1X"
                case 2:
                    return "12"
                case 3:
                    return "X2"
            }
        } else {
            switch(selection.hadvalue ? selection.hadvalue : selection.name) {
                case "O":
                    return "OVER"
                case "U":
                    return "UNDER"
                case "D":
                    return "X"
                case "H":
                    return "1"
                case "A":
                    return "2"
                case "Ja":
                    return "YES"
                case "Nee":
                    return "NO"
                case "Oneven":
                    return "ODD"
                case "Even":
                    return "EVEN"
            }
        }
    }

    static determineBetType(betType): BetType {
        switch(betType){
            case "70143.1":
                return BetType._1X2
            case "70129.1":
                return BetType.DOUBLE_CHANCE
            case "70144.1":
                return BetType._1X2_FIRST_HALF
            case "70092.1":
                return BetType.BOTH_TEAMS_SCORE
            case "86949.1":
                return BetType.OVER_UNDER
            case "70116.1":
                return BetType.DRAW_NO_BET
            case "70132.1":
                return BetType.HANDICAP
            case "70145.1":
                return BetType._1X2_H2
            case "70130.1":
                return BetType.DOUBLE_CHANCE_1H
            case "70133.1":
                return BetType.HANDICAP_H1
            case "70104.1":
                return BetType.ODD_EVEN_H1
            case "86943.1":
                return BetType.OVER_UNDER_TEAM1
            case "86940.1":
                return BetType.OVER_UNDER_TEAM2
            case "86944.1":
                return BetType.OVER_UNDER_TEAM1_H1
            case "86941.1":
                return BetType.OVER_UNDER_TEAM2_H1
            case "70071.1":
                return BetType.ODD_EVEN_TEAM1
            case "70054.1":
                return BetType.ODD_EVEN_TEAM2
            case "70169.1":
                return BetType.CORRECT_SCORE
            case "70164.1":
                return BetType.CORRECT_SCORE_H1
            case "70103.1":
                return BetType.ODD_EVEN
            default:
                return BetType.UNKNOWN
        }
    }
}

export class ZetBetParser {
    static parseBetOffers(apiResponse: ApiResponse) {
        const root = parser.parse(apiResponse.data)
        const marketNodes = root.querySelectorAll(".item-content  ")
        const betOffers = {}
        let currentMarket
        for (let i = 0; i < marketNodes.length; i++) {
            const element = marketNodes[i]
            if (element.rawAttrs === 'class="uk-icon-bullseye"') {
                currentMarket = element.parentNode.childNodes[1].rawText.split("\n")[1].trim()
            } else {
                if (!betOffers[currentMarket]) {
                    betOffers[currentMarket] = {elements: [element]}
                }
                 else {
                    const elements = betOffers[currentMarket].elements
                    elements.push(element)
                    betOffers[currentMarket] = {elements: elements}
                }

            }
        }
        return betOffers
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



    static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        const eventId = apiResponse.data.Event.Id
        const markets = apiResponse.data.Markets
        const outcomes = apiResponse.data.Outcomes
        return markets.map(market => {
            const betType = BetwayParser.determineBetType(market.TypeCName, market.MarketGroupCName)
            if(betType !== BetType.UNKNOWN) {
                let line = market.Handicap ? market.Handicap : NaN
                if(betType === BetType.OVER_UNDER || betType === BetType.OVER_UNDER_H1) {
                    const titleSplitted = market.Title.split(" ")
                    line = parseFloat(titleSplitted[titleSplitted.length - 1])
                }
                return market.Outcomes[0].map(outcomeToSearch => {
                    const outcome = outcomes.filter(outcomeElement => outcomeElement.Id === outcomeToSearch)[0]
                    const option = this.determineOption(betType, outcome.CouponName.toUpperCase(), outcome.SortIndex)
                    return new BetOffer(betType, eventId, Bookmaker.BETWAY, option, outcome.OddsDecimalDisplay, line)
                })
            }
        }).flat().filter(x => x)
    }

    static determineOption(betType, couponName, sortIndex) {
        if(betType === BetType.ASIAN_HANDICAP || betType === BetType.ASIAN_HANDICAP_H1 || betType  === BetType.ASIAN_OVER_UNDER
            || betType === BetType.ASIAN_OVER_UNDER_H1) {
            if(sortIndex === 1) return "1"
            return "2"
        }
        switch(couponName) {
            case "HOME":
                return "1"
            case "DRAW":
                return "X"
            case "AWAY":
                return "2"
            case "HOME & DRAW":
                return "1X"
            case "HOME & AWAY":
                return "12"
            case "AWAY & DRAW":
                return "X2"

            default:
                return couponName

        }
    }
    private static determineBetType(typeName, marketGroup) {
        if(marketGroup.toUpperCase() === "HALF") {
            switch(typeName){
                case "correct-score":
                    return BetType.CORRECT_SCORE_H1
                case "goals-over":
                    return BetType.OVER_UNDER_H1
                case "handicap-asian":
                    return BetType.ASIAN_HANDICAP_H1
                case "handicap-asian-goals-over":
                    return BetType.ASIAN_OVER_UNDER_H1
                case "win-draw-win":
                    return BetType._1X2_FIRST_HALF
                default:
                    return BetType.UNKNOWN
            }
        }
        switch(typeName) {
            case "win-draw-win":
                return BetType._1X2
            case "double-chance":
                return BetType.DOUBLE_CHANCE
            case "goals-over":
                return BetType.OVER_UNDER
            case "handicap-goals-over":
                return BetType.HANDICAP
            case "handicap-asian":
                return BetType.ASIAN_HANDICAP
            case "handicap-asian-goals-over":
                return BetType.ASIAN_OVER_UNDER
            case "correct-score":
                return BetType.CORRECT_SCORE
            case "draw-no-bet":
                return BetType.DRAW_NO_BET
            case "handicap-wdw":
                return BetType.HANDICAP
            default:
                return BetType.UNKNOWN
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

export class BwinParser {
    static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        return apiResponse.data.fixtures.map(event => {
            const eventId = event.id
            return event.games.map(game => {
                const betType = this.determineBetType(game.templateId)
                if(betType !== BetType.UNKNOWN) {
                    const line = game.attr
                    return game.results.map((result, index) => {
                        const price = result.odds
                        const outcome = this.determineOutcome(betType, result, index)
                        return new BetOffer(betType, eventId, Bookmaker.BWIN, outcome, price, line)
                    })
                }
            })
        }).flat().filter(x => x)
    }

    static determineOutcome(betType, result, index) {
        if(betType === BetType.DOUBLE_CHANCE) {
            if(result.name.value.includes("X or")) return "X2"
            if(result.name.value.includes("or X")) return "1X"
            return "12"
        }
        if(betType === BetType.OVER_UNDER || betType === BetType.OVER_UNDER_H1 || betType === BetType.OVER_UNDER_H2) {
            return result.totalsPrefix.toUpperCase()
        }
        if(betType === BetType._1X2) {
            return result.sourceName.value.toUpperCase()
        }
        if(betType === BetType.DRAW_NO_BET) {
            if(index === 0) return "1"
            return "2"
        }
        if(betType === BetType.HANDICAP || betType === BetType._1X2_FIRST_HALF) {
            if(index === 0) return "1"
            if(index === 1) return "X"
            return "2"
        }
        return result.name.value.toUpperCase()

    }

    static determineBetType(templateId) {
        switch(templateId) {
            case 17:
                return BetType._1X2
            case 173:
                return BetType.OVER_UNDER
            case 859:
                return BetType.OVER_UNDER
            case 7233:
                return BetType.OVER_UNDER
            case 1772:
                return BetType.OVER_UNDER
            case 1791:
                return BetType.OVER_UNDER
            case 8933:
                return BetType.OVER_UNDER
            case 3187:
                return BetType.DOUBLE_CHANCE
            case 7824:
                return BetType.BOTH_TEAMS_SCORE
            case 12119:
                return BetType.DRAW_NO_BET
            case 52:
                return BetType.HANDICAP
            case 54:
                return BetType.HANDICAP
            case 2488:
                return BetType._1X2_FIRST_HALF
            case 7688:
                return BetType.OVER_UNDER_H1
            case 7689:
                return BetType.OVER_UNDER_H1
            case 7890:
                return BetType.OVER_UNDER_H1
            case 7891:
                return BetType.OVER_UNDER_H1
            case 19595:
                return BetType.OVER_UNDER_H2
            case 19596:
                return BetType.OVER_UNDER_H2
            case 19597:
                return BetType.OVER_UNDER_H2
            case 20506:
                return BetType.OVER_UNDER_H2
            default:
                return BetType.UNKNOWN
        }
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

    static parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
        if(!apiResponse.data.games) return []
        const betOffers = []
        apiResponse.data.games.forEach(event => {
            event.markets.forEach(market => {
                const betType = BetcenterParser.determineBetType(market.id)
                const line = market.anchor ? market.anchor : market.hc
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