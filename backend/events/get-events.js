const axios = require('axios')
const parser = require('node-html-parser')

const Bookmaker = {
    "GOLDEN_PALACE": "GOLDEN_PALACE",
    "FASTBET" : "fastbet",
    "BETMOTION" : "betmotion",
    "BET99" : "BET99",
    "CORAL" : "CORAL",
    "LADBROKES_UK": "LADBROKES_UK",
    "MERKUR_SPORTS": "merkur-sports",
    "SPORTWETTEN" : "SPORTWETTEN",
    "ZETBET" : "ZETBET",
    "BWIN" : "BWIN",
    "UNIBET_BELGIUM": 'ubbe',
    "NAPOLEON_GAMES" : 'ngbe',
    "PINNACLE": 'PINNACLE',
    "BETFIRST": 'betfirst',
    "BETCENTER" : 'BETCENTER',
    "CASHPOINT" : "CASHPOINT",
    "LADBROKES" : 'LADBROKES',
    "MERIDIAN" : 'MERIDIAN',
    "BET777" : 'bet777',
    "BET90" : 'BET90',
    "MAGIC_BETTING" : 'MAGIC_BETTING',
    "STAR_CASINO" : 'STAR_CASINO',
    "SCOOORE" : 'bnlbe',
    "CIRCUS" : 'CIRCUS',
    "STANLEYBET" : 'STANLEYBET',
    "BINGOAL" : 'BINGOAL',
    "BETRADAR" : 'BETRADAR',
    "GOLDENVEGAS" : 'GOLDENVEGAS',
    "BETWAY" : 'BETWAY',
    "TOTOLOTEK" : "totolotek"
}

Object.freeze(Bookmaker)



const Provider = {
    "PLAYTECH" : "PLAYTECH",
    "CASHPOINT" : "CASHPOINT",
    "KAMBI" : 'KAMBI',
    "SBTECH" : 'SBTECH',
    "BETCONSTRUCT" : 'BETCONSTRUCT',
    "ALTENAR" : 'ALTENAR',
    "PINNACLE" : 'PINNACLE',
    "BET90" : 'BET90',
    "BETRADAR" : 'BETRADAR',
    "BINGOAL" : 'BINGOAL',
    "STANLEYBET" : 'STANLEYBET',
    "STAR_CASINO" : 'STAR_CASINO',
    "LADBROKES" : 'LADBROKES',
    "MERIDIAN" : 'MERIDIAN',
    "MAGIC_BETTING" : 'MAGIC_BETTING',
    "SCOOORE" : 'SCOOORE',
    "BWIN" : 'BWIN',
    "BETWAY" : 'BETWAY',
    "ZETBET" : 'ZETBET'
}

class SportRadarMatch {
    constructor(sportRadarId, sportRadarEventUrl, participants, response) {
        this.sportRadarId = sportRadarId
        this.sportRadarEventUrl = sportRadarEventUrl;
        this.participants = participants
        this.response = response
    }
}

async function getSportRadarMatch(eventId) {
    const url = getSportRadarEventUrl(eventId)
    return axios.get(url).then(response => {
        if(response.data.doc[0].data.match) {
            const participants = [response.data.doc[0].data.match.teams.home._id, response.data.doc[0].data.match.teams.away._id]
            return new SportRadarMatch(eventId, url, participants, response.data.doc[0].data.match)
        }
    })
}

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
        getAltenarEventsForCompetition("3031"),
        getBetwayEventsForCompetition("matches", "euro-2020"),
        getBingoalEventsForCompetition("9153"),
        getCashPointEventsForCompetition("56529"),
        //getBwinEventsForCompetition("74435"),
        getKambiEventsForCompetition("2000123941"),
        getLadbrokesEventsForCompetition("eu-euro-2020"),
        getMeridianEventsForCompetition("https://meridianbet.be/sails/sport/58/region/2405/league/uefa-euro-2020"),
        getSbtechEventsForCompetition("44349"),
        //getStanleybetEventsForCompetition("-2690"),
        getZetBetEventsForCompetition("36147-euro_2020")
    ]
}

async function getEvents() {
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
        //console.log(values)
        console.log(JSON.stringify(mergeEvents(values.flat().filter(x => x).concat(events.flat()), sportRadarMatches)))
    })
}

