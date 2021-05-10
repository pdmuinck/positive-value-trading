const {Bookmaker, Provider, BookmakerInfo, BetType} = require("../bookmaker")
const {Event} = require("../event")
const {BetOffer} = require("../betoffer")
const {getSportRadarEventUrl} = require("./sportradar")
const axios = require("axios")
const {calculateMargin} = require("../utils/utils")


exports.getScoooreEventsForCompetition = async function getScoooreEventsForCompetition(id){
    const leagueUrl = "https://www.e-lotto.be/cache/evenueMarketGroupLimited/NL/" + id + ".1-0.json"
    return axios.get(leagueUrl)
        .then(response => {
            return response.data.markets.map(event => {
                const eventId = event.idfoevent.toString()
                const eventUrl = "https://www.e-lotto.be/cache/evenueEventMarketGroupWithMarketsSB/NL/420/" + eventId + ".json"
                const sportRadarId = event.extevents[0].idefevent.split('_')[1]
                const bookmakerInfo = new BookmakerInfo(Provider.SCOOORE, Bookmaker.SCOOORE, id, eventId, leagueUrl,
                    [eventUrl], undefined, undefined, "GET")
                return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), [bookmakerInfo])
            })
        }).catch(error => console.log(error))
}

exports.parseScoooreBetOffers = function parseScoooreBetOffers(apiResponse) {
    if(!apiResponse.data.eventmarketgroups) return []
    return apiResponse.data.eventmarketgroups.map(marketGroup => marketGroup.fullmarkets).flat().map(betOffer => {
        const betType = determineBetType(betOffer.markettypename)
        if(betType !== BetType.UNKNOWN) {
            const margin = calculateMargin(betOffer.selections.map(selection => selection.price))
            const line = betOffer.currentmatchhandicap ? betOffer.currentmatchhandicap : undefined
            return betOffer.selections.map(selection => {
                const outcome = determineOutcome(betType, selection)
                return new BetOffer(betType, betOffer.idfoevent.toString(), Bookmaker.SCOOORE, outcome, selection.price, line, margin)
            }).flat()
        }
    })
}

function determineOutcome(betType, selection) {
    if(betType === BetType.CORRECT_SCORE || betType === BetType.CORRECT_SCORE_H1 || betType === BetType.CORRECT_SCORE_H2
    ) {
        return selection.name
    } else if(betType === BetType.DOUBLE_CHANCE || betType === BetType.DOUBLE_CHANCE_H1 || betType === BetType.DOUBLE_CHANCE_H2) {
        switch (selection.internalorder) {
            case 1:
                return "1X"
            case 2:
                return "12"
            case 3:
                return "X2"
        }
    } else {
        switch(selection.hadvalue ? selection.hadvalue : selection.name) {
            case "O":
                return "OVER"
            case "U":
                return "UNDER"
            case "D":
                return "X"
            case "H":
                return "1"
            case "A":
                return "2"
            case "Ja":
                return "YES"
            case "Nee":
                return "NO"
            case "Oneven":
                return "ODD"
            case "Even":
                return "EVEN"
        }
    }
}

function determineBetType(betType) {
    switch(betType){
        case "Full Time Score Winner 3-Way (E-Venue 3.0)":
            return BetType._1X2
        case "Full Time Score Double Chance (E-Venue 3.0)":
            return BetType.DOUBLE_CHANCE
        case "Half Time Score Winner 3-Way (E-Venue 3.0)":
            return BetType._1X2_H1
        case "Full Time Score Both Appereance (E-Venue 3.0)Full Time Score Both Appereance (E-Venue 3.0)":
            return BetType.BOTH_TEAMS_SCORE
        case "Full Time Score Total 2-Way (E-Venue 3.0)":
            return BetType.OVER_UNDER
        case "Full Time Score Winner 2-Way (E-Venue 3.0)":
            return BetType.DRAW_NO_BET
        case "Full Time European Handicap Score (E-Venue 3.0)":
            return BetType.HANDICAP
        case "2. Period Score Winner 3-Way (E-Venue 3.0)":
            return BetType._1X2_H2
        case "Half Time Score Double Chance (E-Venue 3.0)":
            return BetType.DOUBLE_CHANCE_H1
        case "Half Time European Handicap Score (E-Venue 3.0)":
            return BetType.HANDICAP_H1
        case "Half Time Score Parity (E-Venue 3.0)":
            return BetType.ODD_EVEN_H1
        case "Full Time Home Score Total 2-Way (E-Venue 3.0)":
            return BetType.OVER_UNDER_TEAM1
        case "Full Time Away Score Total 2-Way (E-Venue 3.0)":
            return BetType.OVER_UNDER_TEAM2
        case "Half Time Home Score Total 2-Way (E-Venue 3.0)":
            return BetType.OVER_UNDER_TEAM1_H1
        case "Half Time Away Score Total 2-Way (E-Venue 3.0)":
            return BetType.OVER_UNDER_TEAM2_H1
        case "Full Time Home Score Parity (E-Venue 3.0)":
            return BetType.ODD_EVEN_TEAM1
        case "Full Time Away Score Parity (E-Venue 3.0)":
            return BetType.ODD_EVEN_TEAM2
        case "Full Time Score Correct Result 26-Way (E-Venue 3.0)":
            return BetType.CORRECT_SCORE
        case "Half Time Score Correct Result (E-Venue 3.0)":
            return BetType.CORRECT_SCORE_H1
        case "Full Time Score Parity (E-Venue 3.0)":
            return BetType.ODD_EVEN
        default:
            return BetType.UNKNOWN
    }
}