const {Bookmaker, BetType} = require("./bookmaker")
const {calculateMargin, BetOffer} = require("../utils")


exports.parseStanleybetBetOffers = function parseStanleybetBetOffers(apiResponse) {
    const eventId = apiResponse.data.split("avv:")[1].split(',')[0].toString()
    const betOffers = apiResponse.data.split("ScommessaDTO").slice(1)
    return betOffers.map(betOffer => {
        const betType = determineBetType(betOffer.split('"id_scom":')[1].split(",")[0])
        let line = parseInt(betOffer.split("handicap:")[1].split(",")[0])/100
        if(line === 0) line = undefined
        if(betType !== BetType.UNKNOWN) {
            const selections = betOffer.split("EsitoDTO").slice(1)
            const margin = calculateMargin(selections.map(selection => parseInt(selection.split("quota:")[1])/100))
            return selections.map(selection => {
                const outcome = determineOutcome(selection.split('"desc_esito":"')[1].split('","')[0])
                const price = parseInt(selection.split("quota:")[1])/100
                return new BetOffer(betType, eventId, Bookmaker.STANLEYBET, outcome, price, line, margin)
            })
        }

    }).flat().filter(x => x)
}

function determineOutcome(outcome) {
    switch(outcome) {
        case "GOAL":
            return "YES"
        case "NO GOAL":
            return "NO"
        case "ONEVEN":
            return "ODD"
        case "JA":
            return "YES"
        case "NEE":
            return "NO"
        default:
            return outcome.toUpperCase()
    }
}

function determineBetType(id) {
    switch(id) {
        case "5":
            return BetType._1X2
        case "-8000":
            return BetType.DOUBLE_CHANCE
        case "7554":
            return BetType.DOUBLE_CHANCE_H2
        case "7557":
            return BetType.DOUBLE_CHANCE_H1
        case "20":
            return BetType.BOTH_TEAMS_SCORE
        case "9":
            return BetType.CORRECT_SCORE
        case "16":
            return BetType._1X2_H1
        case "21":
            return BetType.ODD_EVEN
        case "122":
            return BetType._1X2_H2
        case "409":
            return BetType.CORRECT_SCORE_H1
        case "548":
            return BetType.CORRECT_SCORE_H2
        case "549":
            return BetType.ODD_EVEN_TEAM1
        case "550":
            return BetType.ODD_EVEN_TEAM2
        case "556":
            return BetType.OVER_UNDER_TEAM1
        case "557":
            return BetType.OVER_UNDER_TEAM2
        case "1843":
            return BetType.HANDICAP
        case "1844":
            return BetType.HANDICAP
        case "1845":
            return BetType.HANDICAP
        case "1846":
            return BetType.HANDICAP
        case "4168":
            return BetType.HANDICAP_H2
        case "5193":
            return BetType.OVER_UNDER_TEAM1
        case "5196":
            return BetType.OVER_UNDER_TEAM1
        case "5274":
            return BetType.OVER_UNDER_TEAM1
        case "5305":
            return BetType.OVER_UNDER_TEAM2
        case "5876":
            return BetType.OVER_UNDER_TEAM2
        case "6218":
            return BetType.OVER_UNDER_TEAM2
        case "12640":
            return BetType.OVER_UNDER
        case "12636":
            return BetType.OVER_UNDER
        case "12626":
            return BetType.OVER_UNDER
        case "12193":
            return BetType.OVER_UNDER
        case "12207":
            return BetType.OVER_UNDER
        default:
            return BetType.UNKNOWN
    }
}