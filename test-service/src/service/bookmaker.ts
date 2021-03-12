import {IdType} from "../domain/betoffer";

export enum BetType {
    _1X2 = '1X2',
    DOUBLE_CHANCE = 'DOUBLE_CHANCE',
    OVER_UNDER = 'OVER_UNDER',
    OVER_UNDER_TEAM1 = "OVER_UNDER_TEAM1",
    OVER_UNDER_TEAM2 = "OVER_UNDER_TEAM2",
    OVER_UNDER_CORNERS = 'OVER_UNDER_CORNERS',
    HANDICAP = 'HANDICAP',
    DRAW_NO_BET = 'DRAW_NO_BET',
    BOTH_TEAMS_SCORE = 'BOTH_TEAMS_SCORE',
    _1X2_FIRST_HALF = "1X2_FIRST_HALF",
    _3_WAY_HANDICAP = "3_WAY_HANDICAP",
    CORRECT_SCORE = "CORRECT_SCORE",
    ASIAN_HANDICAP = "ASIAN_HANDICAP",
    ASIAN_OVER_UNDER = "ASIAN_OVER_UNDER",
    ODD_EVEN = "ODD_EVEN",
    ODD_EVEN_CORNERS = "ODD_EVEN_CORNERS",
    YES_NO = "YES_NO",
    UNKNOWN = 'UNKNOWN'
}

export enum Bookmaker {
    UNIBET_BELGIUM= 'ubbe',
    NAPOLEON_GAMES = 'ngbe',
    PINNACLE= 'PINNACLE',
    BETFIRST= 'betfirst',
    GOLDEN_PALACE = 'goldenpalace',
    BETCENTER = 'BETCENTER',
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
}

export enum Provider {
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
    BETCENTER = 'BETCENTER',
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
providers[Provider.BETCONSTRUCT] = [Bookmaker.CIRCUS, Bookmaker.GOLDENVEGAS]
providers[Provider.ALTENAR] = [Bookmaker.GOLDEN_PALACE]
providers[Provider.BET90] = [Bookmaker.BET90]
providers[Provider.PINNACLE] = [Bookmaker.PINNACLE]
providers[Provider.BETRADAR] = [Bookmaker.BETRADAR]
providers[Provider.BINGOAL] = [Bookmaker.BINGOAL]
providers[Provider.STANLEYBET] = [Bookmaker.STANLEYBET]
providers[Provider.STAR_CASINO] = [Bookmaker.STAR_CASINO]
providers[Provider.BETCENTER] = [Bookmaker.BETCENTER]
providers[Provider.LADBROKES] = [Bookmaker.LADBROKES]
providers[Provider.MERIDIAN] = [Bookmaker.MERIDIAN]
providers[Provider.MAGIC_BETTING] = [Bookmaker.MAGIC_BETTING]