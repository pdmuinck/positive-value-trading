const {getSportRadarMatch} = require("../books/sportradar");
const {getAltenarEventsForCompetition} = require("../books/altenar");
const {getBetwayEventsForCompetition} = require("../books/betway");
const {Event} = require("../event")

const requests = {
    "JUPILER_PRO_LEAGUE": [
        getAltenarEventsForCompetition("1000000490"),
        getBetwayEventsForCompetition("first-division-a")
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

getEvents()

