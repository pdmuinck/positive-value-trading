import {Competition, CompetitionName, IdType, Participant, ParticipantName, Sport, SportName} from "../domain/betoffer"

import {BookmakerId, Provider, providers} from "../service/bookmaker";

import {jupilerProLeagueParticipantsRaw} from "./resources/jupiler_pro_league";

export const jupilerProLeagueParticipants: Participant[] = toParticipants(jupilerProLeagueParticipantsRaw)

function toParticipants(rawData): Participant[] {
    const participants = []
    Object.keys(rawData).forEach((key: ParticipantName) => {
        const bookmakerIds: BookmakerId[] = []
        Object.keys(providers).forEach(provider => {
            providers[provider].forEach(bookmaker => {
                let ids = []
                ids = rawData[key][bookmaker]
                ids?.forEach(id => bookmakerIds.push(
                    new BookmakerId(bookmaker, id.toString(), IdType.PARTICIPANT)))
            })
        })
        participants.push(new Participant(key, bookmakerIds))
    })
    return participants
}

const eredivisieParticipants = []
const bundesligaParticipants = []
const laLigaParticipants = []
const ligue1Participants = []
const premierLeagueParticipants = []
const serieAParticipants = []

export const footballCompetitions = [
    new Competition(
        CompetitionName.JUPILER_PRO_LEAGUE,
        [
            //new BookmakerId(Provider.KAMBI, "1000094965", IdType.COMPETITION),
            //new BookmakerId(Provider.SBTECH, "40815", IdType.COMPETITION),
            //new BookmakerId(Provider.PINNACLE, "1817", IdType.COMPETITION),
            //new BookmakerId(Provider.ALTENAR, "1000000490", IdType.COMPETITION),
            //new BookmakerId(Provider.BET90, "457", IdType.COMPETITION),
            //new BookmakerId(Provider.BETCONSTRUCT, "227875758", IdType.COMPETITION),
            //new BookmakerId(Provider.BINGOAL, "25", IdType.COMPETITION),
            //new BookmakerId(Provider.MAGIC_BETTING, "soccer-be-sb_type_19372", IdType.COMPETITION),
            //new BookmakerId(Provider.LADBROKES, "be-jupiler-league1", IdType.COMPETITION),
            //new BookmakerId(Provider.MERIDIAN, "https://meridianbet.be/sails/sport/58/region/26/league/first-division-a", IdType.COMPETITION),
            //new BookmakerId(Provider.SCOOORE, "18340", IdType.COMPETITION),
            //new BookmakerId(Provider.STANLEYBET, "38", IdType.COMPETITION),
            //new BookmakerId(Provider.STAR_CASINO, "557", IdType.COMPETITION),
            //new BookmakerId(Provider.BETCENTER, "6898", IdType.COMPETITION),
            //new BookmakerId(Provider.BWIN, "16409", IdType.COMPETITION),
            new BookmakerId(Provider.BETWAY, "first-division-a", IdType.COMPETITION),
            //new BookmakerId(Provider.ZETBET, "101-pro_league_1a", IdType.COMPETITION)
        ],
        jupilerProLeagueParticipants
    ),
    new Competition(
        CompetitionName.EREDIVISIE,
        [
            new BookmakerId(Provider.KAMBI, "1000094980", IdType.COMPETITION),
            new BookmakerId(Provider.SBTECH, "41372", IdType.COMPETITION),
            new BookmakerId(Provider.PINNACLE, "1928", IdType.COMPETITION),
            new BookmakerId(Provider.ALTENAR, "1000000282", IdType.COMPETITION),
            new BookmakerId(Provider.BET90, "307", IdType.COMPETITION),
            new BookmakerId(Provider.BETCONSTRUCT, "54375423", IdType.COMPETITION),
            new BookmakerId(Provider.BINGOAL, "24", IdType.COMPETITION),
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-nl-sb_type_19358", IdType.COMPETITION),
            new BookmakerId(Provider.LADBROKES, "nl-eredivisie1", IdType.COMPETITION),
            new BookmakerId(Provider.MERIDIAN, "https://meridianbet.be/sails/sport/58/region/25/league/eredivisie",
                IdType.COMPETITION),
            new BookmakerId(Provider.SCOOORE, "21463", IdType.COMPETITION),
            new BookmakerId(Provider.STANLEYBET, "39", IdType.COMPETITION),
            new BookmakerId(Provider.ZETBET, "102-eredivisie", IdType.COMPETITION),
            new BookmakerId(Provider.STAR_CASINO, "1957", IdType.COMPETITION),
            new BookmakerId(Provider.BETCENTER, "6931", IdType.COMPETITION),
            new BookmakerId(Provider.BWIN, "6361", IdType.COMPETITION),
            new BookmakerId(Provider.BETWAY, "eredivisie", IdType.COMPETITION)
        ],
        eredivisieParticipants
    ),
    new Competition(
        CompetitionName.BUNDESLIGA,
        [
            new BookmakerId(Provider.KAMBI, "1000345237", IdType.COMPETITION),
            new BookmakerId(Provider.SBTECH, "40820", IdType.COMPETITION),
            new BookmakerId(Provider.PINNACLE, "1842", IdType.COMPETITION),
            new BookmakerId(Provider.ALTENAR, "1000000279", IdType.COMPETITION),
            new BookmakerId(Provider.BET90, "30", IdType.COMPETITION),
            new BookmakerId(Provider.BETCONSTRUCT, "54297345", IdType.COMPETITION),
            new BookmakerId(Provider.BINGOAL, "38", IdType.COMPETITION),
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-nl-sb_type_19358", IdType.COMPETITION),
            new BookmakerId(Provider.LADBROKES, "de-bundesliga", IdType.COMPETITION),
            new BookmakerId(Provider.MERIDIAN, "https://meridianbet.be/sails/sport/58/region/2/league/bundesliga",
                IdType.COMPETITION),
            new BookmakerId(Provider.SCOOORE, "23738", IdType.COMPETITION),
            new BookmakerId(Provider.STANLEYBET, "42", IdType.COMPETITION),
            new BookmakerId(Provider.ZETBET, "268-bundesliga", IdType.COMPETITION),
            new BookmakerId(Provider.STAR_CASINO, "541", IdType.COMPETITION),
            new BookmakerId(Provider.BETCENTER, "6843", IdType.COMPETITION),
            new BookmakerId(Provider.BWIN, "43", IdType.COMPETITION),
            new BookmakerId(Provider.BETWAY, "bundesliga", IdType.COMPETITION)
        ],
        bundesligaParticipants
    ),
    new Competition(
        CompetitionName.LA_LIGA,
        [
            new BookmakerId(Provider.KAMBI, "2000050115", IdType.COMPETITION),
            new BookmakerId(Provider.SBTECH, "40031", IdType.COMPETITION),
            new BookmakerId(Provider.PINNACLE, "2196", IdType.COMPETITION),
            new BookmakerId(Provider.ALTENAR, "1000000149", IdType.COMPETITION),
            new BookmakerId(Provider.BET90, "117", IdType.COMPETITION),
            new BookmakerId(Provider.BETCONSTRUCT, "1397387603", IdType.COMPETITION),
            new BookmakerId(Provider.BINGOAL, "37", IdType.COMPETITION),
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-es-sb_type_19160", IdType.COMPETITION),
            new BookmakerId(Provider.LADBROKES, "es-liga", IdType.COMPETITION),
            new BookmakerId(Provider.MERIDIAN, "https://meridianbet.be/sails/sport/58/region/3/league/la-liga",
                IdType.COMPETITION),
            new BookmakerId(Provider.SCOOORE, "23127", IdType.COMPETITION),
            new BookmakerId(Provider.STANLEYBET, "36", IdType.COMPETITION),
            new BookmakerId(Provider.ZETBET, "306-primera_division", IdType.COMPETITION),
            new BookmakerId(Provider.STAR_CASINO, "545", IdType.COMPETITION),
            new BookmakerId(Provider.BETCENTER, "6938", IdType.COMPETITION),
            new BookmakerId(Provider.BWIN, "16108", IdType.COMPETITION),
            new BookmakerId(Provider.BETWAY, "la-liga", IdType.COMPETITION)
        ],
        laLigaParticipants
    ),
    new Competition(
        CompetitionName.LIGUE_1,
        [
            new BookmakerId(Provider.KAMBI, "1000094991", IdType.COMPETITION),
            new BookmakerId(Provider.SBTECH, "40032", IdType.COMPETITION),
            new BookmakerId(Provider.PINNACLE, "2036", IdType.COMPETITION),
            new BookmakerId(Provider.ALTENAR, "1000000104", IdType.COMPETITION),
            new BookmakerId(Provider.BET90, "119", IdType.COMPETITION),
            new BookmakerId(Provider.BETCONSTRUCT, "54287323", IdType.COMPETITION),
            new BookmakerId(Provider.BINGOAL, "26", IdType.COMPETITION),
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-fr-sb_type_19327", IdType.COMPETITION),
            new BookmakerId(Provider.LADBROKES, "fr-ligue-1", IdType.COMPETITION),
            new BookmakerId(Provider.MERIDIAN, "https://meridianbet.be/sails/sport/58/region/5/league/ligue-1",
                IdType.COMPETITION),
            new BookmakerId(Provider.SCOOORE, "23651", IdType.COMPETITION),
            new BookmakerId(Provider.STANLEYBET, "4", IdType.COMPETITION),
            new BookmakerId(Provider.ZETBET, "96-ligue_1", IdType.COMPETITION),
            new BookmakerId(Provider.STAR_CASINO, "548", IdType.COMPETITION),
            new BookmakerId(Provider.BETCENTER, "6855", IdType.COMPETITION),
            new BookmakerId(Provider.BWIN, "4131", IdType.COMPETITION),
            new BookmakerId(Provider.BETWAY, "ligue-1", IdType.COMPETITION)
        ],
        ligue1Participants
    ),
    new Competition(
        CompetitionName.PREMIER_LEAGUE,
        [
            new BookmakerId(Provider.KAMBI, "1000094985", IdType.COMPETITION),
            new BookmakerId(Provider.SBTECH, "40253", IdType.COMPETITION),
            new BookmakerId(Provider.PINNACLE, "1980", IdType.COMPETITION),
            new BookmakerId(Provider.ALTENAR, "1000000097", IdType.COMPETITION),
            new BookmakerId(Provider.BET90, "56", IdType.COMPETITION),
            new BookmakerId(Provider.BETCONSTRUCT, "54210798", IdType.COMPETITION),
            new BookmakerId(Provider.BINGOAL, "35", IdType.COMPETITION),
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-uk-sb_type_19157", IdType.COMPETITION),
            new BookmakerId(Provider.LADBROKES, "ing-premier-league", IdType.COMPETITION),
            new BookmakerId(Provider.MERIDIAN, "https://meridianbet.be/sails/sport/58/region/1/league/premier-league",
                IdType.COMPETITION),
            new BookmakerId(Provider.SCOOORE, "23104", IdType.COMPETITION),
            new BookmakerId(Provider.STANLEYBET, "1", IdType.COMPETITION),
            new BookmakerId(Provider.ZETBET, "94-premier_league", IdType.COMPETITION),
            new BookmakerId(Provider.STAR_CASINO, "538", IdType.COMPETITION),
            new BookmakerId(Provider.BETCENTER, "6823", IdType.COMPETITION),
            new BookmakerId(Provider.BWIN, "46", IdType.COMPETITION),
            new BookmakerId(Provider.BETWAY, "premier-league", IdType.COMPETITION)
        ],
        premierLeagueParticipants
    ),
    new Competition(
        CompetitionName.SERIE_A,
        [
            new BookmakerId(Provider.KAMBI, "1000095001", IdType.COMPETITION),
            new BookmakerId(Provider.SBTECH, "40030", IdType.COMPETITION),
            new BookmakerId(Provider.PINNACLE, "2436", IdType.COMPETITION),
            new BookmakerId(Provider.ALTENAR, "1000000283", IdType.COMPETITION),
            new BookmakerId(Provider.BET90, "401", IdType.COMPETITION),
            new BookmakerId(Provider.BETCONSTRUCT, "54344509", IdType.COMPETITION),
            new BookmakerId(Provider.BINGOAL, "39", IdType.COMPETITION),
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-it-sb_type_19159", IdType.COMPETITION),
            new BookmakerId(Provider.LADBROKES, "it-serie-a", IdType.COMPETITION),
            new BookmakerId(Provider.MERIDIAN, "https://meridianbet.be/sails/sport/58/region/4/league/serie-a",
                IdType.COMPETITION),
            new BookmakerId(Provider.SCOOORE, "5712", IdType.COMPETITION),
            new BookmakerId(Provider.STANLEYBET, "33", IdType.COMPETITION),
            new BookmakerId(Provider.ZETBET, "305-serie_a", IdType.COMPETITION),
            new BookmakerId(Provider.STAR_CASINO, "543", IdType.COMPETITION),
            new BookmakerId(Provider.BETCENTER, "7134", IdType.COMPETITION),
            new BookmakerId(Provider.BWIN, "42", IdType.COMPETITION),
            new BookmakerId(Provider.BETWAY, "serie-a", IdType.COMPETITION)
        ],
        serieAParticipants
    )
]