function mergeEvents(events, sportRadarMatches) {
    const result = {}
    events.forEach(event => {
        if (event && event.sportRadarId) {
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

class Event {
    constructor(sportRadarId, sportRadarEventUrl, bookmakerInfo, sportRadarMatch, betOffers) {
        this.sportRadarId = sportRadarId
        this.sportRadarEventUrl = sportRadarEventUrl
        this.sportRadarMatch = sportRadarMatch
        this.bookmakerInfo = bookmakerInfo
        this.betOffers = betOffers
    }
}

class BookmakerInfo {
    constructor(provider, bookmaker, leagueId, eventId, leagueUrl, eventUrl, headers, requestBody, httpMethod) {
        this.provider = provider
        this.bookmaker = bookmaker
        this.leagueId = leagueId
        this.eventId = eventId
        this.leagueUrl = leagueUrl
        this.eventUrl = eventUrl
        this.headers = headers
        this.requestBody = requestBody
        this.httpMethod = httpMethod
    }
}

function getSportRadarEventUrl(id) {
    return "https://lsc.fn.sportradar.com/sportradar/en/Europe:Berlin/gismo/match_info/" + id
}

async function getKambiEventsForCompetition(id) {
    const books = [Bookmaker.UNIBET_BELGIUM, Bookmaker.NAPOLEON_GAMES, Bookmaker.SCOOORE]
    return axios('https://eu-offering.kambicdn.org/offering/v2018/ubbe/event/group/'
        + id + '.json?includeParticipants=false').then(eventResponses => {
        const requests = eventResponses.data.events.map(event => {
            return axios.get("https://nl.unibet.be/kambi-rest-api/sportradar/widget/event/nl/" + event.id)
                .then(sportRadarResponse => {
                    const sportRadarId = sportRadarResponse.data.content[0].Resource.split("matchId=")[1]
                    const bookMakerInfos = books.map(book => {
                        return new BookmakerInfo(Provider.KAMBI, book, id, event.id,
                            'https://eu-offering.kambicdn.org/offering/v2018/' + book + '/event/group/' + id + '.json?includeParticipants=false',
                            ['https://eu-offering.kambicdn.org/offering/v2018/' + book + '/betoffer/event/'  + event.id + '.json?includeParticipants=false'],
                            undefined, undefined, "GET")
                    }).flat()
                    return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), bookMakerInfos)
                }).catch(error => [])
        })
        return Promise.all(requests).then((sportRadarResponses) => {
            return sportRadarResponses
        })
    })
}

async function getAltenarEventsForCompetition(id) {
    const books = [Bookmaker.GOLDEN_PALACE]
    const url = 'https://sb2frontend-altenar2.biahosted.com/api/Sportsbook/GetEvents?timezoneOffset=-120&langId=8&skinName=goldenpalace&configId=19&culture=en-gb&countryCode=BE&deviceType=Desktop&numformat=en&integration=goldenpalace&sportids=0&categoryids=0&champids=' + id + '&group=AllEvents&period=periodall&withLive=false&outrightsDisplay=none&marketTypeIds&couponType=0&startDate=2021-06-16T12%3A21%3A00.000Z&endDate=2030-06-23T12%3A21%3A00.000Z'
    return axios.get(url)
        .then(response => {
            return response.data.Result.Items[0].Events.map(event => {
                const sportRadarId = event.ExtId.split(":")[2]
                const eventUrl = "https://sb2frontend-altenar2.biahosted.com/api/Sportsbook/GetEventDetails?timezoneOffset=-120&langId=1&skinName=goldenpalace&configId=1&culture=en-GB&numformat=en&eventId=" + event.Id
                const bookmakerInfos = books.map(book => {
                    return new BookmakerInfo(Provider.ALTENAR, book, id, event.Id, url, [eventUrl],
                        undefined, undefined, "GET")
                })
                return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), bookmakerInfos)
            })
        }).catch(error => console.log(error))
}

