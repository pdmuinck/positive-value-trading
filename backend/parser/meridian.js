const {sortBetOffers} = require("../utils");
const {Provider} = require("./bookmaker");
const {BetType} = require("./bookmaker")
const {calculateMargin, BetOffer} = require("../utils")


exports.parserMeridianBetOffers = function parserMeridianBetOffers(apiResponse) {
    if(!apiResponse.data.market) return []
    const betOffers = []
    apiResponse.data.market.forEach(betOffer => {
        const betType = determineBetType(betOffer.templateId)
        if(betType !== BetType.UNKNOWN) {
            const line = determineLine(betType, betOffer)
            const margin = calculateMargin(betOffer.selection.map(option => option.price))
            betOffer.selection.forEach(option => {
                const price = parseFloat(option.price)
                const outcome = determineOutcome(option)
                betOffers.push(new BetOffer(betType, apiResponse.data.id, Provider.MERIDIAN, outcome, price, line, margin))
            })
        }
    })
    return betOffers.flat().filter(x => x).sort(sortBetOffers).map(betOffer => {
        betOffer.betType = betOffer.betType.name
        return betOffer
    })
}

function determineLine(betType, betOffer) {
    if(betType === BetType.OVER_UNDER) {
        return betOffer.overUnder
    }
    if(betType === BetType.HANDICAP) {
        if(betOffer.handicap === "-1.0") return "0:1"
        if(betOffer.handicap === "-2.0") return "0:2"
        if(betOffer.handicap === "-3.0") return "0:3"
        if(betOffer.handicap === "1.0") return "1:0"
        if(betOffer.handicap === "1.0") return "2:0"
        if(betOffer.handicap === "1.0") return "3:0"
    }
    return null
}

function determineOutcome(option) {
    if(option.name === "[[Rival1]]") return "1"
    if(option.name === "[[Rival2]]") return "2"
    if(option.name === "draw") return "X"
    if(option.name.toUpperCase() === "[[DRAW]]") return "X"
    if(option.name.toUpperCase() === "[[UNDER]]") return "UNDER"
    if(option.name.toUpperCase() === "[[OVER]]") return "OVER"
    if(option.name.toUpperCase() === "I NG") return "NO"
    if(option.name.toUpperCase() === "I GG") return "YES"
    if(option.name.toUpperCase() === "II NG") return "NO"
    if(option.name.toUpperCase() === "II GG") return "YES"
    if(option.name.toUpperCase() === "I X2") return "X2"
    if(option.name.toUpperCase().toUpperCase() === "I 12") return "12"
    if(option.name.toUpperCase() === "I 1X") return "1X"
    if(option.name.toUpperCase() === "II X2") return "X2"
    if(option.name.toUpperCase() === "II 12") return "12"
    if(option.name.toUpperCase() === "II 1X") return "1X"
    if(option.name.toUpperCase() === "NG") return "NO"
    if(option.name.toUpperCase() === "GG") return "YES"
    return option.name.toUpperCase()
}

function determineBetType(id) {
    switch(id){
        case '3999':
            return BetType._1X2
        case "4017":
            return BetType._1X2_H1
        case "4042":
            return BetType._1X2_H2

        case '4004':
            return BetType.OVER_UNDER

        // DOUBLE CHANCE
        case '4008':
            return BetType.DOUBLE_CHANCE
        case "4022":
            return BetType.DOUBLE_CHANCE_H1
        case "4046":
            return BetType.DOUBLE_CHANCE_H2

        // BOTH TEAMS TO SCORE
        case '4007':
            return BetType.BOTH_TEAMS_SCORE
        case "4021":
            return BetType.BOTH_TEAMS_SCORE_H1
        case "4045":
            return BetType.BOTH_TEAMS_SCORE_H2

        case "4117":
            return BetType.DRAW_NO_BET
        case "4040":
            return BetType.DRAW_NO_BET_H1
        case "4059":
            return BetType.DRAW_NO_BET_H2


        case "4118":
            return BetType.ODD_EVEN
        /*
        case "4637":
            return BetType.HALF_TIME_FULL_TIME
        case "4653":
            return BetType.OVER_UNDER_TEAM1
        case "4656":
            return BetType.OVER_UNDER_TEAM2
        case "4654":
            return BetType.OVER_UNDER_TEAM1_H1
        case "4657":
            return BetType.OVER_UNDER_TEAM2_H1
        case "4655":
            return BetType.OVER_UNDER_TEAM1_H2
        case "4658":
            return BetType.OVER_UNDER_TEAM2_H2

         */
        case "4098":
            return BetType.HANDICAP/*
        case "4097":
            return BetType.ASIAN_HANDICAP
        case "4016":
            return BetType.EXACT_GOALS
        case "4010":
            return BetType.ODD_EVEN_TEAM1
        case "4012":
            return BetType.ODD_EVEN_TEAM2
        case "4072":
            return BetType.HALF_TIME_FULL_TIME
            */


/*
        case "4018":
            return BetType.OVER_UNDER_H1
        case "4041":
            return BetType.ODD_EVEN_H1



        case "4038":
            return BetType.CORRECT_SCORE_H1

        case "4043":
            return BetType.OVER_UNDER_H2
        case "4051":
            return BetType.EXACT_GOALS_H2
        case "4060":
            return BetType.ODD_EVEN_H2

        case "4058":
            return BetType.CORRECT_SCORE_H2
        case "4036":
            return BetType.HANDICAP_H1
        case "4056":
            return BetType.HANDICAP_H2

 */
        default:
            return BetType.UNKNOWN
    }
}