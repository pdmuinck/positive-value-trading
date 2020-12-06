const axios = require('axios')
const leagues = require('./resources/leagues.json')

const getEventsUrl = 'https://sportsbook.stanleybet.be/XSport/dwr/call/plaincall/IF_GetAvvenimenti.getEventi.dwr'
const getSingleEventUrl = 'https://sportsbook.stanleybet.be/XSport/dwr/call/plaincall/IF_GetAvvenimentoSingolo.getEvento.dwr'

const headers = {
    headers: {
        'Content-Type': 'text/plain'
    }
}

const stanleybet = {}

stanleybet.getEventsForBookAndSport = async (book, sport) => {
    const requests = leagues.map(league => {
        const body = 'callCount=1\nnextReverseAjaxIndex=0\nc0-scriptName=IF_GetAvvenimenti\nc0-methodName=getEventi\nc0-id=0\nc0-param0=number:6\nc0-param1=string:\nc0-param2=string:\nc0-param3=number:1\nc0-param4=number:' + league.id + '\nc0-param5=boolean:false\nc0-param6=string:STANLEYBET\nc0-param7=number:0\nc0-param8=number:0\nc0-param9=string:nl\nbatchId=8\ninstanceId=0\npage=%2FXSport%2Fpages%2Fprematch.jsp%3Fsystem_code%3DSTANLEYBET%26language%3Dnl%26token%3D%26ip%3D\nscriptSessionId=jUP0TgbNU12ga86ZyrjLTrS8NRSwl721Uon/AVY2Uon-upTglJydk\n'
        return axios.post(getEventsUrl, body, headers).then(response => transform(response.data, league.id)).catch(error => console.log(error))
    })
    let results 
    await Promise.all(requests).then(values => {
        results = values.flat()
    })
    return results
}

function transform(eventData, realLeagueId) {
    const events = eventData.split('alias').filter(event => event.includes('avv:'))
    return events.map(event => {
        const test = event.split('avv:')[1]
        const eventId = test.split(',')[0]
        const descriptionPart = test.split('"desc_avv":')[1]
        const participants = descriptionPart.split(',')[0].split(' - ').map(participant => participant.replace(/\"/g, '').trim())
        const leagueId = descriptionPart.split('pal:')[1].split(',')[0]
        return {id: eventId, participants: participants.map(participant => {return {id: participant, name: participant}}), leagueId: leagueId, realLeagueId: realLeagueId}
    })
}

const bodySingleEvent = 'callCount=1\nnextReverseAjaxIndex=0\nc0-scriptName=IF_GetAvvenimentoSingolo\nc0-methodName=getEvento\nc0-id=0\nc0-param0=string:1\nc0-param1=string:280\nc0-param2=string:30481\nc0-param3=string:2549\nc0-param4=string:STANLEYBET\nc0-param5=number:0\nc0-param6=number:0\nc0-param7=string:nl\nc0-param8=boolean:true\nbatchId=781\ninstanceId=0\npage=%2FXSport%2Fpages%2Flive_match.jsp%3Ftoken%3Dsample_token%26ip%3D127.0.0.1%26system_code%3DSTANLEYBET%26id_pvr%3D%26language%3Dnl%26operator%3Dfalse%26cashier%3Dfalse%26prenotatore%3Dfalse%26hide_switcher_bar%3Dfalse\nscriptSessionId=NzRgVIcEnGbOpnSsd4bO~wYbxnp\u0021hnUVqon/MCl8ron-ome$1g3hu\n'

// avv (param3) + pal (param2) to get details

module.exports = stanleybet