const {Bookmaker, Provider, BookmakerInfo, BetType} = require("../bookmaker")
const {Event} = require("../event")
const {BetOffer} = require("../betoffer")
const {getSportRadarEventUrl} = require("./sportradar")
const axios = require("axios")
const {calculateMargin} = require("../utils/utils")

const headers = {
    headers: {
        'x-eb-accept-language': 'en_BE',
        'x-eb-marketid': 5,
        'x-eb-platformid': 2
    }
}

exports.getLadbrokesEventsForCompetition = async function getLadbrokesEventsForCompetition(id) {
    const leagueUrl = 'https://www.ladbrokes.be/detail-service/sport-schedule/services/meeting/calcio/'
        + id + '?prematch=1&live=0'
    return axios.get(leagueUrl, headers).then(response => {
        return response.data.result.dataGroupList.map(group => group.itemList).flat().map(event => {
            const eventId = event.eventInfo.aliasUrl
            const eventUrl = 'https://www.ladbrokes.be/detail-service/sport-schedule/services/event/calcio/'
                + id + '/' + eventId + '?prematch=1&live=0'
            const sportRadarId = event.eventInfo.programBetradarInfo.matchId
            const bookmakerInfo = new BookmakerInfo(Provider.LADBROKES, Bookmaker.LADBROKES, id, eventId, leagueUrl, [eventUrl], headers, undefined, "GET")
            return new Event(sportRadarId.toString(), getSportRadarEventUrl(sportRadarId), [bookmakerInfo])
        })
    })
}

exports.parseLadbrokesBetOffers = function parseLadbrokesBetOffers(apiResponse) {
    if(!apiResponse.data.result) return []
    const betOffers = []
    apiResponse.data.result.betGroupList.map(betGroup => betGroup.oddGroupList).flat().forEach(oddGroup => {
        const betType = determineBetOfferType(oddGroup.betId)
        const line = oddGroup.additionalDescription ? parseFloat(oddGroup.additionalDescription.toUpperCase().trim()): undefined
        const margin = calculateMargin(oddGroup.oddList.map(option => option.oddValue / 100))
        oddGroup.oddList.forEach(option => {
            const outcome = option.oddDescription.toUpperCase()
            const price = option.oddValue / 100
            betOffers.push(new BetOffer(betType, apiResponse.data.result.eventInfo.aliasUrl, Provider.LADBROKES, outcome, price, line, margin))
        })
    })
    return betOffers
}


function determineBetOfferType(id) {
    switch(id){
        case 24:
            return BetType._1X2
        case 1907:
            return BetType.OVER_UNDER
        case 1550:
            return BetType.BOTH_TEAMS_SCORE
        case 1555:
            return BetType.DOUBLE_CHANCE
        case 53:
            return BetType.HANDICAP
        case 74:
            return BetType.HALF_TIME_FULL_TIME
        case 51:
            return BetType.CORRECT_SCORE
        case 79:
            return BetType.ODD_EVEN
        case 363:
            return BetType._1X2_H1
        case 372:
            return BetType.BOTH_TEAMS_SCORE_H1
        default:
            return BetType.UNKNOWN
    }
}