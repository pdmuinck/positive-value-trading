const {Bookmaker, BetType} = require("./bookmaker")
const {calculateMargin, BetOffer} = require("../utils")
const parser = require('node-html-parser')
const {sortBetOffers} = require("../utils");

exports.parseZetBetBetOffers = function parseZetBetBetOffers(apiResponse) {
    const betOffers = apiResponse.data.split("data-type=").slice(1)

    return betOffers.map(betOffer => {
        const dataType = console.log(betOffer.slice(0, 3).replaceAll('"', ''))
        const betType = determineLine(dataType)
        const outcomes = betOffer.split("bet-actorodd3").slice(1)
        if(betType.betType !== BetType.UNKNOWN) {
            outcomes.map((outcome, index) => {
                const parsedOutcome = determineOutcome(outcome.split("class=\"pmq-cote-acteur uk-text-truncate\"").slice(1)[0].split("</span>")[0].split(">")[1].replace(/(?:\r\n|\r|\n)/g, '').trim(), betType, index)
                const price = parseFloat(outcome.split("class=\"pmq-cote-acteur uk-text-truncate\"")[0].split(">")[1].split("</span")[0].replace(/(?:\r\n|\r|\n)/g, '').trim().replace(",", "."))
                const test = new BetOffer(betType.betType, "", Bookmaker.ZETBET, parsedOutcome, price, betType.line, undefined)
                //console.log(test)
            })
        }
    }).flat().filter(x => x).sort(sortBetOffers).map(betOffer => {
        betOffer.betType = betOffer.betType.name
        return betOffer
    })
}

function determineOutcome(outcome, betType, index) {
    if(betType === BetType._1X2_H2 || betType === BetType._1X2_H1 || betType === BetType._1X2 || betType === BetType.HANDICAP
        || betType === BetType.HANDICAP_H1 || betType === BetType.HANDICAP_H2) {
        if(index === 0) return "1"
        if(index === 1) return "X"
        if(index === 2) return "2"
    }
    if(betType === BetType.DRAW_NO_BET || betType === BetType.DRAW_NO_BET_H1 || betType === BetType.DRAW_NO_BET_H2
        || betType === BetType.ASIAN_HANDICAP || betType === BetType.ASIAN_HANDICAP_H1 || betType === BetType.ASIAN_HANDICAP_H2) {
        if(index === 0) return "1"
        if(index === 1) return "2"
    }
    return outcome.toUpperCase()
}

function determineBetType(dataType) {
    switch(dataType) {
        case "1":
            return BetType._1X2
        case "18":
            return BetType._1X2_H1

        case "10":
            return BetType.DOUBLE_CHANCE
        case "121":
            return BetType.DOUBLE_CHANCE_H1
        case "9":
            return BetType.OVER_UNDER
        case "24":
            return BetType.BOTH_TEAMS_SCORE
        case "95":
            return BetType.BOTH_TEAMS_SCORE_H2
    }
}

function determineLine(betType) {

    console.log(betType)

    switch(betType) {
        case "1":
            return {betType: BetType._1X2}

        case "10":
            return {betType: BetType.DOUBLE_CHANCE}
        case "121":
            return {betType: Bet}
        case "9":
            return {betType: BetType.OVER_UNDER}
        case "24":
            return {betType: BetType.}
            /*
        case "Correct Score":
            return {betType: BetType.CORRECT_SCORE}
        case "Total goals":
            return {betType: BetType.TOTAL_GOALS}
        case "Half-Time Correct score":
            return {betType: BetType.CORRECT_SCORE_H1}

             */
            /*
        case "Both teams to score in 2nd half?":
            return {betType: BetType.BOTH_TEAMS_SCORE_H2}
        case "Who will win the 1st half?":
            return {betType: BetType._1X2_H1}
        case "Who will win the 2nd half ?":
            return {betType: BetType._1X2_H1}
        case "Double Chance - 1st half":
            return {betType: BetType.DOUBLE_CHANCE_H1}
        case "Double Chance - 2nd Half":
            return {betType: BetType.DOUBLE_CHANCE_H2}
        case "Draw no bet":
            return {betType: BetType.DRAW_NO_BET}
        case "Handicap (-0.5) - To win the match":
            return {betType: BetType.ASIAN_HANDICAP, line: "0.5"}
        case "Handicap (-1.5) - To win the match":
            return {betType: BetType.ASIAN_HANDICAP, line: "1.5"}
        case "2nd Half correct score":
            return {betType: BetType.CORRECT_SCORE_H2}
        case "Number of goals, odd or even?":
            return {betType: BetType.ODD_EVEN}
        case "Number of goals in first half odd or even ?":
            return {betType: BetType.ODD_EVEN_H1}
        case "Number of goals in 2nd half, odd or even ?":
            return {betType: BetType.ODD_EVEN_H2}
        case "Handicap (0:1) - To win the 1st half":
            return {betType: BetType.HANDICAP_H1, line: "1"}
        case "Handicap (-0.5) - To win the 1st half":
            return {betType: BetType.HANDICAP_H1, line: "0.5"}
        case "Handicap (0:1) - To win the match":
            return {betType: BetType.HANDICAP, line: "1"}
        case "Handicap (0:2) - To win the match":
            return {betType: BetType.HANDICAP, line: "2"}
        case "Handicap (1:0) - To win the match":
            return {betType: BetType.HANDICAP, line: "1"}
        case "Handicap (2:0) - To win the match":
            return {betType: BetType.HANDICAP, line: "2"}
        case "Draw no bet - 1st half":
            return {betType: BetType.DRAW_NO_BET_H1}
        case "Draw no bet - 2nd Half":
            return {betType: BetType.DRAW_NO_BET_H2}
        case "Handicap (0:1) - To win the 2nd half":
            return {betType: BetType.HANDICAP_H2}
        case "Handicap (-0.5)  - To win the 2nd half":
            return {betType: BetType.HANDICAP_H2}

             */
        default:
            return {betType: BetType.UNKNOWN}
    }
}