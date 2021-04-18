import {IdType} from "../domain/betoffer";

export enum Period {
    _O= "FULL_GAME",
    _1="FIRST_PERIOD",
    _2 = "SECOND_PERIOD"
}

export class BetLine {
    private readonly _betType: BetType
    private readonly _line: number

    constructor(betType: BetType, line?: number) {
        this._betType = betType
        this._line = line
    }

    get betType() {
        return this._betType
    }

    get line() {
        return this._line
    }
}

export enum BetType {
    ODD_EVEN_TEAMS = "ODD_EVEN_TEAMS",
    TOTAL_GOALS_TEAM2_H2= "TOTAL_GOALS_TEAM2_H2",
    TOTAL_GOALS_TEAM1_H1 = "TOTAL_GOALS_TEAM1_H1",
    TOTAL_GOALS_TEAM2_H1 = "TOTAL_GOALS_TEAM2_H1",
    TOTAL_GOALS_TEAM1_H2 = "TOTAL_GOALS_TEAM1_H2",
    WIN_TO_NIL = "WIN_TO_NIL",
    TO_WIN_FROM_BEHIND = "TO_WIN_FROM_BEHIND",
    _1X2 = '1X2',
    DOUBLE_CHANCE = 'DOUBLE_CHANCE',
    OVER_UNDER = 'OVER_UNDER',
    OVER_UNDER_TEAM1 = "OVER_UNDER_TEAM1",
    OVER_UNDER_TEAM2 = "OVER_UNDER_TEAM2",
    OVER_UNDER_TEAM = "OVER_UNDER_TEAM",
    OVER_UNDER_CORNERS = 'OVER_UNDER_CORNERS',
    HANDICAP = 'HANDICAP',
    DRAW_NO_BET = 'DRAW_NO_BET',
    BOTH_TEAMS_SCORE = 'BOTH_TEAMS_SCORE',
    _1X2_H1 = "1X2_H1",
    _3_WAY_HANDICAP = "3_WAY_HANDICAP",
    CORRECT_SCORE = "CORRECT_SCORE",
    ASIAN_HANDICAP = "ASIAN_HANDICAP",
    ASIAN_HANDICAP_H1 = "ASIAN_HANDICAP_H1",
    ASIAN_OVER_UNDER = "ASIAN_OVER_UNDER",
    ASIAN_OVER_UNDER_H1 = "ASIAN_OVER_UNDER_h1",
    ODD_EVEN = "ODD_EVEN",
    ODD_EVEN_CORNERS = "ODD_EVEN_CORNERS",
    YES_NO = "YES_NO",
    DOUBLE_CHANCE_H1 = "DOUBLE_CHANCE_H1",
    OVER_UNDER_H1 = "OVER_UNDER_H1",
    HANDICAP_H1 = "HANDICAP_H1",
    HALF_TIME_FULL_TIME = "HALF_TIME_FULL_TIME",
    BOTH_TEAMS_SCORE_H1 = "BOTH_TEAMS_SCORE_H1",
    OVER_UNDER_TEAM1_H1 = "OVER_UNDER_TEAM1_H1",
    OVER_UNDER_TEAM2_H1 = "OVER_UNDER_TEAM2_H1",
    OVER_UNDER_TEAM1_H2 = "OVER_UNDER_TEAM1_H2",
    OVER_UNDER_TEAM2_H2 = "OVER_UNDER_TEAM2_H2",
    EXACT_GOALS = "EXACT_GOALS",
    ODD_EVEN_TEAM1 = "ODD_EVEN_TEAM1",
    ODD_EVEN_TEAM2 = "ODD_EVEN_TEAM2",
    ODD_EVEN_TEAMS_H1 = "ODD_EVEN_TEAMS_H1",
    ODD_EVEN_TEAMS_H2 = "ODD_EVEN_TEAMS_H2",
    DRAW_NO_BET_H1 = "DRAW_NO_BET_H1",
    HANDICAP_H2 = "HANDICAP_H2",
    UNKNOWN = 'UNKNOWN',
    CORRECT_SCORE_H2 ="CORRECT_SCORE_H2",
    BOTH_TEAMS_SCORE_H2 = "BOTH_TEAMS_SCORE_H2",
    ODD_EVEN_H2 = "ODD_EVEN_H2",
    EXACT_GOALS_H2 = "EXACT_GOALS_H2",
    OVER_UNDER_H2 = "OVER_UNDER_H2",
    DRAW_NO_BET_H2 = "DRAW_NO_BET_H2",
    DOUBLE_CHANCE_H2 = "DOUBLE_CHANCE_H2",
    _1X2_H2 = "1X2_H2",
    CORRECT_SCORE_H1 = "CORRECT_SCORE_H1",
    ODD_EVEN_H1 = "ODD_EVEN_H1",
    _3_WAY_HANDICAP_H2 = "3_WAY_HANDICAP_H2",
    _3_WAY_HANDICAP_H1 = "3_WAY_HANDICAP_H1",
    TOTAL_GOALS = "TOTAL_GOALS",
    TOTAL_GOALS_H1 = "TOTAL_GOALS_H1",
    TOTAL_GOALS_H2 = "TOTAL_GOALS_H2",
    TOTAL_GOALS_TEAM1 = "TOTAL_GOALS_TEAM1",
    TOTAL_GOALS_TEAM2 = "TOTAL_GOALS_TEAM2",
    ASIAN_HANDICAP_H2 = "ASIAN_HANDICAP_H2"
}

