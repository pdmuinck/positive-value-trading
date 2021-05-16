const {Bookmaker, Provider, BookmakerInfo, BetType} = require("./bookmaker")
const {Event} = require("../event-mapper/event")
const {BetOffer} = require("../utils/utils");
const axios = require("axios")
const {calculateMargin} = require("../utils/utils")

exports.getPinnacleEventsForCompetition = async function getPinnacleEventsForCompetition(id, sportRadarMatches) {
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
                const bookmakerInfo = new BookmakerInfo(Provider.PINNACLE, Bookmaker.PINNACLE, id, event.id,
                    leagueUrl, ["https://guest.api.arcadia.pinnacle.com/0.1/matchups/" + event.id + "/related",
                        "https://guest.api.arcadia.pinnacle.com/0.1/matchups/" + event.id + "/markets/related/straight"],
                    requestConfig, undefined, "GET")
                return new Event(match.sportRadarId, match.sportRadarEventUrl, [bookmakerInfo])
            }
        })
    })
}

exports.parsePinnacleBetOffers = function parsePinnacleBetOffers(apiResponse) {
    let betOffers = []
    for(let i = 0; i < apiResponse.data.length; i +=2) {
        const test = parseBetOffers(apiResponse.data[i], apiResponse.data[i+1])
        betOffers = betOffers.concat(test)
    }
    return betOffers
}

function parseBetOffers(marketIds, offers) {
    const betOffers = []
    marketIds.forEach(marketId => {
        const marketOffers = offers.filter(offer => offer.matchupId === marketId.id).flat()
        marketOffers.forEach(offer => {
            const betType = determineBetType(offer.key, marketId)
            if(betType !== BetType.UNKNOWN) {
                const margin = calculateMargin(offer.prices.map(price => toDecimalOdds(price.price)))
                offer.prices.forEach(price => {
                    const outcome = determineOutcome(price.designation, marketId, price.participantId, betType)
                    const line = price.points ? price.points : undefined
                    const odds = toDecimalOdds(price.price)

                    betOffers.push(new BetOffer(betType, marketId.parent ? marketId.parent.id : marketId.id, Bookmaker.PINNACLE, outcome, odds, line, margin))
                })
            }
        })
    })
    return betOffers
}

function determineBetType(key, marketId) {
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
            if(period === "0") return BetType.OVER_UNDER
            if(period === "1") return BetType.OVER_UNDER_H1
        }
    } else if(marketId.type === "special") {
        const homeTeam = marketId.parent.participants.filter(p => p.alignment === "home").map(p => p.name)[0]
        const awayTeam = marketId.parent.participants.filter(p => p.alignment === "away").map(p => p.name)[0]
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
            case "Both Teams To Score 1st Half":
                return BetType.BOTH_TEAMS_SCORE_H1
            case "Draw No Bet 1st Half":
                return BetType.DRAW_NO_BET_H1
            case "Exact Total Goals":
                return BetType.EXACT_GOALS
            case "Draw No Bet":
                return BetType.DRAW_NO_BET
            case "Total Goals Odd/Even":
                return BetType.ODD_EVEN
            case "Total Goals Odd/Even 1st Half":
                return BetType.ODD_EVEN_H1
            case "Correct Score":
                return BetType.CORRECT_SCORE

        }

        if(marketId.special.description === awayTeam + " Goals Odd/Even") return BetType.ODD_EVEN_TEAM2
        if(marketId.special.description === homeTeam + " Goals Odd/Even") return BetType.ODD_EVEN_TEAM1
        if(marketId.special.description === homeTeam + " Goals 1st Half") return BetType.TOTAL_GOALS_TEAM1_H1
        if(marketId.special.description === awayTeam + " Goals 1st Half") return BetType.TOTAL_GOALS_TEAM2_H1
        if(marketId.special.description === homeTeam + " Goals") return BetType.TOTAL_GOALS_TEAM1
        if(marketId.special.description === awayTeam + " Goals") return BetType.TOTAL_GOALS_TEAM2

    }

    if(splitted)
        if(key === 's;0;m') return BetType._1X2
    if(key.includes('s;0;ou')) return BetType.ASIAN_OVER_UNDER
    if(key.includes("s;0;s")) return BetType.ASIAN_HANDICAP
    if(key.includes(""))
        return BetType.UNKNOWN
}

function toDecimalOdds(americanOdds) {

    if(americanOdds < 0) {
        return parseFloat(((100 / Math.abs(americanOdds)) + 1).toFixed(2))
    } else {
        return parseFloat(((americanOdds / 100) + 1).toFixed(2))
    }

}

function determineOutcome(outcome, marketId, participantId, betType) {
    if(betType === BetType.CORRECT_SCORE || betType === BetType.CORRECT_SCORE_H1) {
        return marketId.participants.filter(participant => participant.id === participantId)[0].name.split(",").map(o => o.split(" ")).map(test => test[test.length - 1]).join("-")
    }
    if(!marketId.parent) {
        switch(outcome.toUpperCase()) {
            case 'HOME':
                return '1'
            case 'AWAY':
                return '2'
            case 'DRAW':
                return 'X'
            default:
                return outcome.toUpperCase()
        }
    } else {
        return marketId.participants.filter(participant => participant.id === participantId)[0].name.toUpperCase()
    }

}

const pinnacle_sportradar = {
    "Sint Truiden": 4958,
    "Standard Liege": 4954,
    "KFCO Beerschot-Wilrijk": 10547664,
    "KV Kortrijk": 923904,
    "KV Mechelen": 4682,
    "Oud-Heverlee Leuven": 5583073,
    "Waasland-Beveren": 5583071,
    "Charleroi": 4672,
    "Eupen": 5325576,
    "Oostende": 357080,
    "Cercle Brugge": 230652,
    "Club Brugge": 5289,
    "Mouscron Peruwelz": 6542681,
    "Royal Antwerp": 5291,
    "Genk": 4675,
    "SV Zulte-Waregem": 548844,
    "Gent": 4677,
    "Anderlecht": 4671
}

exports.pinnacle_sportradar = pinnacle_sportradar