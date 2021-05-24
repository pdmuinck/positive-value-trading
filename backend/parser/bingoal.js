const {sortBetOffers} = require("../utils");
const {Bookmaker, BetType} = require("./bookmaker")
const {calculateMargin, BetOffer} = require("../utils")


function parseBingoalBetOffers(apiResponse) {
    const betOffers = []
    const event = apiResponse.data.box[0].match
    event.categories.forEach(category => {
        category.subbets.forEach(subbet => {
            const betType = determineBetType(subbet)
            if(betType !== BetType.UNKNOWN) {
                const margin = calculateMargin(subbet.tips.map(tip => parseFloat(tip.odd)))
                subbet.tips.forEach(tip => {
                    const option = determineBetOption(betType, tip)
                    const line = tip.sov === "" || !tip.sov ? null : tip.sov
                    betOffers.push(new BetOffer(betType, event.ID, Bookmaker.BINGOAL, option, parseFloat(tip.odd), line, margin))
                })
            }
        })
    })
    return betOffers.sort(sortBetOffers).map(betOffer => {
        betOffer.betType = betOffer.betType.name
        return betOffer
    })
}

function determineBetOption(betType, tip) {
    if(betType === BetType.ASIAN_HANDICAP || betType === BetType.DRAW_NO_BET || betType === BetType.DRAW_NO_BET-H1 || betType === BetType.DRAW_NO_BET_H2) {
        return tip.team.toString()
    }

    if(betType === BetType.OVER_UNDER) {
        if(tip.shortName.includes("O")) return "OVER"
        return "UNDER"
    }

    if(BetType === BetType.ODD_EVEN){
        if(tip.shortname === "Oneven") return "ODD"
        return "EVEN"
    }

    if(tip.shortName === "ja") return "YES"
    if(tip.shortName === "nee") return "NO"
    return tip.shortName.toUpperCase()
}

function determineBetType(subbet) {
    switch(subbet.marketID) {
        // 1X2
        case "1":
            return BetType._1X2
        case "55":
            return BetType._1X2_H1
        case "76":
            return BetType._1X2_H2

        // DOUBLE CHANCE
        case "10":
            return BetType.DOUBLE_CHANCE
        case "58":
            return BetType.DOUBLE_CHANCE_H1
        case "78":
            return BetType.DOUBLE_CHANCE_H2

        // DRAW NO BET
        case "11":
            return BetType.DRAW_NO_BET
        case "59":
            return BetType.DRAW_NO_BET_H1
        case "79":
            return BetType.DRAW_NO_BET_H2

        // ODD EVEN
        case "24":
            return BetType.ODD_EVEN
        /*
        case "68":
            return BetType.ODD_EVEN_H1
        case "86":
            return BetType.ODD_EVEN_H2

         */

        // HANDICAP
        case "14":
            return BetType.HANDICAP
        /*
        case "60":
            return BetType.HANDICAP_H1
         case "80":
            return BetType.HANDICAP_H2
         */

        // TOTAL GOALS
        case "17":
            return BetType.OVER_UNDER
        /*
        case "62":
            return BetType.OVER_UNDER_H1
        case "82":
            return BetType.OVER_UNDER_H2

         */

        // BOTH TEAMS TO SCORE
        case "27":
            return BetType.BOTH_TEAMS_SCORE
        case "69":
            return BetType.BOTH_TEAMS_SCORE_H1
        case "87":
            return BetType.BOTH_TEAMS_SCORE_H2

        // ASIAN HANDICAP
        case "16":
            return BetType.ASIAN_HANDICAP
        /*
        case "61":
            return BetType.ASIAN_HANDICAP_H1
        case "81":
            return BetType.ASIAN_HANDICAP_H2

         */

        default:
            return BetType.UNKNOWN
    }
}

exports.parseBingoalBetOffers = parseBingoalBetOffers