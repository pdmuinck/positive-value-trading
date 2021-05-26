const {Bookmaker, BetType} = require("./bookmaker")
const {calculateMargin, BetOffer, sortBetOffers} = require("../utils")


exports.parseBwinBetOffers = function parseBwinBetOffers(apiResponse) {
    if (!apiResponse.data.fixture) return []
    return apiResponse.data.fixture.games.map(game => {
        const betType = determineBetType(game.name.value)
        if (betType !== BetType.UNKNOWN) {
            const margin = calculateMargin(game.results.map(result => result.odds))
            const line = determineLine(game)
            return game.results.map((result, index) => {
                const price = result.odds
                const outcome = determineOutcome(betType, result, index)
                return new BetOffer(betType, apiResponse.data.fixture.id, Bookmaker.BWIN, outcome, price, line, margin)
            })
        }
    }).flat().filter(x => x).sort(sortBetOffers).map(betOffer => {
        betOffer.betType = betOffer.betType.name
        return betOffer
    })
}

function determineLine(game) {
    if(game.name.value.includes("Handicap")) {
        return game.name.value.split(" ")[1]
    }
    return game.attr ? game.attr.replace(",", ".") : null
}

function determineOutcome(betType, result, index) {
    if(betType === BetType.DOUBLE_CHANCE || betType === BetType.DOUBLE_CHANCE_H1) {
        if(result.name.value.includes("X or")) return "X2"
        if(result.name.value.includes("or X")) return "1X"
        return "12"
    }
    if(betType === BetType.OVER_UNDER || betType === BetType.OVER_UNDER_H1 || betType === BetType.OVER_UNDER_H2) {
        return result.totalsPrefix.toUpperCase()
    }
    if(betType === BetType._1X2) {
        return result.sourceName.value.toUpperCase()
    }
    if(betType === BetType.DRAW_NO_BET) {
        if(index === 0) return "1"
        return "2"
    }
    if(betType === BetType.HANDICAP || betType === BetType._1X2_H1) {
        if(index === 0) return "1"
        if(index === 1) return "X"
        return "2"
    }
    return result.name.value.toUpperCase()

}

function determineBetType(name) {
    switch(name) {
        // 1X2
        case "Match Result":
            return BetType._1X2
        case "Half Time result":
            return BetType._1X2_H1

        // TOTAL GOALS
        case "Total Goals O/U - 2nd Half":
            return BetType.OVER_UNDER_H2
        case "Total Goals O/U - 1st Half":
            return BetType.OVER_UNDER_H1
        case "Total Goals - Over/Under":
            return BetType.OVER_UNDER

        // DOUBLE CHANCE
        case "Double Chance":
            return BetType.DOUBLE_CHANCE
        case "Half Time Double Chance":
            return BetType.DOUBLE_CHANCE_H1

        // BOTH TEAMS TO SCORE
        case "Both Teams to Score":
            return BetType.BOTH_TEAMS_SCORE
        case "Both Teams to Score 1st Half":
            return BetType.BOTH_TEAMS_SCORE_H1
        case "Both Teams to Score in 2nd Half":
            return BetType.BOTH_TEAMS_SCORE_H2


        case "Draw No Bet":
            return BetType.DRAW_NO_BET

        // ODD EVEN
        case "Number of Goals - Odd/Even (no Goal counts as even)":
            return BetType.ODD_EVEN

        // HANDICAP
        case "Handicap 0:1":
            return BetType.HANDICAP
        case "Handicap 0:2":
            return BetType.HANDICAP
        case "Handicap 0:3":
            return BetType.HANDICAP
        case "Handicap 1:0":
            return BetType.HANDICAP
        case "Handicap 2:0":
            return BetType.HANDICAP
        case "Handicap 3:0":
            return BetType.HANDICAP


        /*
        // DRAW NO BET
        case 12119:
            return BetType.DRAW_NO_BET

        // BOTH TEAMS TO SCORE
        case 7824:
            return BetType.BOTH_TEAMS_SCORE
        case 15085:
            return BetType.BOTH_TEAMS_SCORE_H1

        // OVER UNDER
        case 173:
            return BetType.OVER_UNDER
        case 859:
            return BetType.OVER_UNDER
        case 7233:
            return BetType.OVER_UNDER
        case 1772:
            return BetType.OVER_UNDER
        case 1791:
            return BetType.OVER_UNDER
        case 8933:
            return BetType.OVER_UNDER

        // ODD EVEN
        case 4665:
            return BetType.ODD_EVEN
        case 16449:
            return BetType.ODD_EVEN_H1

        case 509:
            return BetType.HANDICAP

        case 52:
            return BetType.HANDICAP
        case 54:
            return BetType.HANDICAP

        /*
        case 19193:
            return BetType.CORRECT_SCORE
        case 26644:
            return BetType.CORRECT_SCORE_H1

        case 16454:
            return BetType.OVER_UNDER_TEAM1
        case 16455:
            return BetType.OVER_UNDER_TEAM2
        case 20085:
            return BetType.OVER_UNDER_TEAM2
        case 24138:
            return BetType.OVER_UNDER_TEAM1
        case 31317:
            return BetType.OVER_UNDER_TEAM1_H1
        case 31316:
            return BetType.OVER_UNDER_TEAM1_H1
        case 31319:
            return BetType.OVER_UNDER_TEAM2_H1
        case 31320:
            return BetType.OVER_UNDER_TEAM2_H1
        case 4727:
            return BetType.TOTAL_GOALS_TEAM2



        // TOTAL GOALS
        case 2196:
            return BetType.TOTAL_GOALS
        case 20095:
            return BetType.TOTAL_GOALS
        /*
        case 4718:
            return BetType.TOTAL_GOALS_H1
        case 4732:
            return BetType.TOTAL_GOALS_H2
        case 4721:
            return BetType.TOTAL_GOALS_TEAM2_H1
        case 4733:
            return BetType.TOTAL_GOALS_TEAM1_H2
        case 4720:
            return BetType.TOTAL_GOALS_TEAM1_H1
        case 4734:
            return BetType.TOTAL_GOALS_TEAM2_H2

         */
        /*
        case 7688:
            return BetType.OVER_UNDER_H1
        case 7689:
            return BetType.OVER_UNDER_H1
        case 7890:
            return BetType.OVER_UNDER_H1
        case 7891:
            return BetType.OVER_UNDER_H1
        case 19595:
            return BetType.OVER_UNDER_H2
        case 19596:
            return BetType.OVER_UNDER_H2
        case 19597:
            return BetType.OVER_UNDER_H2
        case 20506:
            return BetType.OVER_UNDER_H2

         */
        default:
            return BetType.UNKNOWN
    }
}