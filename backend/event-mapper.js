const {getKambiEventsForCompetition, getBwinEventsForCompetition, getBingoalEventsForCompetition,
    getAltenarEventsForCompetition, getBetwayEventsForCompetition, getCashPointEventsForCompetition,
    getLadbrokesEventsForCompetition, getMeridianEventsForCompetition, getSbtechEventsForCompetition,
    getScoooreEventsForCompetition, getStanleybetEventsForCompetition, getZetBetEventsForCompetition,
    getPinnacleEventsForCompetition} = require("./books")
const {getSportRadarMatch} = require("./sportradar");
const {Event} = require("./event")

const requests = {
    /*
    "JUPILER_PRO_LEAGUE": [
        getAltenarEventsForCompetition("1000000490"),
        getBetwayEventsForCompetition("belgium", "first-division-a"),
        getBingoalEventsForCompetition("25"),
        getCashPointEventsForCompetition("6898"),
        getBwinEventsForCompetition("16409"),
        getKambiEventsForCompetition("1000094965"),
        getLadbrokesEventsForCompetition("be-jupiler-league1"),
        getMeridianEventsForCompetition("https://meridianbet.be/sails/sport/58/region/26/league/first-division-a"),
        getSbtechEventsForCompetition("40815"),
        getScoooreEventsForCompetition("18340"),
        getStanleybetEventsForCompetition("38"),
        getZetBetEventsForCompetition("101-pro_league_1a"),
    ],

     */
    "EURO2020": [
        //getAltenarEventsForCompetition("3031"),
        //getBetwayEventsForCompetition("matches", "euro-2020"),

        //getBingoalEventsForCompetition("9153"),
        //getCashPointEventsForCompetition("6898"),
        //getBwinEventsForCompetition("16409"),

        //getKambiEventsForCompetition("2000123941"),

        //getLadbrokesEventsForCompetition("eu-euro-2020"),

        //getMeridianEventsForCompetition("https://meridianbet.be/sails/sport/58/region/2405/league/uefa-euro-2020"),
        //getSbtechEventsForCompetition("44349"),
        //getStanleybetEventsForCompetition("-2690"),

        getZetBetEventsForCompetition("36147-euro_2020")
    ]
}



exports.getEvents = async function getEvents() {
    const leagueRequests = Object.values(requests).flat()
    const events = await Promise.all(leagueRequests).then(values => values)
    const sportRadarIds = [...new Set(events.flat().filter(x => x && x.length !== 0).map(event => event.sportRadarId))]
    const sportRadarMatches = await Promise.all(sportRadarIds.map(id => getSportRadarMatch(id))).then(values => values.filter(x => x))

    const requestsNotMappedToSportRadar = {
        /*
        "JUPILER_PRO_LEAGUE": [
            getPinnacleEventsForCompetition("1817", sportRadarMatches),
            //getBet90EventsForCompetition("457", sportRadarMatches)
            //getBetconstructBcapsEventsForCompetition("557", sportRadarMatches),
            //getPlaytechEventsForCompetition("soccer-be-sb_type_19372", sportRadarMatches)
        ],

         */
        "EURO2020": [
            getPinnacleEventsForCompetition("5264", sportRadarMatches),
        ]
    }
    const leagueRequestsNotMapped = Object.values(requestsNotMappedToSportRadar).flat()
    return Promise.all(leagueRequestsNotMapped).then(values => {
        return mergeEvents(values.flat().filter(x => x).concat(events.flat()), sportRadarMatches)
    })
}

function mergeEvents(events, sportRadarMatches) {
    const result = {}
    events.forEach(event => {
        if(event && event.sportRadarId) {
            const sportRadarId = event.sportRadarId.toString()
            const storedEvent = result[sportRadarId]
            if (storedEvent) {
                if (storedEvent.bookmakerInfo) {
                    const bookMakerInfos = storedEvent.bookmakerInfo.concat(event.bookmakerInfo)
                    result[sportRadarId] = new Event(sportRadarId, event.sportRadarEventUrl, bookMakerInfos,
                        storedEvent.sportRadarMatch, undefined)
                }
            } else {
                event.sportRadarMatch = sportRadarMatches.filter(match => match.sportRadarId.toString() === event.sportRadarId.toString())[0]
                result[sportRadarId] = event
            }
        }
    })
    return Object.values(result).filter(event => event.sportRadarId != "" && event.sportRadarMatch)
}

