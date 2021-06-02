const {sortBetOffers} = require("../utils");
const {Bookmaker, BetType} = require("./bookmaker")
const {calculateMargin, BetOffer} = require("../utils")


exports.parsePinnacleBetOffers = function parsePinnacleBetOffers(markets, betOffers) {
    let parsedBetOffers = []
    markets.forEach(market => {
        const marketOffers = betOffers.filter(offer => offer.matchupId === market.id).flat()
        marketOffers.forEach(offer => {
            const betType = determineBetType(offer.key, market)
            if(betType !== BetType.UNKNOWN) {
                const margin = calculateMargin(offer.prices.map(price => toDecimalOdds(price.price)))
                offer.prices.forEach(price => {
                    const outcome = determineOutcome(price.designation, market, price.participantId, betType)
                    const line = determineLine(betType, market, price.points)
                    const odds = toDecimalOdds(price.price)
                    if(betType === BetType.OVER_UNDER && !line) return
                    parsedBetOffers.push(new BetOffer(betType, market.parent ? market.parent.id : market.id, Bookmaker.PINNACLE, outcome, odds, line, margin))
                })
            }
        })
    })
    return parsedBetOffers.flat().filter(x => x).sort(sortBetOffers).map(betOffer => {
        betOffer.betType = betOffer.betType.name
        return betOffer
    })
}

function determineBetType(key, market) {
    const splitted = key.split(";")
    const period = splitted[1]
    const type = splitted[2]
    if(!market.parent) {
        // primary markets
        if(type === "m") {
            if(period === "0") return BetType._1X2
            if(period === "1") return BetType._1X2_H1
        }
        if(type === "tt"){
            /*
            if(splitted[4] === "home") {
                if(period === "0") return BetType.OVER_UNDER_TEAM1
                if(period === "1") return BetType.OVER_UNDER_TEAM1_H1
            }
            if(splitted[4] === "away") {
                if(period === "0") return BetType.OVER_UNDER_TEAM2
                if(period === "1") return BetType.OVER_UNDER_TEAM2_H1
            }

             */
        }
        /*
        if(type === "s") {
            if(period === "0") return BetType.ASIAN_HANDICAP
            if(period === "1") return BetType.ASIAN_HANDICAP_H1
        }

         */

        if(type === "ou") {
            if(period === "0") return BetType.OVER_UNDER
            // if(period === "1") return BetType.OVER_UNDER_H1
        }
    } else if(market.type === "special") {
        if(market.special.description.includes("3-way Handicap")) return BetType.HANDICAP

        // specials
        switch(market.special.description) {
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
            /*
            case "Exact Total Goals":
                return BetType.EXACT_GOALS

             */
            case "Draw No Bet":
                return BetType.DRAW_NO_BET
            case "Total Goals Odd/Even":
                return BetType.ODD_EVEN
            /*
            case "Correct Score":
                return BetType.CORRECT_SCORE

             */

        }

        /*
        if(marketId.special.description === awayTeam + " Goals Odd/Even") return BetType.ODD_EVEN_TEAM2
        if(marketId.special.description === homeTeam + " Goals Odd/Even") return BetType.ODD_EVEN_TEAM1
        if(marketId.special.description === homeTeam + " Goals 1st Half") return BetType.TOTAL_GOALS_TEAM1_H1
        if(marketId.special.description === awayTeam + " Goals 1st Half") return BetType.TOTAL_GOALS_TEAM2_H1
        if(marketId.special.description === homeTeam + " Goals") return BetType.TOTAL_GOALS_TEAM1
        if(marketId.special.description === awayTeam + " Goals") return BetType.TOTAL_GOALS_TEAM2

         */

    }
    /*
    if(key.includes('s;0;ou')) return BetType.ASIAN_OVER_UNDER
    if(key.includes("s;0;s")) return BetType.ASIAN_HANDICAP

     */
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

function determineLine(betType, market, points) {
    if(betType === BetType.HANDICAP) {
        if(market.special.description.includes("-5")) return "0:5"
        if(market.special.description.includes("-4")) return "0:4"
        if(market.special.description.includes("-3")) return "0:3"
        if(market.special.description.includes("-2")) return "0:2"
        if(market.special.description.includes("-1")) return "0:1"
        if(market.special.description.includes("+5")) return "5:0"
        if(market.special.description.includes("+4")) return "4:0"
        if(market.special.description.includes("+3")) return "3:0"
        if(market.special.description.includes("+2")) return "2:0"
        if(market.special.description.includes("+1")) return "1:0"
    }
    if(betType === BetType.OVER_UNDER) {
        if(points === 0.5) return "0.5"
        if(points === 1.5) return "1.5"
        if(points === 2.5) return "2.5"
        if(points === 3.5) return "3.5"
        if(points === 4.5) return "4.5"
        if(points === 5.5) return "5.5"
        return null
    }

    return points ? points : null

}

function determineOutcome(outcome, market, participantId, betType) {
    const homeTeam = market.parent ? market.parent.participants.filter(p => p.alignment === "home").map(p => p.name)[0].toUpperCase() : null
    const awayTeam = market.parent ? market.parent.participants.filter(p => p.alignment === "away").map(p => p.name)[0].toUpperCase() : null
    if(betType === BetType.CORRECT_SCORE || betType === BetType.CORRECT_SCORE_H1) {
        return market.participants.filter(participant => participant.id === participantId)[0].name.split(",").map(o => o.split(" ")).map(test => test[test.length - 1]).join("-")
    }

    if(!market.parent) {
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
        let outcome = market.participants.filter(participant => participant.id === participantId)[0].name.toUpperCase()
        if(betType === BetType.DOUBLE_CHANCE || betType === BetType.DOUBLE_CHANCE_H1) {
            if(outcome.includes("OR DRAW")) return "1X"
            if(outcome.includes("DRAW OR")) return "X2"
            return "12"
        }
        if(betType === BetType.DRAW_NO_BET || betType === BetType.DRAW_NO_BET_H1) {
            if(outcome === homeTeam) return "1"
            return "2"
        }
        if(betType === BetType.HANDICAP) {
            if(outcome.includes("DRAW")) return "X"
            if(outcome.includes(homeTeam)) return "1"
            return "2"
        }
        return outcome

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