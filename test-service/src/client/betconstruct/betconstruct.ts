import {BetType, Bookmaker, Provider} from "../../service/bookmaker";
import {BookMakerInfo, EventInfo} from "../../service/events";
import {getSportRadarEventUrl} from "../sportradar/sportradar";
import {ApiResponse} from "../scraper";
import {BetOffer} from "../../service/betoffers";
import {RequestType} from "../../domain/betoffer";
import {pinnacle_sportradar} from "../pinnacle/participants";
import {star_casino_sportradar} from "./participants";

const WebSocket = require("ws")

const books = {}
const books_bcapps = {}

books_bcapps[Bookmaker.STAR_CASINO] = "wss://eu-swarm-ws-re.bcapps.net/"
books[Bookmaker.CIRCUS] = "wss://wss01.circus.be"
books[Bookmaker.GOLDENVEGAS] = "wss://wss.goldenvegas.be"

let circusEvents = undefined
let starCasinoEvents = undefined
let goldenVegasEvents = undefined

function startWebSocket(bookmaker, id) {
    let url = books[bookmaker]
    if(!url) url = books_bcapps[bookmaker]
    const ws = new WebSocket(url)
    ws.on('open', function open() {
        ws.send(JSON.stringify(connectMessage(bookmaker)))
        ws.send(JSON.stringify(requestMessage(bookmaker, id)))
    })

    ws.on('message', function incoming(data) {
        if(bookmaker === Bookmaker.CIRCUS || bookmaker === Bookmaker.GOLDENVEGAS) {
            const dataParsed = JSON.parse(data)
            if(dataParsed.MessageType === 1000) {
                if(bookmaker === Bookmaker.CIRCUS) {
                    circusEvents = JSON.parse(dataParsed.Message)
                } else {
                    goldenVegasEvents = JSON.parse(dataParsed.Message)
                }
            }
        } else {
            const bla = JSON.parse(data)
            if(bla.data.data) {
                starCasinoEvents = Object.values(bla.data.data.sport["1"].region["290001"].competition["557"].game)
            }
        }
    })
}

export async function getBetconstructBcapsEventsForCompetition(id: string, sportRadarMatches) {
    startWebSocket(Bookmaker.STAR_CASINO, id)
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if(starCasinoEvents) {
                const events = starCasinoEvents.map(event => {
                    const match = sportRadarMatches.filter(match => match && match.participants[0] === star_casino_sportradar[event.team1_id] &&
                        match.participants[1] === star_casino_sportradar[event.team2_id])[0]
                    if(match) {
                        const bookmakerInfo = new BookMakerInfo(Provider.BETCONSTRUCT, Bookmaker.STAR_CASINO, id, event.id,
                            undefined, [],
                            undefined, undefined, undefined)
                        return new EventInfo(match.sportRadarId, match.sportRadarEventUrl, [bookmakerInfo])
                    }
                })
                resolve(events)
                clearInterval(interval)
                starCasinoEvents = undefined
            }}, 100)
    })
}

export async function getBetconstructEventsForCompetition(id: string) {
    startWebSocket(Bookmaker.CIRCUS, id)
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if(circusEvents || goldenVegasEvents) {
                // @ts-ignore
                const data = JSON.parse(circusEvents.Requests[0].Content).LeagueDataSource.LeagueItems[0].EventItems.map(event => {
                    const splitted = event.UrlBetStats.split("/")
                    const sportRadarId = splitted[splitted.length - 1]
                    const bookmakerInfos = Object.keys(books).map(key => {
                        return new BookMakerInfo(Provider.BETCONSTRUCT, key, id, event.EventId, undefined, [], undefined, undefined, undefined)
                    })
                    return new EventInfo(sportRadarId, getSportRadarEventUrl(sportRadarId), bookmakerInfos)
                })
                resolve(data)
                clearInterval(interval)
                circusEvents = undefined
            }}, 100)
    })
}

export async function getBetconstructBetOffersForCompetition(bookmakerInfo: BookMakerInfo): Promise<BetOffer[]> {
    startWebSocket(bookmakerInfo.bookmaker, bookmakerInfo.leagueId)
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if(circusEvents) {
                // @ts-ignore
                resolve(parseBetOffers(new ApiResponse(Provider.BETCONSTRUCT, circusEvents, RequestType.BET_OFFER, Bookmaker.CIRCUS)))
                clearInterval(interval)
                circusEvents = undefined
            } else if(starCasinoEvents) {
                resolve(parseBetOffers(new ApiResponse(Provider.BETCONSTRUCT, starCasinoEvents, RequestType.BET_OFFER, Bookmaker.STAR_CASINO)).flat())
                clearInterval(interval)
                starCasinoEvents = undefined
            } else if(goldenVegasEvents) {
                resolve(parseBetOffers(new ApiResponse(Provider.BETCONSTRUCT, goldenVegasEvents, RequestType.BET_OFFER, Bookmaker.GOLDENVEGAS)))
                clearInterval(interval)
                goldenVegasEvents = undefined
            }}, 100)
    })
}

function connectMessage(bookmaker: Bookmaker) {
    if(bookmaker === Bookmaker.STAR_CASINO) {
        return {"command":"request_session","params":{"language":"eng","site_id":"385","release_date":"15/09/2020-16:48"},"rid":"16062033821871"}
    } else {
        return {"TTL":10,"MessageType":1,
            "Message":"{\"NodeType\":1,\"ClientInformations\":{\"RoomDomainName\":\"" + bookmaker + "\"}}"}
    }
}

