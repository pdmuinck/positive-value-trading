const {sortBetOffers} = require("../utils");
const {Bookmaker, BetType} = require("./bookmaker")
const {calculateMargin, BetOffer} = require("../utils")
/*
you can choose api rest calls or websocket:
wss://sbapi.sbtech.com/bethard/sportscontent/sportsbook/v1/Websocket?jwt=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTg3NTIyMDksImlzcyI6IkJldGhhcmQiLCJTaXRlSWQiOjk5LCJJc0Fub255bW91cyI6dHJ1ZSwiU2Vzc2lvbklkIjoiMzU2NDMyMjItOTM1Ni00ZTc1LWJlZmQtZGYxZDkyZDU2ZDliIiwibmJmIjoxNjE4NzQ1MDA5LCJpYXQiOjE2MTg3NDUwMDl9.a6gpwBUGq0m8xMQz1Wd2WM2KURwqgEr-0u1ISspozqMbKukZOZ_dB9GbBSz6GVy7ZXY0eCu0ZeASjXWDBtUGGjLQA8qgw71Ary8ZuLFK1XQ2MO7y4JFYhMYIoEv__ZAtTUzPipwhKigfjfnvVV99k-SY5zUxgTmo5W1klYbBggRew-q9OVHsgqH7GpEyso9ynF7JoRqS-Nf3uGcyM1O-RLl1iP_4ai-pBKNwGXyCBnrCo76sboNrru1y5MNS9E0-5pLZJdidpJ4KjkTn5OyrkclSdemC81laUMyghCa4To6zSb1f7iz913AVPT7RV4X0x9i2YfNIrAKtLJzAKECzkQ&locale=en
 */



function determineOutcomeType(selection, betType) {
    switch(selection.outcomeType){
        case 'Home':
            return '1'
        case 'Away':
            return '2'
        case 'Tie':
            return 'X'
        default:
            return selection.outcomeType ? selection.outcomeType.toUpperCase() : selection.outcomeType
    }
}

function determineLine(selection, betType, outcome) {
    if(betType === BetType.HANDICAP) {
        const line = selection.points
        if(outcome === "2" && line === -1) return "1:0"
        if(outcome === "2" && line === -2) return "2:0"
        if(outcome === "2" && line === -3) return "3:0"
        if(outcome === "2" && line === -4) return "4:0"
        if(outcome === "2" && line === -5) return "5:0"
        if(outcome === "2" && line === 1) return "0:1"
        if(outcome === "2" && line === 2) return "0:2"
        if(outcome === "2" && line === 3) return "0:3"
        if(outcome === "2" && line === 4) return "0:4"
        if(outcome === "2" && line === 5) return "0:5"
        if(outcome === "1" && line === -1) return "0:1"
        if(outcome === "1" && line === -2) return "0:2"
        if(outcome === "1" && line === -3) return "0:3"
        if(outcome === "1" && line === -4) return "0:4"
        if(outcome === "1" && line === -5) return "0:5"
        if(outcome === "1" && line === 1) return "1:0"
        if(outcome === "1" && line === 2) return "2:0"
        if(outcome === "1" && line === 3) return "3:0"
        if(outcome === "1" && line === 4) return "4:0"
        if(outcome === "1" && line === 5) return "5:0"
        if(outcome === "X" && line === -1) return "0:1"
        if(outcome === "X" && line === -2) return "0:2"
        if(outcome === "X" && line === -3) return "0:3"
        if(outcome === "X" && line === -4) return "0:4"
        if(outcome === "X" && line === -5) return "0:5"
        if(outcome === "X" && line === 1) return "1:0"
        if(outcome === "X" && line === 2) return "2:0"
        if(outcome === "X" && line === 3) return "3:0"
        if(outcome === "X" && line === 4) return "4:0"
        if(outcome === "X" && line === 5) return "5:0"
    }
    return selection.points ? selection.points.toString() : null
}

