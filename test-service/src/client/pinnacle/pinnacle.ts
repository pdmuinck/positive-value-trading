import {BookMakerInfo, EventInfo} from "../../service/events";
import axios from "axios";
import {pinnacle_sportradar} from "./participants";
import {BetType, Bookmaker, BookmakerId, Provider} from "../../service/bookmaker";
import {ApiResponse} from "../scraper";
import {IdType, Participant} from "../../domain/betoffer";
import {Event} from "../../service/parser";
import {BetOffer} from "../../service/betoffers";
import {kambiBetOfferTypes, kambiPrices} from "../kambi/kambi";

export async function getPinnacleEventsForCompetition(id: string, sportRadarMatches): Promise<EventInfo[]> {
    const requestConfig = {
        headers: {
            "X-API-Key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
            "Referer": "https://www.pinnacle.com/",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }
    const leagueUrl = "https://guest.api.arcadia.pinnacle.com/0.1/leagues/" + id + "/matchups"
    return axios.get(leagueUrl, requestConfig).then(response => {
        return response.data.filter(event => !event.parent).map(event => {
            const match = sportRadarMatches.filter(match => match && match.participants[0] === pinnacle_sportradar[event.participants[0].name] &&
                match.participants[1] === pinnacle_sportradar[event.participants[1].name])[0]
            if(match) {
                const bookmakerInfo = new BookMakerInfo(Provider.PINNACLE, Bookmaker.PINNACLE, id, event.id,
                    leagueUrl, ["https://guest.api.arcadia.pinnacle.com/0.1/matchups/" + event.id + "/related",
                        "https://guest.api.arcadia.pinnacle.com/0.1/matchups/" + event.id + "/markets/related/straight"],
                    requestConfig, undefined, "GET")
                return new EventInfo(match.sportRadarId, match.sportRadarEventUrl, [bookmakerInfo])
            }
        })
    })
}

export function parsePinnacleBetOffers(apiResponse: ApiResponse) {
    let betOffers = []
    for(let i = 0; i < apiResponse.data.length; i +=2) {
        const test = parseBetOffers(apiResponse.data[i], apiResponse.data[i+1])
        betOffers = betOffers.concat(test)
    }
    return betOffers
}

function parseBetOffers(marketIds, offers): BetOffer[] {
    const betOffers = []
    marketIds.forEach(marketId => {
        const marketOffers = offers.filter(offer => offer.matchupId === marketId.id).flat()
        marketOffers.forEach(offer => {
            const betType = determineBetType(offer.key, marketId)
            if(betType !== BetType.UNKNOWN) {
                offer.prices.forEach(price => {
                    const outcome = determineOutcome(price.designation, marketId, price.participantId)
                    const line = price.points ? price.points : undefined
                    const odds = toDecimalOdds(price.price)
                    betOffers.push(new BetOffer(betType, marketId.parent ? marketId.parent.id : marketId.id, Bookmaker.PINNACLE, outcome, odds, line))
                })
            }
        })
    })
    return betOffers
}

function determineBetType(key, marketId): BetType {
    const splitted = key.split(";")
    const period = splitted[1]
    const type = splitted[2]
    if(!marketId.parent) {
        // primary markets
        if(type === "m") {
            if(period === "0") return BetType._1X2
            if(period === "1") return BetType._1X2_H1
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
                return BetType.DOUBLE_CHANCE_H1
            case "Double Chance":
                return BetType.DOUBLE_CHANCE
            case "Total Goals Odd/Even 1st Half":
                return BetType.ODD_EVEN_H1
            case "Both Teams To Score":
                return BetType.BOTH_TEAMS_SCORE
            case "Draw No Bet 1st Half":
                return BetType.DRAW_NO_BET_H1
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

function toDecimalOdds(americanOdds): number {

    if(americanOdds < 0) {
        return parseFloat(((100 / Math.abs(americanOdds)) + 1).toFixed(2))
    } else {
        return parseFloat(((americanOdds / 100) + 1).toFixed(2))
    }

}

function determineOutcome(outcome: string, marketId, participantId) {
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

function calculateVigFreePrices(prices, marketId) {
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