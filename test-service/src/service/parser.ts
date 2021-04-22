import {IdType, Participant, ParticipantName, RequestType} from '../domain/betoffer'
import {ApiResponse} from "../client/scraper";
import {participantMap} from "./mapper";
import {BetLine, BetType, Bookmaker, BookmakerId, Provider} from "./bookmaker";
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
                case Provider.LADBROKES:
                    return LadbrokesParser.parse(apiResponse)
                case Provider.BET90:
                    return Bet90Parser.parse(apiResponse)
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
                return BetType.DOUBLE_CHANCE_H1
            case "20":
                return BetType.BOTH_TEAMS_SCORE
            case "9":
                return BetType.CORRECT_SCORE
            case "16":
                return BetType._1X2_H1
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
        if(!apiResponse.data.eventmarketgroups) return []
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
        } else if(betType === BetType.DOUBLE_CHANCE || betType === BetType.DOUBLE_CHANCE_H1 || betType === BetType.DOUBLE_CHANCE_H2) {
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
                return BetType._1X2_H1
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
                return BetType.DOUBLE_CHANCE_H1
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
        const root = parser.parse(apiResponse.data.data)
        const eventId = apiResponse.data.eventId
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
        return Object.keys(betOffers).map(key => {
            const prices = betOffers[key].elements
            const betLine = this.determineLine(key)
            if(betLine.betType !== BetType.UNKNOWN) {
                return prices.map((price, index) => {
                    let outcome = price.querySelectorAll(".pmq-cote-acteur").flat().map(element => element.childNodes[0].rawText.split("\n")[1].trim())[0]
                    outcome = this.determineOutcome(outcome, betLine.betType, index)
                    const odd = price.querySelectorAll(".pmq-cote").map(element => parseFloat(element.childNodes[0].rawText.split("\n")[1].trim().replace(",", ".")))[0]
                    return new BetOffer(betLine.betType, eventId, Bookmaker.ZETBET, outcome ? outcome.toUpperCase(): outcome, odd, betLine.line)
                }).flat()
            }
        }).flat().filter(x => x)
    }

    static determineOutcome(outcome, betType, index) {
        if(betType === BetType._1X2_H2 || betType === BetType._1X2_H1 || betType === BetType._1X2 || betType === BetType.HANDICAP
        || betType === BetType.HANDICAP_H1 || betType === BetType.HANDICAP_H2) {
            if(index === 0) return "1"
            if(index === 1) return "X"
            if(index === 2) return "2"
        }
        if(betType === BetType.DRAW_NO_BET || betType === BetType.DRAW_NO_BET_H1 || betType === BetType.DRAW_NO_BET_H2
        || betType === BetType.ASIAN_HANDICAP || betType === BetType.ASIAN_HANDICAP_H1 || betType === BetType.ASIAN_HANDICAP_H2) {
            if(index === 0) return "1"
            if(index === 1) return "2"
        }
        return outcome
    }

    static determineLine(betType): BetLine {
        if(betType.includes("Over / Under") && betType.includes("goals")) {
            const line = parseFloat(betType.split("Over / Under ")[1].split("goals")[0].trim())
            if(betType.includes("1st half")) return new BetLine(BetType.OVER_UNDER_H1, line)
            if(betType.includes("2nd half")) return new BetLine(BetType.OVER_UNDER_H2, line)
            return new BetLine(BetType.OVER_UNDER, line)
        }
        if(betType.includes("Over Under") && betType.includes("goals")) {
            const line = parseFloat(betType.split("Over Under ")[1].split("goals")[0].trim())
            if(betType.includes("1st half")) return new BetLine(BetType.OVER_UNDER_H1, line)
            if(betType.includes("2nd half")) return new BetLine(BetType.OVER_UNDER_H2, line)
            return new BetLine(BetType.OVER_UNDER, line)
        }

        if(betType.toUpperCase().includes("TOTAL GOALS")) {
            const upper = betType.toUpperCase()
            const splitted = upper.split("TOTAL GOALS")
            if(splitted.length > 1) {
                return new BetLine(BetType.TOTAL_GOALS_TEAM1)
            } else {
                return new BetLine(BetType.TOTAL_GOALS)
            }
        }

        if(betType.includes("odd or even")) {
            if(betType.includes("total goals")) {
                return new BetLine(BetType.ODD_EVEN_TEAM1)
            }
        }

        switch(betType.trim()) {
            case "Who will win the match?":
                return new BetLine(BetType._1X2)
            case "Double Chance":
                return new BetLine(BetType.DOUBLE_CHANCE)
            case "Correct Score":
                return new BetLine(BetType.CORRECT_SCORE)
            case "Total goals":
                return new BetLine(BetType.TOTAL_GOALS)
            case "Half-Time Correct score":
                return new BetLine(BetType.CORRECT_SCORE_H1)
            case "Both teams to score in 2nd half?":
                return new BetLine(BetType.BOTH_TEAMS_SCORE_H2)
            case "Who will win the 1st half?":
                return new BetLine(BetType._1X2_H1)
            case "Who will win the 2nd half ?":
                return new BetLine(BetType._1X2_H2)
            case "Double Chance - 1st half":
                return new BetLine(BetType.DOUBLE_CHANCE_H1)
            case "Double Chance - 2nd Half":
                return new BetLine(BetType.DOUBLE_CHANCE_H2)
            case "Draw no bet":
                return new BetLine(BetType.DRAW_NO_BET)
            case "Handicap (-0.5) - To win the match":
                return new BetLine(BetType.ASIAN_HANDICAP, 0.5)
            case "Handicap (-1.5) - To win the match":
                return new BetLine(BetType.ASIAN_HANDICAP, 1.5)
            case "2nd Half correct score":
                return new BetLine(BetType.CORRECT_SCORE_H2)
            case "Number of goals, odd or even?":
                return new BetLine(BetType.ODD_EVEN)
            case "Number of goals in first half odd or even ?":
                return new BetLine(BetType.ODD_EVEN_H1)
            case "Number of goals in 2nd half, odd or even ?":
                return new BetLine(BetType.ODD_EVEN_H2)
            case "Handicap (0:1) - To win the 1st half":
                return new BetLine(BetType.HANDICAP_H1, 1)
            case "Handicap (-0.5) - To win the 1st half":
                return new BetLine(BetType.ASIAN_HANDICAP_H1, 0.5)
            case "Handicap (0:1) - To win the match":
                return new BetLine(BetType.HANDICAP, 1)
            case "Handicap (0:2) - To win the match":
                return new BetLine(BetType.HANDICAP, 2)
            case "Handicap (1:0) - To win the match":
                return new BetLine(BetType.HANDICAP, 1)
            case "Handicap (2:0) - To win the match":
                return new BetLine(BetType.HANDICAP, 2)
            case "Draw no bet - 1st half":
                return new BetLine(BetType.DRAW_NO_BET_H1)
            case "Draw no bet - 2nd Half":
                return new BetLine(BetType.DRAW_NO_BET_H2)
            case "Handicap (0:1) - To win the 2nd half":
                return new BetLine(BetType.HANDICAP_H2, 1)
            case "Handicap (-0.5)  - To win the 2nd half":
                return new BetLine(BetType.ASIAN_HANDICAP_H2, 0.5)
            default:
                return new BetLine(BetType.UNKNOWN)
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
                    return BetType._1X2_H1
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
                return BetType._1X2_H1
            default:
                return BetType.UNKNOWN
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
        if(!apiResponse.data.result) return []
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
                return BetType._1X2_H1
            case 372:
                return BetType.BOTH_TEAMS_SCORE_H1
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