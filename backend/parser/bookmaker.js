class ApiResponse {
    constructor(provider, data, bookmaker) {
        this.provider = provider
        this.data = data
        this.bookmaker = bookmaker
    }
}


const BetType = {
    "UNKNOWN": "UNKNOWN",
    "_1X2": {name: "1X2", sortIndex: 0},
    "_1X2_H1": {name: "1X2_H1", sortIndex: 1},
    "_1X2_H2": {name: "1X2_H2", sortIndex: 2},
    "DOUBLE_CHANCE": {name: "DOUBLE_CHANCE", sortIndex: 3},
    "DOUBLE_CHANCE_H1": {name: "DOUBLE_CHANCE_H1", sortIndex: 4},
    "DOUBLE_CHANCE_H2": {name: "DOUBLE_CHANCE_H2", sortIndex: 5},
    "DRAW_NO_BET": {name: "DRAW_NO_BET", sortIndex: 6},
    "DRAW_NO_BET_H1": {name: "DRAW_NO_BET_H1", sortIndex: 7},
    "DRAW_NO_BET_H2": {name: "DRAW_NO_BET_H2", sortIndex: 8},
    "HANDICAP": {name: "HANDICAP", sortIndex: 9},
    "HANDICAP_H1": {name: "HANDICAP_H1", sortIndex: 10},
    "HANDICAP_H2": {name: "HANDICAP_H2", sortIndex: 11},
    "OVER_UNDER": {name: "OVER_UNDER", sortIndex: 12},
    "OVER_UNDER_H1": {name: "OVER_UNDER_H1", sortIndex: 13},
    "OVER_UNDER_H2": {name: "OVER_UNDER_H2", sortIndex: 14},
    "TOTAL_GOALS_TEAM1": {name: "TOTAL_GOALS_TEAM1", sortIndex: 15},
    "TOTAL_GOALS_TEAM1_H1": {name: "TOTAL_GOALS_TEAM1_H1", sortIndex: 16},
    "TOTAL_GOALS_TEAM1_H2": {name: "TOTAL_GOALS_TEAM1_H2", sortIndex: 17},
    "TOTAL_GOALS_TEAM2": {name: "TOTAL_GOALS_TEAM2", sortIndex: 18},
    "TOTAL_GOALS_TEAM2_H1": {name: "TOTAL_GOALS_TEAM2_H1", sortIndex: 19},
    "TOTAL_GOALS_TEAM2_H2": {name: "TOTAL_GOALS_TEAM2_H2", sortIndex: 20},
    "ODD_EVEN": {name: "ODD_EVEN", sortIndex: 21},
    "ODD_EVEN_H1": {name: "ODD_EVEN_H1", sortIndex: 22},
    "ODD_EVEN_H2": {name: "ODD_EVEN_H2", sortIndex: 23},
    "ODD_EVEN_TEAM1": {name: "ODD_EVEN_TEAM1", sortIndex: 24},
    "ODD_EVEN_TEAM2": {name: "ODD_EVEN_TEAM2", sortIndex: 25},
    "BOTH_TEAMS_SCORE": {name: "BOTH_TEAMS_SCORE", sortIndex: 26},
    "BOTH_TEAMS_SCORE_H1": {name: "BOTH_TEAMS_SCORE_H1", sortIndex: 27},
    "BOTH_TEAMS_SCORE_H2": {name: "BOTH_TEAMS_SCORE_H2", sortIndex: 28},
    "CORRECT_SCORE": {name: "CORRECT_SCORE", sortIndex: 29},
    "CORRECT_SCORE_H1": {name: "CORRECT_SCORE_H1", sortIndex: 30},
    "CORRECT_SCORE_H2": {name: "CORRECT_SCORE_H2", sortIndex: 31},
    "ASIAN_HANDICAP": {name: "ASIAN_HANDICAP", sortIndex: 32}
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
    "PLAYTECH" : "PLAYTECH",
    "CASHPOINT" : "CASHPOINT",
    "KAMBI" : 'KAMBI',
    "SBTECH" : 'SBTECH',
    "BETCONSTRUCT" : 'BETCONSTRUCT',
    "ALTENAR" : 'ALTENAR',
    "PINNACLE" : 'PINNACLE',
    "BET90" : 'BET90',
    "BETRADAR" : 'BETRADAR',
    "BINGOAL" : 'BINGOAL',
    "STANLEYBET" : 'STANLEYBET',
    "STAR_CASINO" : 'STAR_CASINO',
    "LADBROKES" : 'LADBROKES',
    "MERIDIAN" : 'MERIDIAN',
    "MAGIC_BETTING" : 'MAGIC_BETTING',
    "SCOOORE" : 'SCOOORE',
    "BWIN" : 'BWIN',
    "BETWAY" : 'BETWAY',
    "ZETBET" : 'ZETBET'
}

Object.freeze(Provider)

exports.BetType = BetType
exports.Bookmaker = Bookmaker
exports.Provider = Provider
exports.BookmakerInfo = BookmakerInfo
exports.ApiResponse = ApiResponse