function determineBetOfferType(typeId) {
    switch(typeId){
        // 1X2
        case "1_0":
            return BetType._1X2
        case "1_1":
            return BetType._1X2_H1
        case "1_2":
            return BetType._1X2_H2

        // DRAW NO BET
        case "2_157":
            return BetType.DRAW_NO_BET

        // DOUBLE CHANCE
        case "61":
            return BetType.DOUBLE_CHANCE
        case "145":
            return BetType.DOUBLE_CHANCE_H1


        // OVER UNDER
        case "3_200":
            return BetType.OVER_UNDER

        /*
        case "3_1":
            return BetType.OVER_UNDER_H1
        case "3_2":
            return BetType.OVER_UNDER_H2

        case "3_7":
            return BetType.OVER_UNDER_TEAM

        // CORRECT SCORE
        case "60":
            return BetType.CORRECT_SCORE

         */

        // ASIAN HANDICAP
            /*
        case "2_0":
            return BetType.ASIAN_HANDICAP
        /*
        case "2_1":
            return BetType.ASIAN_HANDICAP_H1
        case "2_2":
            return BetType.ASIAN_HANDICAP_H2

         */

        // ODD_EVEN
        case "38":
            return BetType.ODD_EVEN
        /*
        case "267":
            return BetType.ODD_EVEN_H2
        case "274":
            return BetType.ODD_EVEN_TEAMS
        case "278":
            return BetType.ODD_EVEN_TEAMS_H2
        case "276":
            return BetType.ODD_EVEN_TEAMS_H1


         */

        // OTHER
        case "158":
            return BetType.BOTH_TEAMS_SCORE
        case "2936":
            return BetType.BOTH_TEAMS_SCORE_H2
        case "2935":
            return BetType.BOTH_TEAMS_SCORE_H1

        case "270":
            return BetType.HANDICAP

        default:
            return BetType.UNKNOWN

    }
}

exports.parseSbtechBetOffers = function parseSbtechBetOffers(apiResponse) {
    //const homeId = apiResponse.data.data.events[0].participants.filter(participant => participant.venueRole === "Home")[0].id
    return apiResponse.data.data.markets
        .map(market => {
            const typeId = market.marketType.id
            const betOfferType = determineBetOfferType(typeId)
            const betOffers = []
            const eventId = market.eventId
            const margin = calculateMargin(market.selections.map(selection => selection.trueOdds))

            if(betOfferType !== BetType.UNKNOWN) {
                market.selections.forEach(selection => {
                    const outcomeType = determineOutcomeType(selection, betOfferType)
                    const price = parseFloat(selection.displayOdds.decimal)
                    const line = determineLine(selection, betOfferType, outcomeType)
                    betOffers.push(new BetOffer(betOfferType, eventId, apiResponse.bookmaker, outcomeType, price, line, margin))
                })
            }
            return betOffers
        }).flat().filter(x => x).sort(sortBetOffers).map(betOffer => {
            betOffer.betType = betOffer.betType.name
            return betOffer
        })
}




