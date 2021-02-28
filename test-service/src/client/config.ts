import {
    Bookmaker,
    BookmakerId,
    Competition,
    CompetitionName,
    IdType,
    Participant,
    ParticipantName,
    Provider,
    Sport,
    SportName
} from "../domain/betoffer"

import {jupilerProLeagueParticipantsRaw} from "./resources/jupiler_pro_league";

export const jupilerProLeagueParticipants: Participant[] = toParticipants(jupilerProLeagueParticipantsRaw)

function toParticipants(rawData): Participant[] {
    const participants = []
    Object.keys(rawData).forEach((key: ParticipantName) => {
        const bookmakerIds: BookmakerId[] = []
        Provider.keys().forEach(provider => {
            provider.bookmakers.forEach(bookmaker => {
                let ids = []
                if(provider !== Provider.OTHER) {
                    ids = rawData[key][provider.toString()]
                } else {
                    ids = rawData[key][bookmaker]
                }
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

const footballCompetitions = [
    new Competition(
        CompetitionName.JUPILER_PRO_LEAGUE,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000094965", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "40815", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "1817", IdType.COMPETITION),
            new BookmakerId(Bookmaker.GOLDEN_PALACE, "1000000490", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BET90, "457", IdType.COMPETITION),
            new BookmakerId(Bookmaker.CIRCUS, "227875758", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BINGOAL, "25", IdType.COMPETITION),
            new BookmakerId(Bookmaker.MAGIC_BETTING, "soccer-be-sb_type_19372", IdType.COMPETITION)
        ],
        jupilerProLeagueParticipants
    ),
    new Competition(
        CompetitionName.EREDIVISIE,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000094980", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "41372", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "1928", IdType.COMPETITION),
            new BookmakerId(Bookmaker.GOLDEN_PALACE, "1000000282", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BET90, "307", IdType.COMPETITION),
            new BookmakerId(Bookmaker.CIRCUS, "54375423", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BINGOAL, "24", IdType.COMPETITION),
            new BookmakerId(Bookmaker.MAGIC_BETTING, "soccer-nl-sb_type_19358", IdType.COMPETITION)
        ],
        eredivisieParticipants
    ),
    new Competition(
        CompetitionName.BUNDESLIGA,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000345237", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "40820", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "1842", IdType.COMPETITION),
            new BookmakerId(Bookmaker.GOLDEN_PALACE, "1000000279", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BET90, "30", IdType.COMPETITION),
            new BookmakerId(Bookmaker.CIRCUS, "54297345", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BINGOAL, "38", IdType.COMPETITION),
            new BookmakerId(Bookmaker.MAGIC_BETTING, "soccer-nl-sb_type_19358", IdType.COMPETITION)
        ],
        bundesligaParticipants
    ),
    new Competition(
        CompetitionName.LA_LIGA,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "2000050115", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "40031", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "2196", IdType.COMPETITION),
            new BookmakerId(Bookmaker.GOLDEN_PALACE, "1000000149", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BET90, "117", IdType.COMPETITION),
            new BookmakerId(Bookmaker.CIRCUS, "1397387603", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BINGOAL, "37", IdType.COMPETITION),
            new BookmakerId(Bookmaker.MAGIC_BETTING, "soccer-es-sb_type_19160", IdType.COMPETITION)
        ],
        laLigaParticipants
    ),
    new Competition(
        CompetitionName.LIGUE_1,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000094991", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "40032", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "2036", IdType.COMPETITION),
            new BookmakerId(Bookmaker.GOLDEN_PALACE, "1000000104", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BET90, "119", IdType.COMPETITION),
            new BookmakerId(Bookmaker.CIRCUS, "54287323", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BINGOAL, "26", IdType.COMPETITION),
            new BookmakerId(Bookmaker.MAGIC_BETTING, "soccer-fr-sb_type_19327", IdType.COMPETITION)
        ],
        ligue1Participants
    ),
    new Competition(
        CompetitionName.PREMIER_LEAGUE,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000094985", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "40253", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "1980", IdType.COMPETITION),
            new BookmakerId(Bookmaker.GOLDEN_PALACE, "1000000097", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BET90, "56", IdType.COMPETITION),
            new BookmakerId(Bookmaker.CIRCUS, "54210798", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BINGOAL, "35", IdType.COMPETITION),
            new BookmakerId(Bookmaker.MAGIC_BETTING, "soccer-uk-sb_type_19157", IdType.COMPETITION)
        ],
        premierLeagueParticipants
    ),
    new Competition(
        CompetitionName.SERIE_A,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000095001", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "40030", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "2436", IdType.COMPETITION),
            new BookmakerId(Bookmaker.GOLDEN_PALACE, "1000000283", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BET90, "401", IdType.COMPETITION),
            new BookmakerId(Bookmaker.CIRCUS, "54344509", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BINGOAL, "39", IdType.COMPETITION),
            new BookmakerId(Bookmaker.MAGIC_BETTING, "soccer-it-sb_type_19159", IdType.COMPETITION)
        ],
        serieAParticipants
    )
]

export const sports = [
    new Sport(
        SportName.FOOTBALL,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000093190", IdType.SPORT),
            new BookmakerId(Bookmaker.NAPOLEON_GAMES, "1000093190", IdType.SPORT),
            new BookmakerId(Bookmaker.PINNACLE, "29", IdType.SPORT),
            new BookmakerId(Bookmaker.BETFIRST, "1", IdType.SPORT),
            new BookmakerId(Bookmaker.BET777, "1", IdType.SPORT),
            new BookmakerId(Bookmaker.GOLDEN_PALACE, "1", IdType.SPORT),
            new BookmakerId(Bookmaker.BET90, "1", IdType.SPORT),
            new BookmakerId(Bookmaker.CIRCUS, "844", IdType.SPORT),
            new BookmakerId(Bookmaker.BINGOAL, "SOCCER", IdType.SPORT),
            new BookmakerId(Bookmaker.MAGIC_BETTING, "", IdType.SPORT),
            new BookmakerId(Bookmaker.GOLDENVEGAS, "844", IdType.SPORT)
        ],
        footballCompetitions
    )
]


