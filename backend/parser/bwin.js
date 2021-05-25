const {Bookmaker, BetType} = require("./bookmaker")
const {calculateMargin, BetOffer} = require("../utils")


exports.parseBwinBetOffers = function parseBwinBetOffers(apiResponse) {
    if (!apiResponse.data.fixture) return []
    const event = apiResponse.data.fixture
    return event.games.map(game => {
        const betType = determineBetType(game.categoryId, game.name.value)
        if (betType !== BetType.UNKNOWN) {
            const margin = calculateMargin(game.results.map(result => result.odds))
            const line = game.attr ? game.attr.replace(",", ".") : undefined
            return game.results.map((result, index) => {
                const price = result.odds
                const outcome = determineOutcome(betType, result, index)
                return new BetOffer(betType, event.id, Bookmaker.BWIN, outcome, price, line, margin)
            })
        }
    }).flat().filter(x => x).sort(sortBetOffers).map(betOffer => {
        betOffer.betType = betOffer.betType.name
        return betOffer
    })
}

function determineOutcome(betType, result, index) {
    if(betType === BetType.DOUBLE_CHANCE) {
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

function determineBetType(categoryId, name) {
    switch(categoryId) {
        // TOTAL GOALS
        case 31:
            if(name === "Total Goals O/U - 2nd Half") return BetType.OVER_UNDER_H2
            if(name === "Total Goals O/U - 1st Half") return BetType.OVER_UNDER_H1
            return BetType.OVER_UNDER

        // 1X2
        case 25:
            return BetType._1X2
        case 30:
            if(name === "Half Time result") return BetType._1X2_H1





        // 1X2
        case 17:
            return BetType._1X2
        case 2488:
            return BetType._1X2_H1

        // DOUBLE CHANCE
        case 3187:
            return BetType.DOUBLE_CHANCE
        case 11748:
            return BetType.DOUBLE_CHANCE_H1


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