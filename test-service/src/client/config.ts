import {BookMaker, Participant, Provider, Sport, SportCompetition} from "../domain/betoffer";

const competitions = {}
competitions[Sport.FOOTBALL] = {}
competitions[Sport.FOOTBALL][SportCompetition.JUPILER_PRO_LEAGUE] = {}
competitions[Sport.FOOTBALL][SportCompetition.EREDIVISIE] = {}
competitions[Sport.FOOTBALL][SportCompetition.PREMIER_LEAGUE] = {}
competitions[Sport.FOOTBALL][SportCompetition.SERIE_A] = {}
competitions[Sport.FOOTBALL][SportCompetition.LIGUE_1] = {}
competitions[Sport.FOOTBALL][SportCompetition.BUNDESLIGA] = {}
competitions[Sport.FOOTBALL][SportCompetition.LA_LIGA] = {}

competitions[Sport.FOOTBALL][SportCompetition.JUPILER_PRO_LEAGUE][Provider.KAMBI] = 1000094965
competitions[Sport.FOOTBALL][SportCompetition.EREDIVISIE][Provider.KAMBI] = 1000094980
competitions[Sport.FOOTBALL][SportCompetition.PREMIER_LEAGUE][Provider.KAMBI] = 1000094985
competitions[Sport.FOOTBALL][SportCompetition.SERIE_A][Provider.KAMBI] = 1000095001
competitions[Sport.FOOTBALL][SportCompetition.LIGUE_1][Provider.KAMBI] = 1000094991
competitions[Sport.FOOTBALL][SportCompetition.BUNDESLIGA][Provider.KAMBI] = 1000345237
competitions[Sport.FOOTBALL][SportCompetition.LA_LIGA][Provider.KAMBI] = 2000050115

competitions[Sport.FOOTBALL][SportCompetition.JUPILER_PRO_LEAGUE][Provider.SBTECH] = 40815
competitions[Sport.FOOTBALL][SportCompetition.EREDIVISIE][Provider.SBTECH] = 41372
competitions[Sport.FOOTBALL][SportCompetition.PREMIER_LEAGUE][Provider.SBTECH] = 40253
competitions[Sport.FOOTBALL][SportCompetition.SERIE_A][Provider.SBTECH] = 40030
competitions[Sport.FOOTBALL][SportCompetition.LIGUE_1][Provider.SBTECH] = 40032
competitions[Sport.FOOTBALL][SportCompetition.BUNDESLIGA][Provider.SBTECH] = 40820
competitions[Sport.FOOTBALL][SportCompetition.LA_LIGA][Provider.SBTECH] = 40031

competitions[Sport.FOOTBALL][SportCompetition.JUPILER_PRO_LEAGUE][BookMaker.PINNACLE] = 40815
competitions[Sport.FOOTBALL][SportCompetition.EREDIVISIE][BookMaker.PINNACLE] = 41372
competitions[Sport.FOOTBALL][SportCompetition.PREMIER_LEAGUE][BookMaker.PINNACLE] = 40253
competitions[Sport.FOOTBALL][SportCompetition.SERIE_A][BookMaker.PINNACLE] = 40030
competitions[Sport.FOOTBALL][SportCompetition.LIGUE_1][BookMaker.PINNACLE] = 40032
competitions[Sport.FOOTBALL][SportCompetition.BUNDESLIGA][BookMaker.PINNACLE] = 40820
competitions[Sport.FOOTBALL][SportCompetition.LA_LIGA][BookMaker.PINNACLE] = 40031

export class BookmakerSportMap {
    private readonly _sport: Sport
    private readonly _competitions: BookmakerCompetitionMap[]

    constructor(sport: Sport, competitions: BookmakerCompetitionMap[]) {
        this._sport = sport
        this._competitions = competitions
    }

    get sport() {
        return this._sport
    }

    get competitions() {
        return this._competitions
    }
}

export class BookmakerCompetitionMap {
    private readonly _competition: SportCompetition
    private readonly _bookmakerIds
    private readonly _participants: BookmakerParticipantMap[]

    constructor(competition: SportCompetition, bookmakerIds, participants: BookmakerParticipantMap[]){
        this._competition = competition
        this._bookmakerIds = bookmakerIds
        this._participants = participants
    }

    get bookmakerIds() {
        return this._bookmakerIds
    }

    get participants() {
        return this._participants
    }

    get competition() {
        return this._competition
    }
}

export class BookmakerParticipantMap {
    private readonly _participant: Participant
    private readonly _bookmakerIds

    constructor(participant: Participant, bookmakerIds) {
        this._participant = participant
        this._bookmakerIds = bookmakerIds
    }

    get participant() {
        return this._participant
    }

    get bookmakerIds() {
        return this._bookmakerIds
    }
}

const bookmakerMaps: BookmakerSportMap[] = [
        new BookmakerSportMap(
        Sport.FOOTBALL,
        [
            new BookmakerCompetitionMap(
                SportCompetition.JUPILER_PRO_LEAGUE,
                competitions[Sport.FOOTBALL][SportCompetition.JUPILER_PRO_LEAGUE],
                [
                    new BookmakerParticipantMap(
                        new Participant("CLUB_BRUGGE"),
                        {}
                    )
                ]
            )
        ]
    )
]



export {
    bookmakerMaps
}

