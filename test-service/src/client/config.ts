import {
    Bookmaker,
    BookmakerId,
    Competition,
    CompetitionName,
    IdType,
    Participant,
    ParticipantName,
    Sport,
    SportName
} from "../domain/betoffer";

export const jupilerProLeagueParticipants = [
    new Participant(ParticipantName.CLUB_BRUGGE, [
        new BookmakerId(Bookmaker.UNIBET_BELGIUM, "123", IdType.PARTICIPANT),
        new BookmakerId(Bookmaker.NAPOLEON_GAMES, "123", IdType.PARTICIPANT),
        new BookmakerId(Bookmaker.PINNACLE, "3489379", IdType.PARTICIPANT),
    ]),
    new Participant(ParticipantName.ANDERLECHT, [
        new BookmakerId(Bookmaker.UNIBET_BELGIUM, "333", IdType.PARTICIPANT),
        new BookmakerId(Bookmaker.NAPOLEON_GAMES, "333", IdType.PARTICIPANT),
        new BookmakerId(Bookmaker.PINNACLE, "9398479", IdType.PARTICIPANT),
    ])
]

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
            new BookmakerId(Bookmaker.PINNACLE, "1817", IdType.COMPETITION)
        ],
        jupilerProLeagueParticipants
    ),
    new Competition(
        CompetitionName.EREDIVISIE,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000094980", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "41372", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "1928", IdType.COMPETITION)
        ],
        eredivisieParticipants
    ),
    new Competition(
        CompetitionName.BUNDESLIGA,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000345237", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "40820", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "1842", IdType.COMPETITION)
        ],
        bundesligaParticipants
    ),
    new Competition(
        CompetitionName.LA_LIGA,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "2000050115", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "40031", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "2196", IdType.COMPETITION)
        ],
        laLigaParticipants
    ),
    new Competition(
        CompetitionName.LIGUE_1,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000094991", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "40032", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "2036", IdType.COMPETITION)
        ],
        ligue1Participants
    ),
    new Competition(
        CompetitionName.PREMIER_LEAGUE,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000094985", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "40253", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "1980", IdType.COMPETITION)
        ],
        premierLeagueParticipants
    ),
    new Competition(
        CompetitionName.SERIE_A,
        [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1000095001", IdType.COMPETITION),
            new BookmakerId(Bookmaker.BETFIRST, "40030", IdType.COMPETITION),
            new BookmakerId(Bookmaker.PINNACLE, "2436", IdType.COMPETITION)
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
            new BookmakerId(Bookmaker.BET777, "1", IdType.SPORT)
        ],
        footballCompetitions
    )
]


