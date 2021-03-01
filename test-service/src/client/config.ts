import {
    Competition,
    CompetitionName,
    IdType,
    Participant,
    ParticipantName,
    Sport,
    SportName
} from "../domain/betoffer"

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
            new BookmakerId(Provider.KAMBI, "1000094965", IdType.COMPETITION),
            new BookmakerId(Provider.SBTECH, "40815", IdType.COMPETITION),
            new BookmakerId(Provider.PINNACLE, "1817", IdType.COMPETITION),
            new BookmakerId(Provider.ALTENAR, "1000000490", IdType.COMPETITION),
            new BookmakerId(Provider.BET90, "457", IdType.COMPETITION),
            new BookmakerId(Provider.BETCONSTRUCT, "227875758", IdType.COMPETITION),
            new BookmakerId(Provider.BINGOAL, "25", IdType.COMPETITION),
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-be-sb_type_19372", IdType.COMPETITION)
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
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-nl-sb_type_19358", IdType.COMPETITION)
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
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-nl-sb_type_19358", IdType.COMPETITION)
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
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-es-sb_type_19160", IdType.COMPETITION)
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
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-fr-sb_type_19327", IdType.COMPETITION)
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
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-uk-sb_type_19157", IdType.COMPETITION)
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
            new BookmakerId(Provider.MAGIC_BETTING, "soccer-it-sb_type_19159", IdType.COMPETITION)
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
        ],
        footballCompetitions
    )
]


