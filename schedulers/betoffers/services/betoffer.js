const axios = require('axios')
const CronJob = require('cron').CronJob
const NodeCache = require('node-cache')

const environment = process.env.NODE_ENV
const WORKER_INTERFACE_IP = 'worker-interface'
const WORKER_INTERFACE_PORT = 3009
const EVENT_IP = 'event'
const EVENT_PORT = 3003
const ttlSeconds = 60 * 1 * 1

const betoffer = {}

const cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })

job = new CronJob('*/55 * * * * *', async () => {
    const events = await axios.get('http://' + EVENT_IP + ':' + EVENT_PORT + '/events').then(response => response.data).catch(error => console.log(error))
    events.forEach(event => fire(event))
    
}, null, true)

function fire(event) {

    if(event.pinnacleEventId) {
        axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT 
        + '/providers/PINNACLE/books/PINNACLE/events/' + event.pinnacleEventId + '/betoffers')
        .then(response => {
            cache.set('PINNACLE' + event.pinnacleEventId, response.data)
        })
    }
    if(event.kambiEvent && event.kambiEvent.id) {
        axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT 
        + '/providers/KAMBI/books/UNIBET_BELGIUM/events/' + event.kambiEvent.id + '/betoffers')
        .then(response => {
            cache.set('UNIBET_BELGIUM' + event.kambiEvent.id, response.data)
        })

        axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT 
        + '/providers/KAMBI/books/NAPOLEON_GAMES/events/' + event.kambiEvent.id + '/betoffers')
        .then(response => {
            cache.set('NAPOLEON' + event.kambiEvent.id, response.data)
        })
    }
    if(event.sbtechEvent && event.sbtechEvent.id) {
        axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT 
        + '/providers/SBTECH/books/BETFIRST/events/' + parseInt(event.sbtechEvent.id) + '/betoffers')
        .then(response => {
            cache.set('BETFIRST' + event.sbtechEvent.id, response.data)
        })

        axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT 
        + '/providers/SBTECH/books/BET777/events/' + parseInt(event.sbtechEvent.id) + '/betoffers')
        .then(response => {
            cache.set('BET777' + event.sbtechEvent.id, response.data)
        })
    }
}

betoffer.getBetOffers = async () => {
    return Object.values(cache.mget(cache.keys()))
}

betoffer.getBetOffersByEventId = async (eventId) => {
    return cache.mget(eventId)
}

module.exports = betoffer