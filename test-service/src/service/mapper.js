"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticipantMapper = exports.participantMap = void 0;
var betoffer_1 = require("../domain/betoffer");
exports.participantMap = {};
exports.participantMap[betoffer_1.ParticipantName.ANDERLECHT] = ["ANDERLECHT", "RSC ANDERLECHT"];
exports.participantMap[betoffer_1.ParticipantName.SINT_TRUIDEN] = ["SINT-TRUIDEN", "SINT TRUIDEN", "SINT-TRUIDENSE V.V.", "ST. TRUIDENSE VV"];
exports.participantMap[betoffer_1.ParticipantName.CHARLEROI] = ["SPORTING DE CHARLEROI", "CHARLEROI", "R. CHARLEROI S.C.", "ROYAL CHARLEROI SC"];
exports.participantMap[betoffer_1.ParticipantName.OHL] = ["OH LEUVEN", "OUD-HEVERLEE LEUVEN", "OUD-H. LEUVEN"];
exports.participantMap[betoffer_1.ParticipantName.CERCLE_BRUGGE] = ["CERCLE BRUGGE", "CERCLE BRUGGE K.S.V.", "CERCLE BR&#252;GGE"];
exports.participantMap[betoffer_1.ParticipantName.CLUB_BRUGGE] = ["CLUB BRUGGE", "CLUB BRUGGE KV", "FC BR&#252;GGE"];
exports.participantMap[betoffer_1.ParticipantName.OOSTENDE] = ["KV OOSTENDE", "K.V. OOSTENDE"];
exports.participantMap[betoffer_1.ParticipantName.STANDARD_LIEGE] = ["STANDARD DE LIEGE", "STANDARD LIEGE", "STANDARD DE LIÈGE", "STANDARD LIÈGE",
    "STANDARD L&#252;TTICH"];
exports.participantMap[betoffer_1.ParticipantName.ANTWERP] = ["ROYAL ANTWERP FC", "ROYAL ANTWERP", "ROYAL ANTWERP F.C.", "ROYAL ANTWERPEN FC"];
exports.participantMap[betoffer_1.ParticipantName.WAASLAND_BEVEREN] = ["WAASLAND-BEVEREN",];
exports.participantMap[betoffer_1.ParticipantName.MECHELEN] = ["KV MECHELEN", "K.V. MECHELEN", "YELLOW-RED KV MECHELEN"];
exports.participantMap[betoffer_1.ParticipantName.EUPEN] = ["AS EUPEN", "EUPEN", "K.A.S. EUPEN", "KAS EUPEN"];
exports.participantMap[betoffer_1.ParticipantName.MOESKROEN] = ["ROYAL EXCEL MOUSCRON", "MOUSCRON", "MOUSCRON PERUWELZ"];
exports.participantMap[betoffer_1.ParticipantName.GENK] = ["GENK", "KRC GENK", "K.R.C. GENK"];
exports.participantMap[betoffer_1.ParticipantName.WAASLAND_BEVEREN] = ["WAASLAND-BEVEREN",];
exports.participantMap[betoffer_1.ParticipantName.GENT] = ["GENT", "AA GENT", "K.A.A. GENT", "KAA GENT"];
exports.participantMap[betoffer_1.ParticipantName.OOSTENDE] = ["OOSTENDE", "KV OOSTENDE"];
exports.participantMap[betoffer_1.ParticipantName.KORTRIJK] = ["KV KORTRIJK", "KORTRIJK", "K.V. KORTRIJK"];
exports.participantMap[betoffer_1.ParticipantName.ZULTE_WAREGEM] = ["SV ZULTE-WAREGEM", "ZULTE WAREGEM", "S.V. ZULTE WAREGEM", "SV ZULTE WAREGEM"];
exports.participantMap[betoffer_1.ParticipantName.BEERSCHOT] = ["KFCO BEERSCHOT-WILRIJK", "BEERSCHOT", "K. BEERSCHOT VA", "K BEERSCHOT VA"];
var ParticipantMapper = /** @class */ (function () {
    function ParticipantMapper() {
    }
    ParticipantMapper.mapParticipants = function (participants) {
        var merged = [];
        participants.forEach(function (participant) {
            var found = merged.find(function (x) { return x.name === participant.name; });
            if (!found) {
                var bookmakerIds_1 = participant.bookmakerIds;
                participants.forEach(function (otherParticipant) {
                    if (otherParticipant.name === participant.name) {
                        bookmakerIds_1 = bookmakerIds_1.concat(otherParticipant.bookmakerIds);
                    }
                });
                var ids = Array.from(new Set(bookmakerIds_1.map(function (bookmakerId) { return bookmakerId.bookmaker; }))).map(function (bookmaker) {
                    return bookmakerIds_1.find(function (x) { return x.bookmaker === bookmaker; });
                });
                merged.push(new betoffer_1.Participant(participant.name, ids));
            }
        });
        return merged;
    };
    return ParticipantMapper;
}());
exports.ParticipantMapper = ParticipantMapper;