export const sports = [
    new Sport(
        SportName.FOOTBALL,
        [
            new BookmakerId(Provider.KAMBI, "1000093190", IdType.SPORT),
            new BookmakerId(Provider.PINNACLE, "29", IdType.SPORT),
            new BookmakerId(Provider.SBTECH, "1", IdType.SPORT),
            new BookmakerId(Provider.ALTENAR, "1", IdType.SPORT),
            new BookmakerId(Provider.BET90, "1", IdType.SPORT),
            new BookmakerId(Provider.BETCONSTRUCT, "844", IdType.SPORT),
            new BookmakerId(Provider.BINGOAL, "SOCCER", IdType.SPORT),
            new BookmakerId(Provider.MAGIC_BETTING, "", IdType.SPORT),
            new BookmakerId(Provider.LADBROKES, "", IdType.SPORT),
            new BookmakerId(Provider.MERIDIAN, "58", IdType.SPORT),
            new BookmakerId(Provider.SCOOORE, "", IdType.SPORT),
            new BookmakerId(Provider.STANLEYBET, "", IdType.SPORT),
            new BookmakerId(Provider.BETCENTER, "1", IdType.SPORT),
            new BookmakerId(Provider.BWIN, "4", IdType.SPORT),
            new BookmakerId(Provider.BETWAY, "soccer", IdType.SPORT),
            new BookmakerId(Provider.ZETBET, "", IdType.SPORT)
        ],
        footballCompetitions
    )
]


