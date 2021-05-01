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
                case Provider.BET90:
                    return Bet90Parser.parse(apiResponse)
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