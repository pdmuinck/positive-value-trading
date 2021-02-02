import {BookmakerId, Participant, ParticipantName} from "../domain/betoffer"

export const participantMap = {}

participantMap[ParticipantName.SINT_TRUIDEN] = ["SINT-TRUIDEN", "SINT TRUIDEN"]
participantMap[ParticipantName.CHARLEROI] = ["SPORTING DE CHARLEROI", "CHARLEROI"]
participantMap[ParticipantName.OHL] = ["OH LEUVEN", "OUD-HEVERLEE LEUVEN"]
participantMap[ParticipantName.CERCLE_BRUGGE] = ["CERCLE BRUGGE"]
participantMap[ParticipantName.CLUB_BRUGGE] = ["CLUB BRUGGE"]
participantMap[ParticipantName.OOSTENDE] = ["KV OOSTENDE", ]
participantMap[ParticipantName.STANDARD_LIEGE] = ["STANDARD DE LIEGE", "STANDARD LIEGE", "STANDARD DE LIÈGE"]
participantMap[ParticipantName.ANTWERP] = ["ROYAL ANTWERP FC", "ROYAL ANTWERP"]
participantMap[ParticipantName.WAASLAND_BEVEREN] = ["WAASLAND-BEVEREN", ]
participantMap[ParticipantName.MECHELEN] = ["KV MECHELEN", ]
participantMap[ParticipantName.EUPEN] = ["AS EUPEN", "EUPEN"]
participantMap[ParticipantName.MOESKROEN] = ["ROYAL EXCEL MOUSCRON", "MOUSCRON", "MOUSCRON PERUWELZ"]
participantMap[ParticipantName.GENK] = ["GENK", "KRC GENK"]
participantMap[ParticipantName.WAASLAND_BEVEREN] = ["WAASLAND-BEVEREN", ]
participantMap[ParticipantName.GENT] = ["GENT", "AA GENT"]
participantMap[ParticipantName.OOSTENDE] = ["OOSTENDE", "KV OOSTENDE"]
participantMap[ParticipantName.KORTRIJK] = ["KV KORTRIJK", "KORTRIJK"]
participantMap[ParticipantName.ZULTE_WAREGEM] = ["SV ZULTE-WAREGEM", "ZULTE WAREGEM"]
participantMap[ParticipantName.BEERSCHOT] = ["KFCO BEERSCHOT-WILRIJK", "BEERSCHOT"]

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