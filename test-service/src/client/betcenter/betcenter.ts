import {BookMakerInfo, EventInfo} from "../../service/events";
import {BetType, Bookmaker, BookmakerId, Provider} from "../../service/bookmaker";
import {RequestType} from "../../domain/betoffer";
import axios from "axios";
import {BetcenterParser, Event} from "../../service/parser";
import {ApiResponse} from "../scraper";
import {getSportRadarEventUrl} from "../sportradar/sportradar";
import {BetOffer} from "../../service/betoffers";

export function getBetcenterEventsForCompetition(id: string): Promise<EventInfo[]> {
    const betcenterHeaders = {
        headers: {
            "x-language": 2,
            "x-brand": 7,
            "x-location": 21,
            "x-client-country": 21,
            "Content-Type":"application/json"
        }
    }
    const url = 'https://oddsservice.betcenter.be/odds/getGames/8'
    const betcenterPayload = {"leagueIds": [parseInt(id)], "sportId": 1,"gameTypes":[1, 4, 5],"limit":20000,"jurisdictionId":30}
    return axios.post(url, betcenterPayload, betcenterHeaders)
        .then(response => {
            return response.data.games.map(event => {
                const sportRadarId = event.statisticsId
                const bookmakerInfo = new BookMakerInfo(Provider.CASHPOINT, Bookmaker.BETCENTER, id, event.id, url, [url],
                    betcenterHeaders, {
                    gameIds: [event.id],
                        gameTypes: [1, 4, 5],
                        jurisdictionId: 30,
                        limit: 20000,
                        leagueIds: [parseInt(id)]
                    }, "POST")
                return new EventInfo(sportRadarId, getSportRadarEventUrl(sportRadarId), [bookmakerInfo])
            })
        })
}

export function parseBetcenterBetOffers(apiResponse: ApiResponse): BetOffer[] {
    if(!apiResponse.data.games) return []
    const betOffers = []
    apiResponse.data.games.forEach(event => {
        event.markets.forEach(market => {
            const betType = determineBetType(market.id)
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

export function determineBetType(id): BetType {
    const overUnders = [22462, 22252, 22472, 22482, 22492, 22502, 22512]
    const overUnders_1H = [22342, 22352, 22362]
    const handicaps_1H = [23482, 23462]
    const handicaps = [22272, 22282, 22292, 22302, 22312, 22322]
    if(id === 22242) return BetType._1X2
    if(id === 22332) return BetType._1X2_H1
    if(id === 22522) return BetType.DOUBLE_CHANCE
    if(id === 22262) return BetType.BOTH_TEAMS_SCORE
    if(id === 23662) return BetType.OVER_UNDER_TEAM1
    if(id === 23672) return BetType.OVER_UNDER_TEAM2
    if(id === 22532) return BetType.ODD_EVEN
    if(id === 23432) return BetType.DOUBLE_CHANCE_H1
    if(overUnders.includes(id)) return BetType.OVER_UNDER
    if(handicaps.includes(id)) return BetType.HANDICAP
    if(overUnders_1H.includes(id)) return BetType.OVER_UNDER_H1
    if(handicaps_1H.includes(id)) return BetType.HANDICAP_H1
}