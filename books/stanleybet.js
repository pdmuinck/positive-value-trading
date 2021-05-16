const {Bookmaker, Provider, BookmakerInfo, BetType} = require("./bookmaker")
const {Event} = require("../event-mapper/event")
const {BetOffer} = require("../utils/utils")
const {getSportRadarEventUrl} = require("./sportradar")
const axios = require("axios")
const {calculateMargin} = require("../utils/utils")


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

exports.parseStanleybetBetOffers = function parseStanleybetBetOffers(apiResponse) {
    const eventId = apiResponse.data.split("avv:")[1].split(',')[0].toString()
    const betOffers = apiResponse.data.split("ScommessaDTO").slice(1)
    return betOffers.map(betOffer => {
        const betType = determineBetType(betOffer.split('"id_scom":')[1].split(",")[0])
        let line = parseInt(betOffer.split("handicap:")[1].split(",")[0])/100
        if(line === 0) line = undefined
        if(betType !== BetType.UNKNOWN) {
            const selections = betOffer.split("EsitoDTO").slice(1)
            const margin = calculateMargin(selections.map(selection => parseInt(selection.split("quota:")[1])/100))
            return selections.map(selection => {
                const outcome = determineOutcome(selection.split('"desc_esito":"')[1].split('","')[0])
                const price = parseInt(selection.split("quota:")[1])/100
                return new BetOffer(betType, eventId, Bookmaker.STANLEYBET, outcome, price, line, margin)
            })
        }

    }).flat().filter(x => x)
}

function determineOutcome(outcome) {
    switch(outcome) {
        case "GOAL":
            return "YES"
        case "NO GOAL":
            return "NO"
        case "ONEVEN":
            return "ODD"
        case "JA":
            return "YES"
        case "NEE":
            return "NO"
        default:
            return outcome.toUpperCase()
    }
}

function determineBetType(id) {
    switch(id) {
        case "5":
            return BetType._1X2
        case "-8000":
            return BetType.DOUBLE_CHANCE
        case "7554":
            return BetType.DOUBLE_CHANCE_H2
        case "7557":
            return BetType.DOUBLE_CHANCE_H1
        case "20":
            return BetType.BOTH_TEAMS_SCORE
        case "9":
            return BetType.CORRECT_SCORE
        case "16":
            return BetType._1X2_H1
        case "21":
            return BetType.ODD_EVEN
        case "122":
            return BetType._1X2_H2
        case "409":
            return BetType.CORRECT_SCORE_H1
        case "548":
            return BetType.CORRECT_SCORE_H2
        case "549":
            return BetType.ODD_EVEN_TEAM1
        case "550":
            return BetType.ODD_EVEN_TEAM2
        case "556":
            return BetType.OVER_UNDER_TEAM1
        case "557":
            return BetType.OVER_UNDER_TEAM2
        case "1843":
            return BetType.HANDICAP
        case "1844":
            return BetType.HANDICAP
        case "1845":
            return BetType.HANDICAP
        case "1846":
            return BetType.HANDICAP
        case "4168":
            return BetType.HANDICAP_H2
        case "5193":
            return BetType.OVER_UNDER_TEAM1
        case "5196":
            return BetType.OVER_UNDER_TEAM1
        case "5274":
            return BetType.OVER_UNDER_TEAM1
        case "5305":
            return BetType.OVER_UNDER_TEAM2
        case "5876":
            return BetType.OVER_UNDER_TEAM2
        case "6218":
            return BetType.OVER_UNDER_TEAM2
        case "12640":
            return BetType.OVER_UNDER
        case "12636":
            return BetType.OVER_UNDER
        case "12626":
            return BetType.OVER_UNDER
        case "12193":
            return BetType.OVER_UNDER
        case "12207":
            return BetType.OVER_UNDER
        default:
            return BetType.UNKNOWN
    }
}