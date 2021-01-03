const WebSocket = require("ws")
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })
const CDP = require('chrome-remote-interface')
const chromeLauncher = require('chrome-launcher');
const magicbetting = require("../../../valuebet-service/providers/magicbetting/magicbetting")

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

const event = {}


event.getEventsForBookAndSport = async (book, sport) => {
    let circusWS = new WebSocket(cache.get('API-URL'), null, {rejectUnauthorized: false})

    circusWS.on('open', function open() {

        // lists the event together with market ids
        
        //circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/sports/soccer\ndestination:/api/sports/soccer\nlocale:nl\n\n\u0000"]))
        //circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/eventgroups/soccer-live-match-events-grouped-by-type\ndestination:/api/eventgroups/soccer-live-match-events-grouped-by-type\nlocale:nl\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/eventgroups/soccer-all-match-events-grouped-by-type\ndestination:/api/eventgroups/soccer-all-match-events-grouped-by-type\nlocale:nl\n\n\u0000"]))
        //circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/events/3243155496\ndestination:/api/events/3243155496\nlocale:nl\n\n\u0000"]))
        


        // subscribe to markets
        //circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/markets/3276302953\ndestination:/api/markets/3276302833\nlocale:nl\n\n\u0000"]))
    })

    circusWS.on('message', function incoming(data) {
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
            cache.set('test', JSON.parse(s))
        }
    })

    return cache.get('test')

}

magicbetting.open = () => {
    console.log('open magicbetting')
}

setInterval(async () => {
    await chromeLauncher.killAll()
    const chrome = await launchChrome()
    
    const protocol = await CDP({
      port: chrome.port
    });

    const {Network, Page} = protocol

    await Network.webSocketCreated((params) => {
        if(params.url.includes('magicbetting')) {
            console.log('found api')
            cache.set('API-URL', params.url)
        }
    })

    // enable events then start!
    await Network.enable()
    await Page.enable()
    await Page.navigate({url: 'https://magicbetting.be/home'})
    await Page.loadEventFired()
}, 10000)

event.getBetOffersByEventId = async (eventId) => {
    return cache.get(eventId)
}

module.exports = event