exports.ApiResponse = class ApiResponse {
    constructor(provider, data, bookmaker) {
    this.provider = provider
    this.data = data
    this.bookmaker = bookmaker
    }
}


const BetType = {
    "UNKNOWN": "UNKNOWN",
    "_1X2": "1X2",
    "_1X2_H1": "1X2_H1",
    "_1X2_H2": "1X2_H2",
    "DOUBLE_CHANCE": "DOUBLE_CHANCE",
    "DOUBLE_CHANCE_H1": "DOUBLE_CHANCE_H1",
    "DOUBLE_CHANCE_H2": "DOUBLE_CHANCE_H2",
    "DRAW_NO_BET": "DRAW_NO_BET",
    "DRAW_NO_BET_H1": "DRAW_NO_BET_H1",
    "DRAW_NO_BET_H2": "DRAW_NO_BET_H2",
    "HANDICAP": "",
    "HANDICAP_H1": "HANDICAP_H1",
    "HANDICAP_H2": "HANDICAP_H2",
    "OVER_UNDER": "OVER_UNDER",
    "OVER_UNDER_H1": "OVER_UNDER_H1",
    "OVER_UNDER_H2": "OVER_UNDER_H2",
    "TOTAL_GOALS_TEAM1": "TOTAL_GOALS_TEAM1",
    "TOTAL_GOALS_TEAM1_H1": "TOTAL_GOALS_TEAM1_H1",
    "TOTAL_GOALS_TEAM1_H2": "TOTAL_GOALS_TEAM1_H2",
    "TOTAL_GOALS_TEAM2": "TOTAL_GOALS_TEAM2",
    "TOTAL_GOALS_TEAM2_H1": "TOTAL_GOALS_TEAM2_H1",
    "TOTAL_GOALS_TEAM2_H2": "TOTAL_GOALS_TEAM2_H2",
    "ODD_EVEN": "ODD_EVEN",
    "ODD_EVEN_H1": "ODD_EVEN_H1",
    "ODD_EVEN_H2": "ODD_EVEN_H2",
    "ODD_EVEN_TEAM1": "ODD_EVEN_TEAM1",
    "ODD_EVEN_TEAM2": "ODD_EVEN_TEAM2",
    "BOTH_TEAMS_SCORE": "BOTH_TEAMS_SCORE",
    "BOTH_TEAMS_SCORE_H1": "BOTH_TEAMS_SCORE_H1",
    "BOTH_TEAMS_SCORE_H2": "BOTH_TEAMS_SCORE_H2",
    "CORRECT_SCORE": "CORRECT_SCORE",
    "CORRECT_SCORE_H1": "CORRECT_SCORE_H1",
    "CORRECT_SCORE_H2": "CORRECT_SCORE_H2"
}

Object.freeze(BetType)

class BookmakerInfo {
    constructor(provider, bookmaker, leagueId, eventId, leagueUrl, eventUrl, headers, requestBody, httpMethod) {
        this.provider = provider
        this.bookmaker = bookmaker
        this.leagueId = leagueId
        this.eventId = eventId
        this.leagueUrl = leagueUrl
        this.eventUrl = eventUrl
        this.headers = headers
        this.requestBody = requestBody
        this.httpMethod = httpMethod
    }
}

const Bookmaker = {
    "GOLDEN_PALACE": "GOLDEN_PALACE",
    "FASTBET" : "fastbet",
    "BETMOTION" : "betmotion",
    "BET99" : "BET99",
    "CORAL" : "CORAL",
    "LADBROKES_UK": "LADBROKES_UK",
    "MERKUR_SPORTS": "merkur-sports",
    "SPORTWETTEN" : "SPORTWETTEN",
    "ZETBET" : "ZETBET",
    "BWIN" : "BWIN",
    "UNIBET_BELGIUM": 'ubbe',
    "NAPOLEON_GAMES" : 'ngbe',
    "PINNACLE": 'PINNACLE',
    "BETFIRST": 'betfirst',
    "BETCENTER" : 'BETCENTER',
    "CASHPOINT" : "CASHPOINT",
    "LADBROKES" : 'LADBROKES',
    "MERIDIAN" : 'MERIDIAN',
    "BET777" : 'bet777',
    "BET90" : 'BET90',
    "MAGIC_BETTING" : 'MAGIC_BETTING',
    "STAR_CASINO" : 'STAR_CASINO',
    "SCOOORE" : 'SCOOORE',
    "CIRCUS" : 'CIRCUS',
    "STANLEYBET" : 'STANLEYBET',
    "BINGOAL" : 'BINGOAL',
    "BETRADAR" : 'BETRADAR',
    "GOLDENVEGAS" : 'GOLDENVEGAS',
    "BETWAY" : 'BETWAY',
    "TOTOLOTEK" : "totolotek"
}

Object.freeze(Bookmaker)



const Provider = {
    "ALTENAR": "ALTENAR",
    "CASHPOINT": "CASHPOINT"
}

Object.freeze(Provider)

exports.BetType = BetType
exports.Bookmaker = Bookmaker
exports.Provider = Provider
exports.BookmakerInfo = BookmakerInfo