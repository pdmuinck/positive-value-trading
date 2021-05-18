const {getKambiEventsForCompetition, getBwinEventsForCompetition, getBingoalEventsForCompetition,
    getAltenarEventsForCompetition, getBetwayEventsForCompetition, getCashPointEventsForCompetition,
    getLadbrokesEventsForCompetition, getMeridianEventsForCompetition, getSbtechEventsForCompetition,
    getScoooreEventsForCompetition, getStanleybetEventsForCompetition, getZetBetEventsForCompetition} = require("./books")
const {getSportRadarMatch} = require("./sportradar");
const {Event} = require("./event")

const requests = {
    "JUPILER_PRO_LEAGUE": [
        getAltenarEventsForCompetition("1000000490"),
        getBetwayEventsForCompetition("first-division-a"),
        getBingoalEventsForCompetition("25"),
        getCashPointEventsForCompetition("6898"),
        getBwinEventsForCompetition("16409"),
        getKambiEventsForCompetition("1000094965"),
        getLadbrokesEventsForCompetition("be-jupiler-league1"),
        getMeridianEventsForCompetition("https://meridianbet.be/sails/sport/58/region/26/league/first-division-a"),
        getSbtechEventsForCompetition("40815"),
        getScoooreEventsForCompetition("18340"),
        getStanleybetEventsForCompetition("38"),
        getZetBetEventsForCompetition("101-pro_league_1a")
    ]
}

exports.getEvents = async function getEvents() {
    const leagueRequests = Object.values(requests).flat()
    const events = await Promise.all(leagueRequests).then(values => values)
    const sportRadarIds = [...new Set(events.flat().filter(x => x && x.length !== 0).map(event => event.sportRadarId))]
    const sportRadarMatches = await Promise.all(sportRadarIds.map(id => getSportRadarMatch(id))).then(values => values.filter(x => x))
    return mergeEvents(events.flat(), sportRadarMatches)
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

