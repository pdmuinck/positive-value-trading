const {Bookmaker, BetType} = require("./bookmaker")
const {calculateMargin, BetOffer} = require("../utils")
const parser = require('node-html-parser')
const {sortBetOffers} = require("../utils");

exports.parseZetBetBetOffers = function parseZetBetBetOffers(apiResponse) {
    const betCategories = apiResponse.data.split("data-type").slice(1)

    return betCategories.map(betCategory => {
        const betOffers = betCategory.split("item-content").slice(1)
        const category = betCategory.split("<span>")[1]?.split("</span>")[0].replace(/(?:\r\n|\r|\n)/g, '').trim()
        return betOffers.map(betOffer => {
            const betQuestion = betOffer.split("<i class=\"uk-icon-bullseye\"></i>")[1]?.split("<")[0].trim()
            const betType = determineBetType(category, betQuestion)
            const outcomes = betOffer.split("bettingslip/bet").slice(1)

            if(betType !== BetType.UNKNOWN) {
                return outcomes.map((outcome, index) => {
                    if(outcome) {
                        const option = outcome.split("class=\"pmq-cote-acteur uk-text-truncate\"").slice(1)[0]?.split("</span>")[0].split(">")[1].replace(/(?:\r\n|\r|\n)/g, '').trim()
                        const parsedOutcome = determineOutcome(option, betType, index)
                        const line = determineLine(betType, option)
                        const price = parseFloat(outcome.split("pmq-cote")[1]?.split(">")[1]?.split("<")[0].replace(/(?:\r\n|\r|\n)/g, '').trim().replace(",", "."))
                        return new BetOffer(betType, "", Bookmaker.ZETBET, parsedOutcome, price, line, null)
                    }

                })
            }
        }).flat()
    }).flat().filter(x => x).sort(sortBetOffers).map(betOffer => {
        betOffer.betType = betOffer.betType.name
        return betOffer
    })
}

function determineLine(betType, option) {
    if(betType === BetType.OVER_UNDER) {
        if(option.includes("0.5")) return "0.5"
        if(option.includes("1.5")) return "1.5"
        if(option.includes("2.5")) return "2.5"
        if(option.includes("3.5")) return "3.5"
        if(option.includes("4.5")) return "4.5"
        if(option.includes("5.5")) return "5.5"
    }
    return null
}

function determineOutcome(outcome, betType, index) {
    if(outcome ) {
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
        if(betType === BetType.OVER_UNDER) {
            if(outcome.toUpperCase().includes("OVER")) return "OVER"
            return "UNDER"
        }
        return outcome.toUpperCase()
    }

}

function determineBetType(category, betQuestion) {
    //console.log("CAT: " + category)
    //console.log("question: " + betQuestion)
    if(category === "Both Team to Score in the 1st Half") return BetType.BOTH_TEAMS_SCORE_H1
    if(category === "Both teams to score") return BetType.BOTH_TEAMS_SCORE
    if(category === "Over Under") return BetType.OVER_UNDER


    switch(betQuestion) {
        // 1X2
        case "Who will win the match?":
            return BetType._1X2
        case "Who will win the 1st half?":
            return BetType._1X2_H1
        case "Who will win the 2nd half ?":
            return BetType._1X2_H2

        // DOUBLE CHANCE
        case "Double Chance":
            return BetType.DOUBLE_CHANCE
        case "Double Chance - 1st half":
            return BetType.DOUBLE_CHANCE_H1
        case "Double Chance - 2nd Half":
            return BetType.DOUBLE_CHANCE_H2

        //DRAW NO BET
        case "Draw no bet":
            return BetType.DRAW_NO_BET
        case "Draw no bet - 1st half":
            return BetType.DRAW_NO_BET_H1
        case "Draw no bet - 2nd Half":
            return BetType.DRAW_NO_BET_H2

        // ODD EVEN
        case "Number of goals, odd or even?":
            return BetType.ODD_EVEN
        /*
        case "Number of goals in first half odd or even ?":
            return BetType.ODD_EVEN_H1
        case "Number of goals in 2nd half, odd or even ?":
            return BetType.ODD_EVEN_H2

         */

        // HANDICAP
        case "Handicap (0:1) - To win the match":
            return BetType.HANDICAP
        case "Handicap (0:2) - To win the match":
            return BetType.HANDICAP
        case "Handicap (0:3) - To win the match":
            return BetType.HANDICAP
        case "Handicap (0:4) - To win the match":
            return BetType.HANDICAP
        case "Handicap (1:0) - To win the match":
            return BetType.HANDICAP
        case "Handicap (2:0) - To win the match":
            return BetType.HANDICAP
        case "Handicap (3:0) - To win the match":
            return BetType.HANDICAP
        case "Handicap (4:0) - To win the match":
            return BetType.HANDICAP


        case "Both teams to score":
            return BetType.BOTH_TEAMS_SCORE
        case "Both Team to Score in the 1st Half":
            return BetType.BOTH_TEAMS_SCORE_H1
        case "Both teams to score in 2nd half?":
            return BetType.BOTH_TEAMS_SCORE_H2


        default:
            return BetType.UNKNOWN
    }

}