async function getBetwayEventsForCompetition(groupCName, subCategoryCName) {
    const markets = ["win-draw-win", "double-chance", "goals-over", "handicap-goals-over"]
    const eventIdPayload = {"PremiumOnly":false,"LanguageId":1,"ClientTypeId":2,"BrandId":3,"JurisdictionId":3,
        "ClientIntegratorId":1,"CategoryCName":"soccer","SubCategoryCName":subCategoryCName,"GroupCName":groupCName }

    const leagueUrl = "https://sports.betway.be/api/Events/V2/GetGroup"
    const eventUrl = "https://sports.betway.be/api/Events/V2/GetEventDetails"
    return axios.post(leagueUrl, eventIdPayload)
        .then(response => {
            const eventIds = response.data.Categories[0].Events
            return axios.post('https://sports.betway.be/api/Events/V2/GetEvents', {"LanguageId":1,"ClientTypeId":2,"BrandId":3,"JurisdictionId":3,"ClientIntegratorId":1,"ExternalIds":eventIds
                ,"MarketCName":markets[0],"ScoreboardRequest":{"ScoreboardType":3,"IncidentRequest":{}}}).then(response => {
                return response.data.Events.map(event => {
                    const payload = {"LanguageId":1,"ClientTypeId":2,"BrandId":3,"JurisdictionId":3,"ClientIntegratorId":1,"EventId":event.Id
                        ,"ScoreboardRequest":{"ScoreboardType":3,"IncidentRequest":{}}}
                    const bookmakerInfo = new BookmakerInfo(Provider.BETWAY, Bookmaker.BETWAY, subCategoryCName, event.Id, leagueUrl, [eventUrl], undefined, payload, "POST")
                    if(event.SportsRadarId) {
                        return new Event(event.SportsRadarId.toString(), getSportRadarEventUrl(event.SportsRadarId), [bookmakerInfo])
                    }
                })
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
}

async function getBingoalEventsForCompetition(id){
    return axios.get("https://www.bingoal.be/nl/Sport").then(response => {
        const headers = bingoalHeaders(response)
        const k = bingoalQueryKParam(response)
        const leagueUrl = "https://www.bingoal.be/A/sport?k=" + k + "&func=sport&id=" + id
        return axios.get(leagueUrl, headers)
            .then(response => {
                return response.data.sports.map(sport => sport.matches).flat().filter(match => !match.outright).map(match => {
                    const url = "https://www.bingoal.be/A/sport?k=" + k + "&func=detail&id=" + match.ID
                    const bookmakerInfo = new BookmakerInfo(Provider.BINGOAL, Bookmaker.BINGOAL, id, match.ID, leagueUrl,
                        [url], headers, undefined, "GET")
                    return new Event(match.betradarID.toString(), getSportRadarEventUrl(match.betradarID), [bookmakerInfo])
                })
            })})
}

function bingoalQueryKParam(response) {
    const ieVars = response.data.split("var _ie")[1]
    return ieVars.split("_k")[1].split(',')[0].split("=")[1].split("'").join("").trim()
}

function bingoalHeaders(response) {
    const cookie = response.headers["set-cookie"].map(entry => entry.split(";")[0]).join("; ")
    const headers = {
        headers : {
            "Cookie": cookie
        }
    }
    return headers
}

async function getBwinEventsForCompetition(id) {
    const leagueUrl = 'https://cds-api.bwin.be/bettingoffer/fixtures?x-bwin-accessid=NTE3MjUyZDUtNGU5Ni00MTkwL' +
        'WJkMGQtMDhmOGViNGNiNmRk&lang=en&country=BE&userCountry=BE&fixtureTypes=Standard&state=Late' +
        'st&offerMapping=Filtered&offerCategories=Gridable&fixtureCategories=Gridable,NonGridable,Other&co' +
        'mpetitionIds=' + id + '&skip=0&take=50&sortBy=Tags'
    return axios.get(leagueUrl).then(response => {
        return response.data.fixtures.map(event => {
            let sportRadarId = event.addons.betRadar
            if(!sportRadarId) sportRadarId = event.addons.liveMatchTracker.sportradarId
            const bookmakerInfo = new BookmakerInfo(Provider.BWIN, Bookmaker.BWIN, id, event.id, "",
                ["https://cds-api.bwin.be/bettingoffer/fixture-view?x-bwin-accessid=NTE3MjUyZDUtNGU5Ni00MTkwLWJkMGQtMDhmOGViNGNiNmRk&lang=en&country=BE&userCountry=BE&offerMapping=All&fixtureIds=" + event.id + "&state=Latest"],
                undefined, undefined, "GET")
            return new Event(sportRadarId.toString(), getSportRadarEventUrl(sportRadarId), [bookmakerInfo])
        })
    })
}

async function getCashPointEventsForCompetition(id) {
    const domains = {}
    domains[Bookmaker.TOTOLOTEK] = "oddsservice.totolotek.pl"
    domains[Bookmaker.MERKUR_SPORTS] = "oddsservice.merkur-sports.de"
    domains[Bookmaker.BETCENTER] = "oddsservice.betcenter.be"
    domains[Bookmaker.CASHPOINT] = "oddsservice.cashpoint.com"
    const headers = {
        headers: {
            "x-language": 2,
            "x-brand": 7,
            "x-location": 21,
            "x-client-country": 21,
            "Content-Type":"application/json"
        }
    }
    const payload = {"leagueIds": [parseInt(id)], "sportId": 1,"gameTypes":[1, 4, 5],"limit":20000,"jurisdictionId":30}
    const books = [Bookmaker.BETCENTER]
    const url = getGamesUrl(domains[Bookmaker.CASHPOINT])
    return axios.post(url, payload, headers)
        .then(response => {
            return response.data.games.map(event => {
                const sportRadarId = event.statisticsId.toString()
                const bookmakerInfos = books.map(book => {
                    const url = getGamesUrl(domains[book])
                    return new BookmakerInfo(Provider.CASHPOINT, book, id, event.id, url, [url],
                        headers, {
                            gameIds: [event.id],
                            gameTypes: [1, 4, 5],
                            jurisdictionId: 30,
                            limit: 20000,
                            leagueIds: [parseInt(id)]
                        }, "POST")
                })
                return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), bookmakerInfos)
            })
        })
}

function getGamesUrl(domain) {
    return "https://" + domain + "/odds/getGames/8"
}



async function getLadbrokesEventsForCompetition(id) {
    const headers = {
        headers: {
            'x-eb-accept-language': 'en_BE',
            'x-eb-marketid': 5,
            'x-eb-platformid': 2
        }
    }
    const leagueUrl = 'https://www.ladbrokes.be/detail-service/sport-schedule/services/meeting/calcio/'
        + id + '?prematch=1&live=0'
    return axios.get(leagueUrl, headers).then(response => {
        return response.data.result.dataGroupList.map(group => group.itemList).flat().map(event => {
            const eventId = event.eventInfo.aliasUrl
            const eventUrl = 'https://www.ladbrokes.be/detail-service/sport-schedule/services/event/calcio/'
                + id + '/' + eventId + '/tutte?prematch=1&live=0'
            const sportRadarId = event.eventInfo.programBetradarInfo.matchId
            const bookmakerInfo = new BookmakerInfo(Provider.LADBROKES, Bookmaker.LADBROKES, id, eventId, leagueUrl, [eventUrl], headers, undefined, "GET")
            return new Event(sportRadarId.toString(), getSportRadarEventUrl(sportRadarId), [bookmakerInfo])
        })
    })
}

async function getMeridianEventsForCompetition(id) {
    return axios.get(id).then(response => {
        return response.data[0].events.map(event => {
            const eventUrl = "https://meridianbet.be/sails/events/" + event.id
            const sportRadarId = event.betradarUnified.id
            const bookmakerInfo = new BookmakerInfo(Provider.MERIDIAN, Bookmaker.MERIDIAN, id, event.id, id, [eventUrl], undefined, undefined, "GET")
            return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), [bookmakerInfo])
        })
    })
}