function requestMessage(bookmaker, league: string){
    if(bookmaker === Bookmaker.STAR_CASINO) {
        return {"command":"get","params":{"source":"betting","what":{"sport":["id","name","alias"],"competition":["id","name"],"region":["id","name","alias"],"game":[["id","start_ts","team1_name","team2_name","team1_external_id","team2_external_id","team1_id","team2_id","type","show_type","markets_count","is_blocked","exclude_ids","is_stat_available","game_number","game_external_id","is_live","is_neutral_venue","game_info"]],"event":["id","price","type","name","order","base","price_change"],"market":["type","express_id","name","base","display_key","display_sub_key","main_order","col_count","id"]},"where":{"competition":{"id":parseInt(league)},"game":{"type":{"@in":[0,2]}},"market":{"@or":[{"type":{"@in":["P1P2","P1XP2","1X12X2","OverUnder","Handicap","AsianHandicap","BothTeamsToScore","HalfTimeResult","HalfTimeDoubleChance","HalfTimeOverUnder","HalfTimeAsianHandicap","2ndHalfTotalOver/Under"]}},{"display_key":{"@in":["WINNER","HANDICAP","TOTALS"]}}]}},"subscribe":true},"rid":"161598169637418"}
    } else {
        return {"TTL":10,"MessageType":1000,"Message":"{\"Requests\":[{\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"OnlyShowcaseMarket\\\":true,\\\"IncludeSportList\\\":false,\\\"EventSkip\\\":0,\\\"EventTake\\\":20,\\\"EventType\\\":0,\\\"SportId\\\":" + "844" + ",\\\"RequestString\\\":\\\"LeagueIds=" + league + "&OnlyMarketGroup=Main\\\"}}\"}],\"Groups\":[]}"}
    }

}

function determineBetOption(outcome) {
    if(outcome.type === "P2") return "2"
    if(outcome.type === "P1") return "1"
    if(outcome.type === "Home") return "1"
    if(outcome.type === "Away") return "2"
    if(outcome.type === "Over") return "OVER"
    if(outcome.type === "Under") return "UNDER"
    if(outcome.type === "Tie") return "X"
    if(outcome.type === "Yes") return "YES"
    if(outcome.type === "No") return "NO"
    return outcome.type
}

function parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
    if(apiResponse.bookmaker === Bookmaker.STAR_CASINO) {
        return apiResponse.data.map(event => {
            return Object.values(event.market).map(betOffer => {
                // @ts-ignore
                const betType: BetType = determineBetOfferTypeBcaps(betOffer.type)
                if(betType !== BetType.UNKNOWN) {
                    // @ts-ignore
                    const line = betOffer.base ? betOffer.base : undefined
                    // @ts-ignore
                    return Object.values(betOffer.event).map(outcome => {
                        // @ts-ignore
                        return new BetOffer(betType, event.id, Bookmaker.STAR_CASINO, determineBetOption(outcome), outcome.price, line)
                    })
                }
            })
        }).flat()
    } else {
        const response =  JSON.parse(apiResponse.data.Requests[0].Content)
        const betOffers: BetOffer[] = []
        response.LeagueDataSource.LeagueItems.map(league => league.EventItems).flat()
            .filter(event => event.DefaultMarketType === "P1XP2").map(event => event.MarketItems).flat().forEach(marketItem => {
            const betType: BetType = determineBetOfferType(marketItem.BetType)
            marketItem.OutcomeItems.forEach(outcomeItem => {
                let betOption = outcomeItem.Name
                if(betType === BetType._1X2) {
                    if(outcomeItem.OrderPosition === 1) betOption = "1"
                    if(outcomeItem.OrderPosition === 2) betOption = "X"
                    if(outcomeItem.OrderPosition === 3) betOption = "2"
                }
                const line = outcomeItem.Base ? outcomeItem.Base : undefined
                betOffers.push(new BetOffer(betType, marketItem.EventId, apiResponse.bookmaker, betOption, outcomeItem.Odd, line))
            })
        })
        return betOffers
    }
}

function determineBetOfferTypeBcaps(type): BetType {
    switch(type){
        case "P1XP2":
            return BetType._1X2
        case "HalfTimeResult":
            return BetType._1X2_H1
        case "BothTeamsToScore":
            return BetType.BOTH_TEAMS_SCORE
        case "OverUnder":
            return BetType.OVER_UNDER
        case "HalfTimeOverUnder":
            return BetType.OVER_UNDER_H1
        case "AsianHandicap":
            return BetType.ASIAN_HANDICAP
        case "HalfTimeOverUnderAsian":
            return BetType.OVER_UNDER_H1
        case "HalfTimeAsianHandicap":
            return BetType.ASIAN_HANDICAP_H1
        case "1X12X2":
            return BetType.DOUBLE_CHANCE
        case "Handicap":
            return BetType.HANDICAP
        case "2ndHalfTotalOver/Under":
            return BetType.OVER_UNDER_H2
        case "2ndHalfAsianHandicap":
            return BetType.ASIAN_HANDICAP_H2
        case "SecondHalfResult":
            return BetType._1X2_H2
        case "HalfTimeDoubleChance":
            return BetType.DOUBLE_CHANCE_H1
        default:
            return BetType.UNKNOWN

    }
}

function determineBetOfferType(typeId): BetType  {
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
            return BetType._1X2_H1
    }
}