export enum Bookmaker {
    FASTBET = "fastbet",
    BETMOTION = "betmotion",
    BET99 = "BET99",
    CORAL = "CORAL",
    LADBROKES_UK= "LADBROKES_UK",
    MERKUR_SPORTS= "merkur-sports",
    SPORTWETTEN = "SPORTWETTEN",
    ZETBET = "ZETBET",
    BWIN = "BWIN",
    UNIBET_BELGIUM= 'ubbe',
    NAPOLEON_GAMES = 'ngbe',
    PINNACLE= 'PINNACLE',
    BETFIRST= 'betfirst',
    GOLDEN_PALACE = 'goldenpalace',
    BETCENTER = 'BETCENTER',
    CASHPOINT = "CASHPOINT",
    LADBROKES = 'LADBROKES',
    MERIDIAN = 'MERIDIAN',
    BET777 = 'bet777',
    BET90 = 'BET90',
    MAGIC_BETTING = 'MAGIC_BETTING',
    STAR_CASINO = 'STAR_CASINO',
    SCOOORE = 'SCOOORE',
    CIRCUS = 'CIRCUS',
    STANLEYBET = 'STANLEYBET',
    BINGOAL = 'BINGOAL',
    BETRADAR = 'BETRADAR',
    GOLDENVEGAS = 'GOLDENVEGAS',
    BETWAY = 'BETWAY',
    TOTOLOTEK = "totolotek"
}

export enum Provider {
    CASHPOINT = "CASHPOINT",
    KAMBI = 'KAMBI',
    SBTECH = 'SBTECH',
    BETCONSTRUCT = 'BETCONSTRUCT',
    ALTENAR = 'ALTENAR',
    PINNACLE = 'PINNACLE',
    BET90 = 'BET90',
    BETRADAR = 'BETRADAR',
    BINGOAL = 'BINGOAL',
    STANLEYBET = 'STANLEYBET',
    STAR_CASINO = 'STAR_CASINO',
    LADBROKES = 'LADBROKES',
    MERIDIAN = 'MERIDIAN',
    MAGIC_BETTING = 'MAGIC_BETTING',
    SCOOORE = 'SCOOORE',
    BWIN = 'BWIN',
    BETWAY = 'BETWAY',
    ZETBET = 'ZETBET'
}

export class BookmakerId {
    private readonly _id: string
    private readonly _idType: IdType
    private readonly _provider: Provider

    constructor(provider: Provider, id: string, idType: IdType){
        this._id = id
        this._idType = idType
        this._provider = provider
    }

    get id(){
        return this._id
    }

    get idType() {
        return this._idType
    }

    get provider() {
        return this._provider
    }
}

export const providers = {}
providers[Provider.KAMBI] = [Bookmaker.NAPOLEON_GAMES, Bookmaker.UNIBET_BELGIUM]
providers[Provider.SBTECH] = [Bookmaker.BET777, Bookmaker.BETFIRST]
providers[Provider.BETCONSTRUCT] = [Bookmaker.CIRCUS, Bookmaker.GOLDENVEGAS, Bookmaker.SPORTWETTEN]
providers[Provider.ALTENAR] = [Bookmaker.GOLDEN_PALACE]
providers[Provider.BET90] = [Bookmaker.BET90]
providers[Provider.PINNACLE] = [Bookmaker.PINNACLE]
providers[Provider.BETRADAR] = [Bookmaker.BETRADAR]
providers[Provider.BINGOAL] = [Bookmaker.BINGOAL]
providers[Provider.STANLEYBET] = [Bookmaker.STANLEYBET]
providers[Provider.STAR_CASINO] = [Bookmaker.STAR_CASINO]
providers[Provider.CASHPOINT] = [Bookmaker.BETCENTER, Bookmaker.CASHPOINT, Bookmaker.MERKUR_SPORTS, Bookmaker.TOTOLOTEK]
providers[Provider.LADBROKES] = [Bookmaker.LADBROKES]
providers[Provider.MERIDIAN] = [Bookmaker.MERIDIAN]
providers[Provider.MAGIC_BETTING] = [Bookmaker.MAGIC_BETTING]