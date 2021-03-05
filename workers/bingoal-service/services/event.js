const axios = require('axios')
const WebSocketAwait = require("ws-await")
const WebSocket = require("ws")

const sports = {
    "FOOTBALL": 1
}

const event = {}

event.getParticipants = async (league) => {
    const payload = {"leagueIds":[parseInt(league)],"gameTypes":[7],"jurisdictionId":30}
    return axios.post('https://oddsservice.betcenter.be/odds/getGames/8', payload, betcenterHeaders).then(response => parseParticipants(response.data)).catch(error => null)
}

function parseParticipants(events) {
    return events.games.map(event => event.teams.map(team => {return {id: team.id, name: team.name}}))
}

const headers = {
    headers: {
        'Cookie': 'cookieMode=all; _gcl_au=1.1.84849768.1606337643; lastType=1; _fbp=fb.1.1606337643554.1453342623; ust=20201129232952136320a3100ffc241f3c08e46aa5e528269e82271f21b97da0d739a719b613b5; trac=MKTG_GOOGLE_SEARCH_TEXTAD_DESKTOP_SPORT_BRAND_BENL_2020; _gcl_aw=GCL.1606689159.EAIaIQobChMImf_Awueo7QIVULLVCh02IgXREAAYASAAEgJ8OfD_BwE; _gac_UA-30529581-1=1.1606689159.EAIaIQobChMImf_Awueo7QIVULLVCh02IgXREAAYASAAEgJ8OfD_BwE; _gid=GA1.2.237244911.1606689159; _gat=1; _gac_UA-30529581-7=1.1606689159.EAIaIQobChMImf_Awueo7QIVULLVCh02IgXREAAYASAAEgJ8OfD_BwE; _gat_UA-30529581-7=1; CSPSESSIONID-SP-80-UP-=01w003000000DDzZw8ZSUsKgsJVUWQ2HdntAqb2iA1dFyreQj0; _ga_2J0LMSM6JQ=GS1.1.1606689197.3.0.1606689197.60; _ga=GA1.2.1426130866.1606337643; lastBets=; spoMenu=',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
}

event.getEvents = async () => {
    //https://www.bingoal.be/generated/sportHome_uof3.json
    return await axios.post('https://www.bingoal.be/A/sport', 'func=sport&k=3756&id=35', headers).then(response => response.data).catch(error => console.log(error))
}

function string(t) {
    const crypto = require("crypto")
    const s = "abcdefghijklmnopqrstuvwxyz012345"
    const i = 43
    for (var e = s.length, n = crypto.randomBytes(t), r = [], o = 0; o < t; o++) r.push(s.substr(n[o] % e, 1));
    return r.join("")
}

function number(t) {
    return Math.floor(Math.random() * t)
}

function numberString(t) {
    var e = ("" + (t - 1)).length;
    return (new Array(e + 1).join("0") + number(t)).slice(-e)
}


function getApiUrl() {
    const generatedId = string(8)
    const server = numberString(1e3)
    const url = "wss://magicbetting.be/api/" + server + "/" + generatedId + "/websocket"
    return url
}

let events

async function test2() {
    let circusWS = new WebSocket(getApiUrl(), null, {rejectUnauthorized: false})

    circusWS.on('open', function open() {
        console.log('open')
        const leagueId = "soccer-be-sb_type_19372"
        circusWS.send(JSON.stringify(["CONNECT\nprotocol-version:1.5\naccept-version:1.1,1.0\nheart-beat:100000,100000\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/user/request-response\ndestination:/user/request-response\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/items/list/all-sports-with-events\ndestination:/api/items/list/all-sports-with-events\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/eventgroups/" + leagueId + "-all-match-events-grouped-by-type\ndestination:/api/eventgroups/" + leagueId + "-all-match-events-grouped-by-type\nlocale:nl\n\n\u0000"]))
    })

    circusWS.on('message', function incoming(data) {
       if(data.includes('soccer-be-sb_type_19372')) {
           circusWS.close()
           events = data
       }
    })
}

function waitUntil() {
    test2()
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (events) {
                resolve(events)
                clearInterval(interval)
            }
        }, 1000)
    })
}

async function test() {
    const bar = await waitUntil()
    console.log(bar)
}

test()



/*
			_licenseRequired = "sport",
			_cameFromDomain = "sport",
			_cameFromSameDomain = 1,
			_token = "6C2CAD7C7D5E585119FCBCA3CB308DFA9F38FB79D2354B58E869BE7F32D9C6C929D01BC95812975A4516DBD4FC595307A562C83367A563FFA75AAC54069CAF2DD08427012A26E4246315F49D286B7F1E797879591DAD672A870BDE14D84C7ED3A642060BE1AC521824D74204E2B82E6ECC56128D12E080A2A79160B3053CADEBAFDE51D918E3373AEAC8B229756EBA717D18B4BF521AACAA3843E2FCEED4FE4C40F84C742519F37240EFF15D32EAB613CC159B40ABB1050DA3B9BEE3C1B0DCEA",
			_requestLicense = 0,
			_is21 = 0,
			_resourcesPath = "https://resources.bingoal.be/",
			_GAPrefix = false,
			_allowAnalyticsCookies = true,
			_defaultStakeHorses = 1.00,
			_enableItsmeRegistration = 1,
			_enableItsmeVerification = 0,
			_itsmeServiceCode = "BINGOALPRD_SHAREDATA",
			_itsmeProjectCode = "eTPj9D3qN6",
 */

// func=detail&id=35--4016

function parse(dataGroupList) {
    const events = []
    dataGroupList.forEach(dataGroup => {
        dataGroup.itemList.forEach(item => {
            events.push( {id: item.eventInfo.aliasUrl, participants: [{id: item.eventInfo.teamHome.description, name: item.eventInfo.teamHome.description}, {id: item.eventInfo.teamAway.description, name: item.eventInfo.teamAway.description}], betOffers: item.betGroupList.map(betGroup => betGroup.oddGroupList.map(oddGroup => {return {id: oddGroup.oddGroupDescription, prices: oddGroup.oddList.map(odd => {return {betOffer: odd.oddDescription, price: odd.oddValue / 100}})}})).flat()})
        })
    })
    return events
}

module.exports = event