async function getPinnacleEventsForCompetition(id, sportRadarMatches) {
    const requestConfig = {
        headers: {
            "X-API-Key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
            "Referer": "https://www.pinnacle.com/",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }

    //console.log(sportRadarMatches.map(match => match.sportRadarEventUrl))

    const leagueUrl = "https://guest.api.arcadia.pinnacle.com/0.1/leagues/" + id + "/matchups"
    return axios.get(leagueUrl, requestConfig).then(response => {

        return response.data.filter(event => !event.parent).map(event => {
            //console.log(pinnacle_sportradar[event.participants[0].name])
            //console.log(pinnacle_sportradar[event.participants[1].name])
            //console.log(sportRadarMatches.map(match => match.participants))
            const match = sportRadarMatches.filter(match => match && match.participants[0] === pinnacle_sportradar[event.participants[0].name] &&
                match.participants[1] === pinnacle_sportradar[event.participants[1].name])[0]
            if(match) {
                const bookmakerInfo = new BookmakerInfo(Provider.PINNACLE, Bookmaker.PINNACLE, id, event.id,
                    leagueUrl, ["https://guest.api.arcadia.pinnacle.com/0.1/matchups/" + event.id + "/related",
                        "https://guest.api.arcadia.pinnacle.com/0.1/matchups/" + event.id + "/markets/related/straight"],
                    requestConfig, undefined, "GET")

                return new Event(match.sportRadarId, match.sportRadarEventUrl, [bookmakerInfo])
            }
        })
    })
}

const pinnacle_sportradar = {
    "Sint Truiden": 4958,
    "Standard Liege": 4954,
    "KFCO Beerschot-Wilrijk": 10547664,
    "KV Kortrijk": 923904,
    "KV Mechelen": 4682,
    "Oud-Heverlee Leuven": 5583073,
    "Waasland-Beveren": 5583071,
    "Charleroi": 4672,
    "Eupen": 5325576,
    "Oostende": 357080,
    "Cercle Brugge": 230652,
    "Club Brugge": 5289,
    "Mouscron Peruwelz": 6542681,
    "Royal Antwerp": 5291,
    "Genk": 4675,
    "SV Zulte-Waregem": 548844,
    "Gent": 4677,
    "Anderlecht": 4671,
    "Wales": 9541,
    "Denmark": 9528,
    "Austria": 9518,
    "Italy": 9513,
    "Netherlands": 150,
    "Czech Republic": 57,
    "Belgium": 9516,
    "Portugal": 9531,
    "Spain": 9535,
    "Croatia": 10005,
    "Switzerland": 9539,
    "France": 77728,
    "Germany": 6171,
    "England": 6170,
    "Ukraine": 9504,
    "Sweden": 9537
}

async function getSbtechEventsForCompetition(id) {
    const books = [
        {bookmaker: "bet777", url: "https://sbapi.sbtech.com/bet777/auth/platform/v1/api/GetTokenBySiteId/72", api: "V1"},
        {bookmaker: "betfirst", url: "https://sbapi.sbtech.com/betfirst/auth/platform/v1/api/GetTokenBySiteId/28", api: "V1"},
    ]

    const tokenRequests = books.map(book => {
        const tokenUrl = book.url
        return axios.get(tokenUrl).then(tokenResponse => {
            return {token: getToken(tokenResponse.data, book.api), bookmaker: book.bookmaker}
        })
    })

    return Promise.all(tokenRequests).then(tokens => {
        const token = tokens[0].token
        const bookmaker = tokens[0].bookmaker
        //const page = {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[id],"pagination":{"top":300,"skip":0}}

        const headers = {
            headers: {
                'Authorization': 'Bearer ' + token,
                'locale': 'en',
                'accept-encoding': 'gzip, enflate, br'
            }
        }
        const leagueUrl = "https://sbapi.sbtech.com/" + bookmaker + "/sportsdata/v2/events?query=%24filter%3DleagueId%20eq%20'" + id + "'&locale=en"
        return axios.get(leagueUrl, headers)
            .then(response => {
                return response.data.data.events.filter(event => event.type === "Fixture").map(event => {
                    const bookmakerInfos = books.map(book => {
                        const token = tokens.filter(token => token.bookmaker === book.bookmaker)[0].token
                        const headers = {
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'locale': 'en',
                                'accept-encoding': 'gzip, enflate, br'
                            }
                        }
                        const leagueUrl = "https://sbapi.sbtech.com/" + book.bookmaker + "/sportsdata/v2/events?query=%24filter%3DleagueId%20eq%20'" + id + "'&locale=en"
                        const eventUrl = "https://sbapi.sbtech.com/" + book.bookmaker + "/sportsdata/v2/events?query=%24filter%3Did%20eq%20'"+ event.id + "'&includeMarkets=%24filter%3D"
                        return new BookmakerInfo(Provider.SBTECH, book.bookmaker, id, event.id,
                            leagueUrl, [eventUrl], headers, undefined, "GET")
                    })
                    const sportRadarId = parseInt(event.media[0].providerEventId)
                    return new Event(sportRadarId.toString(), getSportRadarEventUrl(sportRadarId), bookmakerInfos)
                })
            })
    })
}

