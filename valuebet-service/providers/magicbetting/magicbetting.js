const WebSocket = require("ws")
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })
const CDP = require('chrome-remote-interface')
const chromeLauncher = require('chrome-launcher')
const leagues = require('./resources/leagues')

async function launchChrome() {
    return await chromeLauncher.launch({
    chromeFlags: [
        '--no-first-run',
        '--headless',
        '--disable-gpu',
        '--no-sandbox'
    ]
    })
}

const magicbetting = {}

let websocket

magicbetting.open = () => {
    console.log('open magicbetting')
    findApi()
}

magicbetting.getEventsForBookAndSport = async (sport) => {
    if(cache.get('EVENTS')) {
        return Object.values(cache.mget(cache.get('EVENTS')))
    } else {
        return []
    }
}

magicbetting.getParticipantsForCompetition = async(book, competition) => {
    const league = leagues.filter(league => league.name === competition.toUpperCase())[0]
    const cacheResult = cache.get(league.id)
    return cacheResult ? cacheResult.map(event => event.participants).flat() : []
}

setInterval(async () => {
    if(!cache.get('EVENTS')){ 
        findApi()}
}, 10000)

async function findApi() {

    await chromeLauncher.killAll()
    const chrome = await launchChrome()
    
    const protocol = await CDP({
      port: chrome.port
    });

    const {Network, Page} = protocol

    await Network.webSocketCreated((params) => {
        if(params.url.includes('magicbetting')) {
            websocket = new WebSocket(params.url, null, {rejectUnauthorized: false})
            websocket.on('open', function open() {                
                websocket.send(JSON.stringify(["SUBSCRIBE\nid:/api/eventgroups/soccer-all-match-events-grouped-by-type\ndestination:/api/eventgroups/soccer-all-match-events-grouped-by-type\nlocale:nl\n\n\u0000"]))
                // subscribe to markets
                //circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/markets/3276302953\ndestination:/api/markets/3276302833\nlocale:nl\n\n\u0000"]))
            })
            
            websocket.on('message', function incoming(data) {
                if(data.includes('soccer-all-match-events')) {
                    const test = data.substring(12)
                    const test2 = test.substring(0, test.length - 1)
                    const test3 = test2.substring(test2.indexOf('{'))
                    const test4 = test3.replace('\\u0000\"', '')
                    let s = test4.replace(/\\n/g, "\\n")  
                       .replace(/\\'/g, "\\'")
                       .replace(/\\"/g, '\\"')
                       .replace(/\\&/g, "\\&")
                       .replace(/\\r/g, "\\r")
                       .replace(/\\t/g, "\\t")
                       .replace(/\\b/g, "\\b")
                       .replace(/\\f/g, "\\f")
                       .replace(/\\/g, "")
                    s = s.replace(/[\u0000-\u0019]+/g,"")
                    if(JSON.parse(s).groups) {
                        const events = JSON.parse(s).groups.map(group => group.events.map(event => event.id)).flat()
                        events.forEach(event => websocket.send(JSON.stringify(["SUBSCRIBE\nid:/api/events/" + event + "\ndestination:/api/events/" + event + "\nlocale:nl\n\n\u0000"])))
                        console.log('magicbetting events found: ' + events.length)
                        cache.set('EVENTS', events)
                    }
                    
                } else {
                    const test = data.substring(12)
                    const test2 = test.substring(0, test.length - 1)
                    const test3 = test2.substring(test2.indexOf('{'))
                    const test4 = test3.replace('\\u0000\"', '')
                    let s = test4.replace(/\\n/g, "\\n")  
                       .replace(/\\'/g, "\\'")
                       .replace(/\\"/g, '\\"')
                       .replace(/\\&/g, "\\&")
                       .replace(/\\r/g, "\\r")
                       .replace(/\\t/g, "\\t")
                       .replace(/\\b/g, "\\b")
                       .replace(/\\f/g, "\\f")
                       .replace(/\\/g, "")
                    s = s.replace(/[\u0000-\u0019]+/g,"")
                    try {
                        const parsedEvent = JSON.parse(s)
                        const leagueId = parsedEvent.typeId
                        const league = leagues.filter(league => league.id === leagueId).map(league => league.name)[0]
                        const event = {id: parsedEvent.id, participants: parsedEvent.participants, leagueId: parsedEvent.typeId, league: league}
                        const leagueEvents = cache.get(event.leagueId)
                        if(leagueEvents) {
                            leagueEvents.push(event)
                            cache.set(event.leagueId, leagueEvents)
                        } else {
                            cache.set(event.leagueId, [event])
                        }
                        if(!cache.get(event.id)) {
                            cache.set(event.id, event)
                        }
                    } catch(e) {
                    }

                }
            })
        }
    })

    // enable events then start!
    await Network.enable()
    await Page.enable()
    await Page.navigate({url: 'https://magicbetting.be/home'})
    await Page.loadEventFired()
}

magicbetting.getBetOffersByEventId = async (eventId) => {
    return cache.get(eventId)
}

module.exports = magicbetting