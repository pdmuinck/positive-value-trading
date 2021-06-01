const {sortBetOffers} = require("../utils");
const {BetType, Provider} = require("./bookmaker")
const {calculateMargin, BetOffer} = require("../utils")

// entaingroup


exports.parseLadbrokesBetOffers = function parseLadbrokesBetOffers(apiResponse) {
    if(!apiResponse.data.result) return []
    const betOffers = []
    apiResponse.data.result.betGroupList.map(betGroup => betGroup.oddGroupList).flat().forEach(oddGroup => {
        const betType = determineBetOfferType(oddGroup.betId, oddGroup.oddGroupDescription)
        if(betType !== BetType.UNKNOWN) {
            const line = determineLine(betType, oddGroup)
            const margin = calculateMargin(oddGroup.oddList.map(option => option.oddValue / 100))
            oddGroup.oddList.forEach(option => {
                if(betType === BetType.DOUBLE_CHANCE && !["1X", "12", "X2"].includes(option.oddDescription)) {
                    return
                }
                const outcome = option.oddDescription.toUpperCase()
                const price = option.oddValue / 100
                betOffers.push(new BetOffer(betType, apiResponse.data.result.eventInfo.aliasUrl, Provider.LADBROKES, outcome, price, line, margin))
            })
        }
    })
    return betOffers.flat().filter(x => x).sort(sortBetOffers).map(betOffer => {
        betOffer.betType = betOffer.betType.name
        return betOffer
    })
}

function determineLine(betType, oddGroup) {
    if(betType === BetType.HANDICAP || betType === BetType.OVER_UNDER) {
        return oddGroup.oddGroupDescription ? oddGroup.oddGroupDescription.trim() : null
    } else {
        return oddGroup.additionalDescription ? oddGroup.additionalDescription.trim() : null
    }
}


function determineBetOfferType(id, oddGroupDescription) {
    switch(id){
        // 1X2
        case 24:
            return BetType._1X2
        case 363:
            return BetType._1X2_H1
        case 377:
            return BetType._1X2_H2

        case 1907:
            return BetType.OVER_UNDER

        // DOUBLE CHANCE
        case 1556:
            return BetType.DOUBLE_CHANCE
        case 1564:
            return BetType.DOUBLE_CHANCE
        case 1572:
            return BetType.DOUBLE_CHANCE

        case 53:
            return BetType.HANDICAP
        /*
        case 51:
            return BetType.CORRECT_SCORE

         */
        case 79:
            return BetType.ODD_EVEN
        case 1550:
            return BetType.BOTH_TEAMS_SCORE
        case 12344:
            if(oddGroupDescription === "1T") return BetType.BOTH_TEAMS_SCORE_H1
            return BetType.BOTH_TEAMS_SCORE_H2
        default:
            return BetType.UNKNOWN
    }
}