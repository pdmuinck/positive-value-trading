const {Bookmaker, Provider, BookmakerInfo, BetType} = require("./bookmaker")
const {Event} = require("../event-mapper/event")
const {BetOffer} = require("../utils/utils");
const {getSportRadarEventUrl} = require("./sportradar")
const axios = require("axios")
const {calculateMargin} = require("../utils/utils");

const markets = ["win-draw-win", "double-chance", "goals-over", "handicap-goals-over"]

exports.getBetwayEventsForCompetition = async function getBetwayEventsForCompetition(id) {
    const eventIdPayload = {"PremiumOnly":false,"LanguageId":1,"ClientTypeId":2,"BrandId":3,"JurisdictionId":3,
        "ClientIntegratorId":1,"CategoryCName":"soccer","SubCategoryCName":"belgium","GroupCName":id }

    const leagueUrl = "https://sports.betway.be/api/Events/V2/GetGroup"
    const eventUrl = "https://sports.betway.be/api/Events/V2/GetEventDetails"
    return axios.post(leagueUrl, eventIdPayload)
        .then(response => {
            const eventIds = response.data.Categories[0].Events
            return axios.post('https://sports.betway.be/api/Events/V2/GetEvents', {"LanguageId":1,"ClientTypeId":2,"BrandId":3,"JurisdictionId":3,"ClientIntegratorId":1,"ExternalIds":eventIds
                ,"MarketCName":markets[0],"ScoreboardRequest":{"ScoreboardType":3,"IncidentRequest":{}}}).then(response => {
                return response.data.Events.map(event => {
                    const payload = {"LanguageId":1,"ClientTypeId":2,"BrandId":3,"JurisdictionId":3,"ClientIntegratorId":1,"EventId":event.Id
                        ,"ScoreboardRequest":{"ScoreboardType":3,"IncidentRequest":{}}}
                    const bookmakerInfo = new BookmakerInfo(Provider.BETWAY, Bookmaker.BETWAY, id, event.Id, leagueUrl, [eventUrl], undefined, payload, "POST")
                    if(event.SportsRadarId) {
                        return new Event(event.SportsRadarId.toString(), getSportRadarEventUrl(event.SportsRadarId), [bookmakerInfo])
                    }
                })
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
}

exports.parseBetwayBetOffers = function parseBetwayBetOffers(apiResponse) {
    const eventId = apiResponse.data.Event.Id
    const markets = apiResponse.data.Markets
    const outcomes = apiResponse.data.Outcomes
    return markets.map(market => {
        const betType = determineBetType(market.Title)
        if(betType !== BetType.UNKNOWN) {
            let line = market.Handicap ? market.Handicap : undefined
            if(betType === BetType.OVER_UNDER || betType === BetType.OVER_UNDER_H1) {
                const titleSplitted = market.Title.split(" ")
                line = parseFloat(titleSplitted[titleSplitted.length - 1])
            }
            const margin = calculateMargin(outcomes.filter(outcome => market.Outcomes[0].includes(outcome.Id)))
            return market.Outcomes[0].map(outcomeToSearch => {
                const outcome = outcomes.filter(outcomeElement => outcomeElement.Id === outcomeToSearch)[0]
                const option = determineOption(betType, outcome.CouponName.toUpperCase(), outcome.SortIndex)
                return new BetOffer(betType, eventId, Bookmaker.BETWAY, option, parseFloat(outcome.OddsDecimalDisplay), line, margin)
            })
        }
    }).flat().filter(x => x)
}

function determineOption(betType, couponName, sortIndex) {
    if(betType === BetType.ASIAN_HANDICAP || betType === BetType.ASIAN_HANDICAP_H1 || betType  === BetType.ASIAN_OVER_UNDER
        || betType === BetType.ASIAN_OVER_UNDER_H1) {
        if(sortIndex === 1) return "1"
        return "2"
    }
    switch(couponName) {
        case "HOME":
            return "1"
        case "DRAW":
            return "X"
        case "AWAY":
            return "2"
        case "HOME & DRAW":
            return "1X"
        case "HOME & AWAY":
            return "12"
        case "AWAY & DRAW":
            return "X2"

        default:
            return couponName

    }
}
function determineBetType(title) {
    switch(title) {
        case "Win/Draw/Win":
            return BetType._1X2
        case "1st Half - Win/Draw/Win":
            return BetType._1X2_H1
        case "2nd Half - Win/Draw/Win":
            return BetType._1X2_H2

        case "Both Teams To Score":
            return BetType.BOTH_TEAMS_SCORE

        case "Total Goals 1.5":
            return BetType.OVER_UNDER
        case "Total Goals 2.5":
            return BetType.OVER_UNDER
        case "Total Goals 3.5":
            return BetType.OVER_UNDER
        case "Total Goals 4.5":
            return BetType.OVER_UNDER

        case "1st Half - Total Goals 0.5":
            return BetType.OVER_UNDER_H1
        case "1st Half - Total Goals 1.5":
            return BetType.OVER_UNDER_H1
        case "1st Half - Total Goals 2.5":
            return BetType.OVER_UNDER_H1

        case "2nd Half - Total Goals 0.5":
            return BetType.OVER_UNDER_H2
        case "2nd Half - Total Goals 1.5":
            return BetType.OVER_UNDER_H2
        case "2nd Half - Total Goals 2.5":
            return BetType.OVER_UNDER_H2
        case "2nd Half - Total Goals 3.5":
            return BetType.OVER_UNDER_H2

        case "1st Half - Team A - Total Goals 0.5":
            return BetType.OVER_UNDER_TEAM1_H1
        case "1st Half - Team A - Total Goals 1.5":
            return BetType.OVER_UNDER_TEAM1_H1
        case "1st Half - Team B - Total Goals 0.5":
            return BetType.OVER_UNDER_TEAM2_H1
        case "1st Half - Team B - Total Goals 1.5":
            return BetType.OVER_UNDER_TEAM2_H1

        case "2nd Half Team A Total Goals 0.5":
            return BetType.OVER_UNDER_TEAM1_H2
        case "2nd Half Team A Total Goals 1.5":
            return BetType.OVER_UNDER_TEAM1_H2
        case "2nd Half Team A Total Goals 2.5":
            return BetType.OVER_UNDER_TEAM1_H2
        case "2nd Half Team A Total Goals 3.5":
            return BetType.OVER_UNDER_TEAM1_H2

        case "2nd Half Team B Total Goals 0.5":
            return BetType.OVER_UNDER_TEAM2_H2
        case "2nd Half Team B Total Goals 1.5":
            return BetType.OVER_UNDER_TEAM2_H2
        case "2nd Half Team B Total Goals 2.5":
            return BetType.OVER_UNDER_TEAM2_H2
        case "2nd Half Team B Total Goals 3.5":
            return BetType.OVER_UNDER_TEAM2_H2


        case "Team A Total Goals 0.5":
            return BetType.OVER_UNDER_TEAM1
        case "Team A Total Goals 1.5":
            return BetType.OVER_UNDER_TEAM1
        case "Team A Total Goals 2.5":
            return BetType.OVER_UNDER_TEAM1
        case "Team A Total Goals 3.5":
            return BetType.OVER_UNDER_TEAM1

        case "Team B Total Goals 0.5":
            return BetType.OVER_UNDER_TEAM2
        case "Team B Total Goals 1.5":
            return BetType.OVER_UNDER_TEAM2
        case "Team B Total Goals 2.5":
            return BetType.OVER_UNDER_TEAM2
        case "Team B Total Goals 3.5":
            return BetType.OVER_UNDER_TEAM2


        case "Double Chance":
            return BetType.DOUBLE_CHANCE
        case "2nd Half - Double Chance":
            return BetType.DOUBLE_CHANCE_H2

        case "Handicap 3-Way":
            return BetType.HANDICAP

        case "1st Half Asian Handicap":
            return BetType.ASIAN_HANDICAP_H1

        case "Correct Score":
            return BetType.CORRECT_SCORE

        case "Draw No Bet":
            return BetType.DRAW_NO_BET
        case "1st Half - Draw No Bet":
            return BetType.DRAW_NO_BET_H1
        case "2nd Half - Draw No Bet":
            return BetType.DRAW_NO_BET_H2

        case "handicap-wdw":
            return BetType.HANDICAP
        default:
            return BetType.UNKNOWN
    }
}