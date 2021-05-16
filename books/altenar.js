const {Bookmaker, Provider, BookmakerInfo, BetType} = require("./bookmaker")
const {Event} = require("../event-mapper/event")
const {BetOffer} = require("../utils/utils");
const {getSportRadarEventUrl} = require("./sportradar")
const axios = require("axios")
const {calculateMargin} = require("../utils/utils");

const books = [Bookmaker.GOLDEN_PALACE]


exports.getAltenarEventsForCompetition = async function getAltenarEventsForCompetition(id) {
    const url = 'https://sb1capi-altenar.biahosted.com/Sportsbook/GetEvents?timezoneOffset=-60&langId=1' +
        '&skinName=' + books[0] + '&configId=1&culture=en-GB&deviceType=Mobile&numformat=en&sportids=0&categoryids=0' +
        '&champids=' + id  +'&group=AllEvents&period=periodall&withLive=false&outrightsDisplay=none' +
        '&couponType=0&startDate=2020-04-11T08%3A28%3A00.000Z&endDate=2200-04-18T08%3A27%3A00.000Z'
    return axios.get(url)
        .then(response => {
            return response.data.Result.Items[0].Events.map(event => {
                const sportRadarId = event.ExtId
                const eventUrl = "https://sb1-geteventdetailsapi-altenar.biahosted.com/Sportsbook/GetEventDetails?timezoneOffset=-120&langId=1&skinName=goldenpalace&configId=1&culture=en-GB&numformat=en&eventId=" + event.Id
                const bookmakerInfos = books.map(book => {
                    return new BookmakerInfo(Provider.ALTENAR, book, id, event.Id, url, [eventUrl],
                        undefined, undefined, "GET")
                })
                return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), bookmakerInfos)
            })
        }).catch(error => console.log(error))
}

exports.parseAltenarBetOffers = function parseAltenarBetOffers(apiResponse) {
    if(!apiResponse.data.Result) return []
    const betOffers = []
    apiResponse.data.Result.MarketGroups.filter(group => group.Name === "Main" || group.Name.toUpperCase() === "1ST HALF" || group.Name.toUpperCase() === "2ND HALF")
        .map(group => group.Items).flat().forEach(betOffer => {
        const betType = determineBetType(betOffer.MarketTypeId)
        if(betType) {
            const margin = calculateMargin(betOffer.Items.map(option => option.Price))
            return betOffer.Items.forEach(option => {
                const price = option.Price
                let outcome = option.Name.toUpperCase()
                let line = betOffer.SpecialOddsValue === '' || !betOffer.SpecialOddsValue ? undefined : parseFloat(betOffer.SpecialOddsValue)
                if(betType === BetType.HANDICAP || betType === BetType.HANDICAP_H1 || betType === BetType.HANDICAP_H2) {
                    outcome = option.Name.split('(')[0].trim().toUpperCase()
                    line = parseFloat(option.Name.split('(')[1].split(')')[0].trim().toUpperCase())
                } else if(betType === BetType.OVER_UNDER || betType === BetType.OVER_UNDER_H1 || betType === BetType.OVER_UNDER_H2){
                    outcome = outcome.includes('OVER') ? 'OVER' : 'UNDER'
                } else if(betType === BetType.CORRECT_SCORE || betType === BetType.CORRECT_SCORE_H1 || betType === BetType.CORRECT_SCORE_H2) {
                    outcome = outcome.replace(":", "-")
                }
                betOffers.push(new BetOffer(betType, apiResponse.data.Result.Id, apiResponse.bookmaker, outcome, price, line, margin))
            })
        }
    })
    return betOffers
}

function determineBetType(typeId) {
    if(typeId.startsWith("1_")) return BetType._1X2
    if(typeId.startsWith("60_")) return BetType._1X2_H1
    if(typeId.startsWith("83_")) return BetType._1X2_H2
    if(typeId.startsWith("10_")) return BetType.DOUBLE_CHANCE
    if(typeId.startsWith("63_")) return BetType.DOUBLE_CHANCE_H1
    if(typeId.startsWith("85_")) return BetType.DOUBLE_CHANCE_H2
    if(typeId.startsWith("11_")) return BetType.DRAW_NO_BET
    if(typeId.startsWith("64_")) return BetType.DRAW_NO_BET_H1
    if(typeId.startsWith("86_")) return BetType.DRAW_NO_BET_H2
    if(typeId.startsWith("14_")) return BetType.HANDICAP
    if(typeId.startsWith("65_")) return BetType.HANDICAP_H1
    if(typeId.startsWith("88_")) return BetType.HANDICAP_H2
    if(typeId.startsWith("18_")) return BetType.OVER_UNDER
    if(typeId.startsWith("16_")) return BetType.OVER_UNDER
    if(typeId.startsWith("68_")) return BetType.OVER_UNDER_H1
    if(typeId.startsWith("90_")) return BetType.OVER_UNDER_H2
    if(typeId.startsWith("19_")) return BetType.TOTAL_GOALS_TEAM1
    if(typeId.startsWith("69_")) return BetType.TOTAL_GOALS_TEAM1_H1
    if(typeId.startsWith("91_")) return BetType.TOTAL_GOALS_TEAM1_H2
    if(typeId.startsWith("20_")) return BetType.TOTAL_GOALS_TEAM2
    if(typeId.startsWith("70_")) return BetType.TOTAL_GOALS_TEAM2_H1
    if(typeId.startsWith("92_")) return BetType.TOTAL_GOALS_TEAM2_H2
    if(typeId.startsWith("26_")) return BetType.ODD_EVEN
    if(typeId.startsWith("74_")) return BetType.ODD_EVEN_H1
    if(typeId.startsWith("94_")) return BetType.ODD_EVEN_H2
    if(typeId.startsWith("27_")) return BetType.ODD_EVEN_TEAM1
    if(typeId.startsWith("28_")) return BetType.ODD_EVEN_TEAM2
    if(typeId.startsWith("29_")) return BetType.BOTH_TEAMS_SCORE
    if(typeId.startsWith("75_")) return BetType.BOTH_TEAMS_SCORE_H1
    if(typeId.startsWith("95_")) return BetType.BOTH_TEAMS_SCORE_H2
    if(typeId.startsWith("45_")) return BetType.CORRECT_SCORE
    if(typeId.startsWith("81_")) return BetType.CORRECT_SCORE_H1
    if(typeId.startsWith("98_")) return BetType.CORRECT_SCORE_H2
}