const {Bookmaker, BetType} = require("./bookmaker")
const {calculateMargin, BetOffer} = require("../utils")


function parseBingoalBetOffers(apiResponse) {
    const betOffers = []
    const event = apiResponse.data.box[0].match
    event.importantSubbets.forEach(subbet => {
        const betType = determineBetType(subbet)
        if(betType !== BetType.UNKNOWN) {
            const margin = calculateMargin(subbet.tips.map(tip => parseFloat(tip.odd)))
            subbet.tips.forEach(tip => {
                betOffers.push(new BetOffer(betType, event.ID, Bookmaker.BINGOAL, tip.shortName, parseFloat(tip.odd), undefined, margin))
            })
        }
    })
    return betOffers
}

function determineBetType(subbet) {
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

exports.parseBingoalBetOffers = parseBingoalBetOffers