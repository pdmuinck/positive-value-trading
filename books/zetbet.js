const {Bookmaker, Provider, BookmakerInfo, BetType} = require("./bookmaker")
const {Event} = require("../event-mapper/event")
const {BetOffer} = require("../event-mapper/utils")
const {getSportRadarEventUrl} = require("./sportradar")
const axios = require("axios")
const {calculateMargin} = require("../event-mapper/utils")
const parser = require('node-html-parser')

exports.parseZetBetBetOffers = function parseZetBetBetOffers(apiResponse) {
    const root = parser.parse(apiResponse.data)
    const eventId = ""
    const marketNodes = root.querySelectorAll(".item-content  ")
    const betOffers = {}
    let currentMarket
    for (let i = 0; i < marketNodes.length; i++) {
        const element = marketNodes[i]
        if (element.rawAttrs === 'class="uk-icon-bullseye"') {
            currentMarket = element.parentNode.childNodes[1].rawText.split("\n")[1].trim()
        } else {
            if (!betOffers[currentMarket]) {
                betOffers[currentMarket] = {elements: [element]}
            }
            else {
                const elements = betOffers[currentMarket].elements
                elements.push(element)
                betOffers[currentMarket] = {elements: elements}
            }
        }
    }
    return Object.keys(betOffers).map(key => {
        const prices = betOffers[key].elements
        const betLine = determineLine(key)
        if(betLine.betType !== BetType.UNKNOWN) {
            const margin = calculateMargin(prices.map(price => price.querySelectorAll(".pmq-cote").map(element => parseFloat(element.childNodes[0].rawText.split("\n")[1].trim().replace(",", ".")))[0]))
            return prices.map((price, index) => {
                let outcome = price.querySelectorAll(".pmq-cote-acteur").flat().map(element => element.childNodes[0].rawText.split("\n")[1].trim())[0]
                outcome = determineOutcome(outcome, betLine.betType, index)
                const odd = price.querySelectorAll(".pmq-cote").map(element => parseFloat(element.childNodes[0].rawText.split("\n")[1].trim().replace(",", ".")))[0]
                return new BetOffer(betLine.betType, eventId, Bookmaker.ZETBET, outcome ? outcome.toUpperCase(): outcome, odd, betLine.line ? betLine.line : undefined, margin)
            }).flat()
        }
    }).flat().filter(x => x)
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
    return outcome
}

function determineLine(betType) {
    if(betType.includes("Over / Under") && betType.includes("goals")) {
        const line = parseFloat(betType.split("Over / Under ")[1].split("goals")[0].trim())
        if(betType.includes("1st half")) return {betType: BetType.OVER_UNDER_H1, line: line}
        if(betType.includes("2nd half")) return {betType: BetType.OVER_UNDER_H2, line: line}
        return {betType: BetType.OVER_UNDER, line: line}
    }
    if(betType.includes("Over Under") && betType.includes("goals")) {
        const line = parseFloat(betType.split("Over Under ")[1].split("goals")[0].trim())
        if(betType.includes("1st half")) return {betType: BetType.OVER_UNDER_H1, line: line}
        if(betType.includes("2nd half")) return {betType: BetType.OVER_UNDER_H2, line: line}
        return {betType: BetType.OVER_UNDER, line: line}
    }

    if(betType.toUpperCase().includes("TOTAL GOALS")) {
        const upper = betType.toUpperCase()
        const splitted = upper.split("TOTAL GOALS")
        if(splitted.length > 1) {
            return {betType: BetType.TOTAL_GOALS_TEAM1}
        } else {
            return {betType: BetType.TOTAL_GOALS}
        }
    }

    if(betType.includes("odd or even")) {
        if(betType.includes("total goals")) {
            return {betType: BetType.ODD_EVEN_TEAM1}
        }
    }

    switch(betType.trim()) {
        case "Who will win the match?":
            return {betType: BetType._1X2}
        case "Double Chance":
            return {betType: BetType.DOUBLE_CHANCE}
        case "Correct Score":
            return {betType: BetType.CORRECT_SCORE}
        case "Total goals":
            return {betType: BetType.TOTAL_GOALS}
        case "Half-Time Correct score":
            return {betType: BetType.CORRECT_SCORE_H1}
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
        default:
            return new BetLine(BetType.UNKNOWN)
    }
}