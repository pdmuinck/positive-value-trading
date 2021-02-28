export enum Bookmaker {
    UNIBET_BELGIUM= 'UNIBET_BELGIUM',
    NAPOLEON_GAMES = 'NAPOLEON_GAMES',
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
    MAGIC_BETTING = 'MAGIC_BETTING'
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