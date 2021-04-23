import {BetType, Bookmaker, Provider} from "../../service/bookmaker";
import {BookMakerInfo, EventInfo} from "../../service/events";
import {getSportRadarEventUrl} from "../sportradar/sportradar";
import {ApiResponse} from "../scraper";
import {BetOffer} from "../../service/betoffers";
import {RequestType} from "../../domain/betoffer";

const WebSocket = require("ws")

const books = {}
const books_bcapps = {}

books_bcapps[Bookmaker.STAR_CASINO] = "wss://eu-swarm-ws-re.bcapps.net/"
books[Bookmaker.CIRCUS] = "wss://wss01.circus.be"
books[Bookmaker.GOLDENVEGAS] = "wss://wss.goldenvegas.be"

let events = undefined

function startWebSocket(bookmaker, id) {
    const ws = new WebSocket(books[bookmaker])
    ws.on('open', function open() {
        ws.send(JSON.stringify(connectMessage(bookmaker)))
        ws.send(JSON.stringify(requestMessage(id)))
    })

    ws.on('message', function incoming(data) {
        const dataParsed = JSON.parse(data)
        if(dataParsed.MessageType === 1000) {
            events = JSON.parse(dataParsed.Message)
        }
    })
}

export async function getBetconstructEventsForCompetition(id: string) {
    startWebSocket(Bookmaker.CIRCUS, id)
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if(events) {
                // @ts-ignore
                const data = JSON.parse(events.Requests[0].Content).LeagueDataSource.LeagueItems[0].EventItems.map(event => {
                    const splitted = event.UrlBetStats.split("/")
                    const sportRadarId = splitted[splitted.length - 1]
                    const bookmakerInfos = Object.keys(books).map(key => {
                        return new BookMakerInfo(Provider.BETCONSTRUCT, key, id, event.EventId, undefined, [], undefined, undefined, undefined)
                    })
                    return new EventInfo(sportRadarId, getSportRadarEventUrl(sportRadarId), bookmakerInfos)
                })
                resolve(data)
                clearInterval(interval)
            }}, 100)
    })
}

export async function getBetconstructBetOffersForCompetition(bookmakerInfo: BookMakerInfo): Promise<BetOffer[]> {
    startWebSocket(bookmakerInfo.bookmaker, bookmakerInfo.leagueId)
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if(events) {
                // @ts-ignore
                resolve(parseBetOffers(new ApiResponse(Provider.BETCONSTRUCT, events, RequestType.BET_OFFER, bookmakerInfo.bookmaker)))
                clearInterval(interval)
            }}, 100)
    })
}

function connectMessage(bookmaker: Bookmaker) {
    return {"TTL":10,"MessageType":1,
        "Message":"{\"NodeType\":1,\"ClientInformations\":{\"RoomDomainName\":\"" + bookmaker + "\"}}"}
}

function requestMessage(league: string){
    return {"TTL":10,"MessageType":1000,"Message":"{\"Requests\":[{\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"OnlyShowcaseMarket\\\":true,\\\"IncludeSportList\\\":false,\\\"EventSkip\\\":0,\\\"EventTake\\\":20,\\\"EventType\\\":0,\\\"SportId\\\":" + "844" + ",\\\"RequestString\\\":\\\"LeagueIds=" + league + "&OnlyMarketGroup=Main\\\"}}\"}],\"Groups\":[]}"}
}

function parseBetOffers(apiResponse: ApiResponse): BetOffer[] {
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


