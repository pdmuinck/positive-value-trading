import {BookmakerId, Participant, ParticipantName} from "../domain/betoffer"

export const participantMap = {}

participantMap[ParticipantName.ANDERLECHT] = ["ANDERLECHT", "RSC ANDERLECHT"]
participantMap[ParticipantName.SINT_TRUIDEN] = ["SINT-TRUIDEN", "SINT TRUIDEN", "SINT-TRUIDENSE V.V.", "ST. TRUIDENSE VV"]
participantMap[ParticipantName.CHARLEROI] = ["SPORTING DE CHARLEROI", "CHARLEROI", "R. CHARLEROI S.C.", "ROYAL CHARLEROI SC"]
participantMap[ParticipantName.OHL] = ["OH LEUVEN", "OUD-HEVERLEE LEUVEN", "OUD-H. LEUVEN"]
participantMap[ParticipantName.CERCLE_BRUGGE] = ["CERCLE BRUGGE", "CERCLE BRUGGE K.S.V.", "CERCLE BR&#252;GGE"]
participantMap[ParticipantName.CLUB_BRUGGE] = ["CLUB BRUGGE", "CLUB BRUGGE KV", "FC BR&#252;GGE"]
participantMap[ParticipantName.OOSTENDE] = ["KV OOSTENDE", "K.V. OOSTENDE"]
participantMap[ParticipantName.STANDARD_LIEGE] = ["STANDARD DE LIEGE", "STANDARD LIEGE", "STANDARD DE LIÈGE", "STANDARD LIÈGE",
    "STANDARD L&#252;TTICH"]
participantMap[ParticipantName.ANTWERP] = ["ROYAL ANTWERP FC", "ROYAL ANTWERP", "ROYAL ANTWERP F.C.", "ROYAL ANTWERPEN FC"]
participantMap[ParticipantName.WAASLAND_BEVEREN] = ["WAASLAND-BEVEREN", ]
participantMap[ParticipantName.MECHELEN] = ["KV MECHELEN", "K.V. MECHELEN", "YELLOW-RED KV MECHELEN"]
participantMap[ParticipantName.EUPEN] = ["AS EUPEN", "EUPEN", "K.A.S. EUPEN", "KAS EUPEN"]
participantMap[ParticipantName.MOESKROEN] = ["ROYAL EXCEL MOUSCRON", "MOUSCRON", "MOUSCRON PERUWELZ"]
participantMap[ParticipantName.GENK] = ["GENK", "KRC GENK", "K.R.C. GENK"]
participantMap[ParticipantName.WAASLAND_BEVEREN] = ["WAASLAND-BEVEREN", ]
participantMap[ParticipantName.GENT] = ["GENT", "AA GENT", "K.A.A. GENT", "KAA GENT"]
participantMap[ParticipantName.OOSTENDE] = ["OOSTENDE", "KV OOSTENDE"]
participantMap[ParticipantName.KORTRIJK] = ["KV KORTRIJK", "KORTRIJK", "K.V. KORTRIJK"]
participantMap[ParticipantName.ZULTE_WAREGEM] = ["SV ZULTE-WAREGEM", "ZULTE WAREGEM", "S.V. ZULTE WAREGEM", "SV ZULTE WAREGEM"]
participantMap[ParticipantName.BEERSCHOT] = ["KFCO BEERSCHOT-WILRIJK", "BEERSCHOT", "K. BEERSCHOT VA", "K BEERSCHOT VA"]

export class ParticipantMapper {
    static mapParticipants(participants: Participant[]): Participant[]{
        const merged: Participant[] = []
        participants.forEach(participant => {
            const found = merged.find(x => x.name === participant.name)
            if(!found) {
                let bookmakerIds = participant.bookmakerIds
                participants.forEach(otherParticipant => {
                    if(otherParticipant.name === participant.name) {
                        bookmakerIds = bookmakerIds.concat(otherParticipant.bookmakerIds)
                    }
                })
                const ids: BookmakerId[] = Array.from(new Set(bookmakerIds.map(bookmakerId => bookmakerId.bookmaker))).map(bookmaker => {
                    return bookmakerIds.find(x => x.bookmaker === bookmaker)
                })
                merged.push(new Participant(participant.name, ids))
            }
        })
        return merged
    }
}