function getToken(response, api) {
    if(api.toUpperCase() === "V1") {
        return response.split('ApiAccessToken = \'')[1].replace('\'', '')
    } else {
        return response.token
    }
}

async function getStanleybetEventsForCompetition(id){
    const headers = {
        headers: {
            'Content-Type': 'text/plain'
        }
    }
    const getEventsUrl = 'https://sportsbook.stanleybet.be/XSport/dwr/call/plaincall/IF_GetAvvenimenti.getEventi.dwr'
    const body = 'callCount=1\nnextReverseAjaxIndex=0\nc0-scriptName=IF_GetAvvenimenti\nc0-methodName=getEventi\n' +
        'c0-id=0\nc0-param0=number:6\nc0-param1=string:\nc0-param2=string:\nc0-param3=number:1\nc0-param4=number:'
        + id + '\nc0-param5=boolean:false\nc0-param6=string:STANLEYBET\nc0-param7=number:0\nc0-param8=' +
        'number:0\nc0-param9=string:nl\nbatchId=8\ninstanceId=0\npage=%2FXSport%2Fpages%2Fprematch.jsp%3Fsystem_code' +
        '%3DSTANLEYBET%26language%3Dnl%26token%3D%26ip%3D\nscriptSessionId=jUP0TgbNU12ga86ZyrjLTrS8NRSwl721Uon/AVY2Uon-upTglJydk\n'
    return axios.post(getEventsUrl, body, headers).then(response => {
        return response.data.split("avv:").slice(1).map(event => {
            const eventId = event.split(',')[0].toString()
            const sportRadarId = event.split('"bet_radar_it":')[1].split(",")[0]
            const pal = event.split("pal:")[1].split(",")[0]
            const body = "callCount=1\n" +
                "nextReverseAjaxIndex=0\n" +
                "c0-scriptName=IF_GetAvvenimentoSingolo\n" +
                "c0-methodName=getEvento\n" +
                "c0-id=0\n" +
                "c0-param0=number:1\n" +
                "c0-param1=string:" + id + "\n" +
                "c0-param2=number:" + pal + "\n" +
                "c0-param3=number:" + eventId + "\n" +
                "c0-param4=string:STANLEYBET\n" +
                "c0-param5=number:0\n" +
                "c0-param6=number:0\n" +
                "c0-param7=string:nl\n" +
                "c0-param8=boolean:false\n" +
                "batchId=35\n" +
                "instanceId=0\n" +
                "page=%2FXSport%2Fpages%2Fprematch.jsp%3Fsystem_code%3DSTANLEYBET%26language%3Dnl%26token%3D%26ip%3D\n" +
                "scriptSessionId=brsZLHHlZCZLuWNodA~xgit5tl4fa5OPqxn/BRNPqxn-QDQkzKIEx"
            const eventDetailUrl = "https://sportsbook.stanleybet.be/XSport/dwr/call/plaincall/IF_GetAvvenimentoSingolo.getEvento.dwr"
            const bookmakerInfo = new BookmakerInfo(Provider.STANLEYBET, Bookmaker.STANLEYBET, id, eventId, getEventsUrl, [eventDetailUrl], headers, body, "POST")
            return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), [bookmakerInfo])
        })
    }).catch(error => console.log(error))
}


async function getZetBetEventsForCompetition(id) {
    const leagueUrl = "https://www.zebet.be/en/competition/" + id
    return axios.get(leagueUrl)
        .then(response => {
            const parent = parser.parse(response.data)
            const events = parent.querySelectorAll('.bet-activebets').map(node => node.childNodes[1].rawAttrs.split("href=")[1].split('"')[1]).flat()
            const requests = events.map(event => {
                const eventUrl = "https://www.zebet.be/" + event
                return axios.get(eventUrl).then(response => {
                    const parent = parser.parse(response.data)
                    const splitted = parent.querySelectorAll('.bet-stats')[0].childNodes[1].rawAttrs.split('"')[1].split("/")
                    const sportRadarId = splitted[splitted.length - 1]
                    const bookmakerInfo = new BookmakerInfo(Provider.ZETBET, Bookmaker.ZETBET, id, event, leagueUrl, [eventUrl], undefined, undefined, "GET")
                    return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), [bookmakerInfo])
                })
            })
            return Promise.all(requests).then(responses => responses)
        })
}

getEvents()