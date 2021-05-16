const {getKambiEventsForCompetition} = require("./books/kambi")
const {getBwinEventsForCompetition} = require("./books/bwin");
const {getBingoalEventsForCompetition} = require("./books/bingoal");
const {getSportRadarMatch} = require("./books/sportradar");
const {getAltenarEventsForCompetition} = require("./books/altenar");
const {getBetwayEventsForCompetition} = require("./books/betway");
const {getCashPointEventsForCompetition} = require("./books/cashpoint")
const {getLadbrokesEventsForCompetition} = require("./books/ladbrokes")
const {getMeridianEventsForCompetition} = require("./books/meridian")
const {getSbtechEventsForCompetition} = require("./books/sbtech")
const {getScoooreEventsForCompetition} = require("./books/scooore")
const {getStanleybetEventsForCompetition} = require("./books/stanleybet")
const {getZetBetEventsForCompetition} = require("./books/zetbet")
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

async function getEvents() {
    const leagueRequests = Object.values(requests).flat()
    const events = await Promise.all(leagueRequests).then(values => values)
    const sportRadarIds = [...new Set(events.flat().filter(x => x && x.length !== 0).map(event => event.sportRadarId))]
    const sportRadarMatches = await Promise.all(sportRadarIds.map(id => getSportRadarMatch(id))).then(values => values.filter(x => x))
    const eventsMerged = mergeEvents(events.flat(), sportRadarMatches)
    console.log(eventsMerged)
}

getEvents()

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

