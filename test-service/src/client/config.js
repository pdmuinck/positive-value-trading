"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sports = exports.jupilerProLeagueParticipants = void 0;
var betoffer_1 = require("../domain/betoffer");
var jupiler_pro_league_1 = require("./resources/jupiler_pro_league");
exports.jupilerProLeagueParticipants = toParticipants(jupiler_pro_league_1.jupilerProLeagueParticipantsRaw);
function toParticipants(rawData) {
    var participants = [];
    Object.keys(rawData).forEach(function (key) {
        var bookmakerIds = [];
        betoffer_1.Provider.keys().forEach(function (provider) {
            provider.bookmakers.forEach(function (bookmaker) {
                var ids = [];
                if (provider !== betoffer_1.Provider.OTHER) {
                    ids = rawData[key][provider.toString()];
                }
                else {
                    ids = rawData[key][bookmaker];
                }
                ids === null || ids === void 0 ? void 0 : ids.forEach(function (id) { return bookmakerIds.push(new betoffer_1.BookmakerId(bookmaker, id.toString(), betoffer_1.IdType.PARTICIPANT)); });
            });
        });
        participants.push(new betoffer_1.Participant(key, bookmakerIds));
    });
    return participants;
}
var eredivisieParticipants = [];
var bundesligaParticipants = [];
var laLigaParticipants = [];
var ligue1Participants = [];
var premierLeagueParticipants = [];
var serieAParticipants = [];
var footballCompetitions = [
    new betoffer_1.Competition(betoffer_1.CompetitionName.JUPILER_PRO_LEAGUE, [
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.UNIBET_BELGIUM, "1000094965", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BETFIRST, "40815", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.PINNACLE, "1817", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.GOLDEN_PALACE, "1000000490", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, "457", betoffer_1.IdType.COMPETITION)
    ], exports.jupilerProLeagueParticipants),
    new betoffer_1.Competition(betoffer_1.CompetitionName.EREDIVISIE, [
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.UNIBET_BELGIUM, "1000094980", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BETFIRST, "41372", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.PINNACLE, "1928", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.GOLDEN_PALACE, "1000000282", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, "307", betoffer_1.IdType.COMPETITION)
    ], eredivisieParticipants),
    new betoffer_1.Competition(betoffer_1.CompetitionName.BUNDESLIGA, [
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.UNIBET_BELGIUM, "1000345237", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BETFIRST, "40820", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.PINNACLE, "1842", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.GOLDEN_PALACE, "1000000279", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, "30", betoffer_1.IdType.COMPETITION)
    ], bundesligaParticipants),
    new betoffer_1.Competition(betoffer_1.CompetitionName.LA_LIGA, [
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.UNIBET_BELGIUM, "2000050115", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BETFIRST, "40031", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.PINNACLE, "2196", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.GOLDEN_PALACE, "1000000149", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, "117", betoffer_1.IdType.COMPETITION)
    ], laLigaParticipants),
    new betoffer_1.Competition(betoffer_1.CompetitionName.LIGUE_1, [
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.UNIBET_BELGIUM, "1000094991", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BETFIRST, "40032", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.PINNACLE, "2036", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.GOLDEN_PALACE, "1000000104", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, "119", betoffer_1.IdType.COMPETITION)
    ], ligue1Participants),
    new betoffer_1.Competition(betoffer_1.CompetitionName.PREMIER_LEAGUE, [
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.UNIBET_BELGIUM, "1000094985", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BETFIRST, "40253", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.PINNACLE, "1980", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.GOLDEN_PALACE, "1000000097", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, "56", betoffer_1.IdType.COMPETITION)
    ], premierLeagueParticipants),
    new betoffer_1.Competition(betoffer_1.CompetitionName.SERIE_A, [
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.UNIBET_BELGIUM, "1000095001", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BETFIRST, "40030", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.PINNACLE, "2436", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.GOLDEN_PALACE, "1000000283", betoffer_1.IdType.COMPETITION),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, "401", betoffer_1.IdType.COMPETITION)
    ], serieAParticipants)
];
exports.sports = [
    new betoffer_1.Sport(betoffer_1.SportName.FOOTBALL, [
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.UNIBET_BELGIUM, "1000093190", betoffer_1.IdType.SPORT),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.NAPOLEON_GAMES, "1000093190", betoffer_1.IdType.SPORT),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.PINNACLE, "29", betoffer_1.IdType.SPORT),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BETFIRST, "1", betoffer_1.IdType.SPORT),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET777, "1", betoffer_1.IdType.SPORT),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.GOLDEN_PALACE, "1", betoffer_1.IdType.SPORT),
        new betoffer_1.BookmakerId(betoffer_1.Bookmaker.BET90, "1", betoffer_1.IdType.SPORT)
    ], footballCompetitions)
];
