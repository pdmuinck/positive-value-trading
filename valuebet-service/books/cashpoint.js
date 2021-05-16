const {Bookmaker, Provider, BookmakerInfo, BetType} = require("../bookmaker")
const {Event} = require("../event")
const {BetOffer} = require("../betoffer")
const {getSportRadarEventUrl} = require("./sportradar")
const axios = require("axios")
const {calculateMargin} = require("../utils/utils");

const books = [Bookmaker.TOTOLOTEK, Bookmaker.MERKUR_SPORTS, Bookmaker.BETCENTER, Bookmaker.CASHPOINT]

const domains = {}
domains[Bookmaker.TOTOLOTEK] = "oddsservice.totolotek.pl"
domains[Bookmaker.MERKUR_SPORTS] = "oddsservice.merkur-sports.de"
domains[Bookmaker.BETCENTER] = "oddsservice.betcenter.be"
domains[Bookmaker.CASHPOINT] = "oddsservice.cashpoint.com"

function getGamesUrl(domain) {
    return "https://" + domain + "/odds/getGames/8"
}

async function getCashPointEventsForCompetition(id) {
    const domains = {}
    domains[Bookmaker.TOTOLOTEK] = "oddsservice.totolotek.pl"
    domains[Bookmaker.MERKUR_SPORTS] = "oddsservice.merkur-sports.de"
    domains[Bookmaker.BETCENTER] = "oddsservice.betcenter.be"
    domains[Bookmaker.CASHPOINT] = "oddsservice.cashpoint.com"
    const headers = {
        headers: {
            "x-language": 2,
            "x-brand": 7,
            "x-location": 21,
            "x-client-country": 21,
            "Content-Type":"application/json"
        }
    }
    const payload = {"leagueIds": [parseInt(id)], "sportId": 1,"gameTypes":[1, 4, 5],"limit":20000,"jurisdictionId":30}
    const url = getGamesUrl(domains[Bookmaker.CASHPOINT])
    return axios.post(url, payload, headers)
        .then(response => {
            return response.data.games.map(event => {
                const sportRadarId = event.statisticsId.toString()
                const bookmakerInfos = books.map(book => {
                    const url = getGamesUrl(domains[book])
                    return new BookmakerInfo(Provider.CASHPOINT, book, id, event.id, url, [url],
                        headers, {
                            gameIds: [event.id],
                            gameTypes: [1, 4, 5],
                            jurisdictionId: 30,
                            limit: 20000,
                            leagueIds: [parseInt(id)]
                        }, "POST")
                })
                return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), bookmakerInfos)
            })
        })
}

function parseCashPointBetOffers(apiResponse) {
    if(!apiResponse.data.games) return []
    const betOffers = []
    apiResponse.data.games.forEach(event => {
        event.markets.forEach(market => {
            const betType = determineBetType(market.id)
            const line = market.anchor ? market.anchor : market.hc
            if(betType) {
                const margin = calculateMargin(market.tips.map(tip => tip.odds / 100))
                market.tips.forEach(tip => {
                    let outcome = tip.text.toUpperCase()

                    const price = tip.odds / 100
                    if(betType === BetType.OVER_UNDER || betType === BetType.OVER_UNDER_TEAM2
                        || betType === BetType.OVER_UNDER_H1 || betType === BetType.OVER_UNDER_TEAM1) {
                        outcome = outcome.includes('+') ? 'OVER' : 'UNDER'
                    }
                    betOffers.push(new BetOffer(betType, event.id, apiResponse.bookmaker, outcome, price, line, margin))
                })
            }
        })
    })

    return betOffers
}

function determineBetType(id) {
    const overUnders = [22462, 22252, 22472, 22482, 22492, 22502, 22512]
    const overUnders_1H = [22342, 22352, 22362]
    const handicaps_1H = [23482, 23462]
    const handicaps = [22272, 22282, 22292, 22302, 22312, 22322]
    if(id === 22242) return BetType._1X2
    if(id === 22332) return BetType._1X2_H1
    if(id === 22522) return BetType.DOUBLE_CHANCE
    if(id === 22262) return BetType.BOTH_TEAMS_SCORE
    if(id === 23662) return BetType.OVER_UNDER_TEAM1
    if(id === 23672) return BetType.OVER_UNDER_TEAM2
    if(id === 22532) return BetType.ODD_EVEN
    if(id === 23432) return BetType.DOUBLE_CHANCE_H1
    if(overUnders.includes(id)) return BetType.OVER_UNDER
    if(handicaps.includes(id)) return BetType.HANDICAP
    if(overUnders_1H.includes(id)) return BetType.OVER_UNDER_H1
    if(handicaps_1H.includes(id)) return BetType.HANDICAP_H1
}

exports.getCashPointEventsForCompetition = getCashPointEventsForCompetition
exports.parseCashPointBetOffers = parseCashPointBetOffers