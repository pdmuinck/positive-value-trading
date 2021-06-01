const {Bookmaker, Provider, BookmakerInfo} = require("./bookmaker")
const {getSportRadarEventUrl} = require("./sportradar")
const {Event} = require("./event")
const axios = require("axios")
const parser = require('node-html-parser')

exports.getKambiEventsForCompetition = async function getKambiEventsForCompetition(id) {
    const books = [Bookmaker.UNIBET_BELGIUM, Bookmaker.NAPOLEON_GAMES]
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

exports.getAltenarEventsForCompetition = async function getAltenarEventsForCompetition(id) {
    const books = [Bookmaker.GOLDEN_PALACE]
    const url = 'https://sb1capi-altenar.biahosted.com/Sportsbook/GetEvents?timezoneOffset=-60&langId=1' +
        '&skinName=' + books[0] + '&configId=1&culture=en-GB&deviceType=Mobile&numformat=en&sportids=0&categoryids=0' +
        '&champids=' + id  +'&group=AllEvents&period=periodall&withLive=false&outrightsDisplay=none' +
        '&couponType=0&startDate=2020-04-11T08%3A28%3A00.000Z&endDate=2200-04-18T08%3A27%3A00.000Z'
    return axios.get(url)
        .then(response => {
            return response.data.Result.Items[0].Events.map(event => {
                const sportRadarId = event.ExtId
                const eventUrl = "https://sb1-geteventdetailsapi-altenar.biahosted.com/Sportsbook/GetEventDetails?timezoneOffset=-120&langId=1&skinName=goldenpalace&configId=1&culture=en-GB&numformat=en&eventId=" + event.Id
                const bookmakerInfos = books.map(book => {
                    return new BookmakerInfo(Provider.ALTENAR, book, id, event.Id, url, [eventUrl],
                        undefined, undefined, "GET")
                })
                return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), bookmakerInfos)
            })
        }).catch(error => console.log(error))
}

exports.getBetwayEventsForCompetition = async function getBetwayEventsForCompetition(id) {
    const markets = ["win-draw-win", "double-chance", "goals-over", "handicap-goals-over"]
    const eventIdPayload = {"PremiumOnly":false,"LanguageId":1,"ClientTypeId":2,"BrandId":3,"JurisdictionId":3,
        "ClientIntegratorId":1,"CategoryCName":"soccer","SubCategoryCName":"belgium","GroupCName":id }

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
                    const bookmakerInfo = new BookmakerInfo(Provider.BETWAY, Bookmaker.BETWAY, id, event.Id, leagueUrl, [eventUrl], undefined, payload, "POST")
                    if(event.SportsRadarId) {
                        return new Event(event.SportsRadarId.toString(), getSportRadarEventUrl(event.SportsRadarId), [bookmakerInfo])
                    }
                })
            }).catch(error => console.log(error))
        }).catch(error => console.log(error))
}

exports.getBingoalEventsForCompetition = async function getBingoalEventsForCompetition(id){
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

exports.getBwinEventsForCompetition = async function getBwinEventsForCompetition(id) {
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

exports.getCashPointEventsForCompetition = async function getCashPointEventsForCompetition(id) {
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



exports.getLadbrokesEventsForCompetition = async function getLadbrokesEventsForCompetition(id) {
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

exports.getMeridianEventsForCompetition = async function getMeridianEventsForCompetition(id) {
    return axios.get(id).then(response => {
        return response.data[0].events.map(event => {
            const eventUrl = "https://meridianbet.be/sails/events/" + event.id
            const sportRadarId = event.betradarUnified.id
            const bookmakerInfo = new BookmakerInfo(Provider.MERIDIAN, Bookmaker.MERIDIAN, id, event.id, id, [eventUrl], undefined, undefined, "GET")
            return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), [bookmakerInfo])
        })
    })
}

exports.getPinnacleEventsForCompetition = async function getPinnacleEventsForCompetition(id, sportRadarMatches) {
    const requestConfig = {
        headers: {
            "X-API-Key": "CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R",
            "Referer": "https://www.pinnacle.com/",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    }
    const leagueUrl = "https://guest.api.arcadia.pinnacle.com/0.1/leagues/" + id + "/matchups"
    return axios.get(leagueUrl, requestConfig).then(response => {
        return response.data.filter(event => !event.parent).map(event => {
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
    "Anderlecht": 4671
};

exports.getSbtechEventsForCompetition = async function getSbtechEventsForCompetition(id) {
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
        const page = {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[id],"pagination":{"top":300,"skip":0}}

        const headers = {
            headers: {
                'Authorization': 'Bearer ' + token,
                'locale': 'en',
                'accept-encoding': 'gzip, enflate, br'
            }
        }
        const leagueUrl = 'https://sbapi.sbtech.com/' + bookmaker + '/sportscontent/sportsbook/v1/Events/GetByLeagueId'
        return axios.post(leagueUrl, page, headers)
            .then(response => {
                return response.data.events.map(event => {
                    const bookmakerInfos = books.map(book => {
                        const token = tokens.filter(token => token.bookmaker === book.bookmaker)[0].token
                        const headers = {
                            headers: {
                                'Authorization': 'Bearer ' + token,
                                'locale': 'en',
                                'accept-encoding': 'gzip, enflate, br'
                            }
                        }
                        const leagueUrl = 'https://sbapi.sbtech.com/' + book.bookmaker + '/sportscontent/sportsbook/v1/Events/GetByLeagueId'
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

exports.getScoooreEventsForCompetition = async function getScoooreEventsForCompetition(id){
    const leagueUrl = "https://www.e-lotto.be/cache/evenueMarketGroupLimited/NL/" + id + ".1-0.json"
    return axios.get(leagueUrl)
        .then(response => {
            return response.data.markets.map(event => {
                const eventId = event.idfoevent.toString()
                const eventUrl = "https://www.e-lotto.be/cache/evenueEventMarketGroupWithMarketsSB/NL/420/" + eventId + ".json"
                const sportRadarId = event.extevents[0].idefevent.split('_')[1]
                const bookmakerInfo = new BookmakerInfo(Provider.SCOOORE, Bookmaker.SCOOORE, id, eventId, leagueUrl,
                    [eventUrl], undefined, undefined, "GET")
                return new Event(sportRadarId, getSportRadarEventUrl(sportRadarId), [bookmakerInfo])
            })
        }).catch(error => console.log(error))
}

exports.getStanleybetEventsForCompetition = async function getStanleybetEventsForCompetition(id){
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

exports.getZetBetEventsForCompetition = async function getZetBetEventsForCompetition(id) {
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