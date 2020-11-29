const WebSocket = require("ws")
const NodeCache = require('node-cache')
const ttlSeconds = 60 * 1 * 1
const cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })
const CDP = require('chrome-remote-interface')
const chromeLauncher = require('chrome-launcher');

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

event.getBySport = async (sport) => {
    let circusWS = new WebSocket(cache.get('API-URL'), null, {rejectUnauthorized: false})

    


    circusWS.on('open', function open() {
        //circusWS.send(JSON.stringify(["CONNECT\nprotocol-version:1.5\naccept-version:1.1,1.0\nheart-beat:10000,10000\n\n\u0000"]))
        /*
            circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/user/request-response\ndestination:/user/request-response\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/user/error\ndestination:/user/error\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/systemconfiguration/paymentMethods\ndestination:/api/systemconfiguration/paymentMethods\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/sports/homepage\ndestination:/api/sports/homepage\nlocale:nl\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/items/list/all-sports-with-events\ndestination:/api/items/list/all-sports-with-events\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/items/list/cms-coupons-homepage\ndestination:/api/items/list/cms-coupons-homepage\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/nl/promotionlocations/458\ndestination:/api/nl/promotionlocations/458\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/items/list/match-sports-with-live-match-events\ndestination:/api/items/list/match-sports-with-live-match-events\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/items/list/match-sports-with-future-match-events\ndestination:/api/items/list/match-sports-with-future-match-events\n\n\u0000"]))
        circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/systeminformation/initialisation\ndestination:/api/systeminformation/initialisation\n\n\u0000"]))
        
        */

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
            cache.set('test', test3.replace('\\\\\\', ''))
        }
        
        //JSON.parse(JSON.stringify(data.substring(1)))
        //cache.set('FOOTBALL', data)
    })

    return cache.get('test')

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