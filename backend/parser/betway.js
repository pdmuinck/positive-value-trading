const {Bookmaker, BetType} = require("./bookmaker")
const {calculateMargin, BetOffer, sortBetOffers} = require("../utils");


exports.parseBetwayBetOffers = function parseBetwayBetOffers(apiResponse) {
    const eventId = apiResponse.data.Event.Id
    const markets = apiResponse.data.Markets
    const outcomes = apiResponse.data.Outcomes
    return markets.map(market => {
        const betType = determineBetType(market.Title)
        if(betType !== BetType.UNKNOWN) {
            const margin = calculateMargin(outcomes.filter(outcome => market.Outcomes[0].includes(outcome.Id)))
            return market.Outcomes.flat().map(outcomeToSearch => {
                const outcome = outcomes.filter(outcomeElement => outcomeElement.Id === outcomeToSearch)[0]
                const option = determineOption(betType, outcome.CouponName.toUpperCase(), outcome.SortIndex)
                let line = outcome.HandicapDisplay === "" ? null : outcome.HandicapDisplay
                if(!line && betType ===  BetType.OVER_UNDER) {
                    const titleSplitted = market.Title.split(" ")
                    line = titleSplitted[titleSplitted.length - 1]
                }
                if(betType === BetType.HANDICAP) {
                    if(outcome.SortIndex === 1 && outcome.HandicapDisplay === "-1") line = "0:1"
                    if(outcome.SortIndex === 1 && outcome.HandicapDisplay === "+1") line = "1:0"
                    if(outcome.SortIndex === 2 && outcome.HandicapDisplay === "-1") line = "1:0"
                    if(outcome.SortIndex === 2 && outcome.HandicapDisplay === "+1") line = "0:1"
                    if(outcome.SortIndex === 3 && outcome.HandicapDisplay === "-1") line = "1:0"
                    if(outcome.SortIndex === 3 && outcome.HandicapDisplay === "+1") line = "0:1"
                }

                if(betType === BetType.ASIAN_HANDICAP) {
                    line = Math.abs(outcome.Handicap).toString()
                }
                return new BetOffer(betType, eventId, Bookmaker.BETWAY, option, parseFloat(outcome.OddsDecimalDisplay), line, margin)
            })
        }
    }).flat().filter(x => x).flat().sort(sortBetOffers).map(betOffer => {
        betOffer.betType = betOffer.betType.name
        return betOffer
    })
}

function determineOption(betType, couponName, sortIndex) {
    if(betType === BetType.ASIAN_HANDICAP || betType === BetType.ASIAN_HANDICAP_H1 || betType === BetType.DRAW_NO_BET || betType === BetType.DRAW_NO_BET_H1 || betType === BetType.DRAW_NO_BET_H2) {
        if(sortIndex === 1) return "1"
        return "2"
    }
    if(betType === BetType.HANDICAP) {
        if(sortIndex === 1) return "1"
        if(sortIndex === 2) return "X"
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
        // 1X2
        case "Win/Draw/Win":
            return BetType._1X2
        case "1st Half - Win/Draw/Win":
            return BetType._1X2_H1
        case "2nd Half - Win/Draw/Win":
            return BetType._1X2_H2

        // DOUBLE CHANCE
        case "Double Chance":
            return BetType.DOUBLE_CHANCE
        case "1st Half - Double Chance":
            return BetType.DOUBLE_CHANCE_H1
        case "2nd Half - Double Chance":
            return BetType.DOUBLE_CHANCE_H2

        // DRAW NO BET
        case "Draw No Bet":
            return BetType.DRAW_NO_BET
        case "1st Half - Draw No Bet":
            return BetType.DRAW_NO_BET_H1
        case "2nd Half - Draw No Bet":
            return BetType.DRAW_NO_BET_H2

        // 3-WAY HANDICAP
        case "Handicap 3-Way":
            return BetType.HANDICAP

        // ASIAN HANDICAP
        case "Asian Handicap":
            return BetType.ASIAN_HANDICAP

        // TOTAL GOALS
        case "Total Goals 0.5":
            return BetType.OVER_UNDER
        case "Total Goals 1.5":
            return BetType.OVER_UNDER
        case "Total Goals 2.5":
            return BetType.OVER_UNDER
        case "Total Goals 3.5":
            return BetType.OVER_UNDER
        case "Total Goals 4.5":
            return BetType.OVER_UNDER
        case "Total Goals 5.5":
            return BetType.OVER_UNDER

        // ODD EVEN
        case "Total Goals Odd/Even":
            return BetType.ODD_EVEN

        // BOTH TEAMS TO SCORE
        case "Both Teams To Score":
            return BetType.BOTH_TEAMS_SCORE
        case "2nd Half Both Teams To Score":
            return BetType.BOTH_TEAMS_SCORE_H2
        case "1st Half Both Teams To Score":
            return BetType.BOTH_TEAMS_SCORE_H1


        /*
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
/*
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

/*
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


 */

        /*
        case "1st Half Asian Handicap":
            return BetType.ASIAN_HANDICAP_H1

         */

        /*
        case "Correct Score":
            return BetType.CORRECT_SCORE

         */
        default:
            return BetType.UNKNOWN
    }
}