/*
"YOUBET": {name: 'youbet', tokenUrl: 'https://api.play-gaming.com/authentication/v1/api/GetTokenBySiteId/161', dataUrl: 'https://sbapi.sbtech.com/youbet/sportscontent/sportsbook/v1/Events/getBySportId'},
"BETFIRST": {oddsUrl: 'https://sbapi.sbtech.com/betfirst/sportscontent/sportsbook/v1/Events/getByEventId', name: 'betfirst', licenses: ['BE'], tokenUrl: 'https://sbapi.sbtech.com/betfirst/auth/platform/v1/api/GetTokenBySiteId/28', dataUrl: 'https://sbapi.sbtech.com/betfirst/sportscontent/sportsbook/v1/Events/getBySportId'},
"BET777": {oddsUrl: 'https://sbapi.sbtech.com/bet777/sportscontent/sportsbook/v1/Events/getByEventId', name: 'bet777', licenses: ['BE'], tokenUrl: 'https://sbapi.sbtech.com/bet777/auth/platform/v1/api/GetTokenBySiteId/72', dataUrl: 'https://sbapi.sbtech.com/bet777/sportscontent/sportsbook/v1/Events/getBySportId'},
"BETHARD": {name: 'bethard', tokenUrl: 'https://sbapi.sbtech.com/bet777/auth/platform/v1/api/GetTokenBySiteId/99', dataUrl: 'https://sbapi.sbtech.com/bethard/sportscontent/sportsbook/v1/Events/getBySportId'},
//"GANABET": {name: 'ganabet', tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/35', dataUrl: 'https://sbapi.sbtech.com/ganabet/sportscontent/sportsbook/v1/Events/getBySportId'},
"VIRGIN_BET": {api: 'V2', name: 'virginbet', tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/227', dataUrl: 'https://sbapi.sbtech.com/virginbet/sportscontent/sportsbook/v1/Events/getBySportId'},
"ETOTO": {name: 'etoto', country: 'PL', tokenUrl: 'https://api.play-gaming.com/auth/v1/api/getTokenBySiteId/159', dataUrl: 'https://sbapi.sbtech.com/etoto/sportscontent/sportsbook/v1/Events/getBySportId'},
"10BET": {name: '10betuk', licenses: ['UK'], tokenUrl: 'https://api.play-gaming.com/authentication/v1/api/GetTokenBySiteId/1', dataUrl: 'https://sbapi.sbtech.com/10betuk/sportscontent/sportsbook/v1/Events/getBySportId'},
"NETBET": {name: 'netbet', licenses: ['UK'], tokenUrl: 'https://api.play-gaming.com/authentication/v1/api/GetTokenBySiteId/31', dataUrl: 'https://sbapi.sbtech.com/netbet/sportscontent/sportsbook/v1/Events/getBySportId'},
"WINMASTERS": {name: 'winmasters', licenses: ['UK'], tokenUrl: 'https://api.play-gaming.com/authentication/v1/api/GetTokenBySiteId/117', dataUrl: 'https://sbapi.sbtech.com/winmasters/sportscontent/sportsbook/v1/Events/getBySportId'},
"KARAMBA": {api: 'V2', name: 'aspireglobal', country: '', tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/148', dataUrl: 'https://sbapi.sbtech.com/aspireglobal/sportscontent/sportsbook/v1/Events/getBySportId'},
"HOPA": {api: 'V2', name: 'aspireglobal', licenses: ['UK', 'Malta'], tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/148', dataUrl: 'https://sbapi.sbtech.com/aspireglobal/sportscontent/sportsbook/v1/Events/getBySportId'},
"SPORT_NATION": {api:'V2', name: 'sportnation', licenses: ['UK'], tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/154', dataUrl: 'https://sbapi.sbtech.com/sportnation/sportscontent/sportsbook/v1/Events/getBySportId'},
"RED_ZONE_SPORTS": {api:'V2', name: 'redzonesports', licenses: ['UK'], tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/155',dataUrl: 'https://sbapi.sbtech.com/redzonesports/sportscontent/sportsbook/v1/Events/getBySportId'},
"MR_PLAY": {api:'V2', name: 'mrplay', licenses: ['UK'], tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/333', dataUrl: 'https://sbapi.sbtech.com/mrplay/sportscontent/sportsbook/v1/Events/getBySportId'},
"MANSION_BET": {name: 'mansionuk', licenses: ['UK'],  tokenUrl: 'https://api.play-gaming.com/authentication/v1/api/GetTokenBySiteId/179', dataUrl: 'https://sbapi.sbtech.com/mansionuk/sportscontent/sportsbook/v1/Events/getBySportId'},
"SAZKA": {api:'V2', name: 'sazka', licenses: ['CZ'], tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/96', dataUrl: 'https://sbapi.sbtech.com/sazka/sportscontent/sportsbook/v1/Events/getBySportId'},
//"LUCKIA": {api: 'V2', name: 'luckia', licenses: ['ES'], tokenUrl: 'https://api.play-gaming.com/authentication/v1/api/GetTokenBySiteId/106', dataUrl: 'https://sbapi.sbtech.com/luckia/sportscontent/sportsbook/v1/Events/getBySportId'},
"OREGON_LOTTERY": {api: 'V2', name: 'oregonlottery', licenses: ['US'], tokenUrl: 'https://api-orp.sbtech.com/auth/v2/getTokenBySiteId/15002', dataUrl: 'https://api-orp.sbtech.com/oregonlottery/sportscontent/sportsbook/v1/Events/GetBySportId'},
"BETPT": {api: 'V2', name: 'betpt', licenses: ['PT'], tokenUrl: 'https://api.play-gaming.com/auth/v2/getTokenBySiteId/85', dataUrl: 'https://sbapi.sbtech.com/betpt/sportscontent/sportsbook/v1/Events/getBySportId'}
*/
