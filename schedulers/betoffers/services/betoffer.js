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

job = new CronJob('*/30 * * * * *', async () => {
    const events = await axios.get('http://' + EVENT_IP + ':' + EVENT_PORT + '/events').then(response => response.data).catch(error => console.log(error))
    const eventBetOfferRequests = events.map(event => createRequests(event))
    eventBetOfferRequests.forEach(eventBetOfferRequest => {
        requestBetOffers(eventBetOfferRequest)
    })
    
}, null, true)

async function requestBetOffers(eventBetOfferRequest) {
    Promise.all(eventBetOfferRequest).then(values => {
        console.log(values)
        cache.mset(values)
        // merge gambling products for given event. start simple with 1X2
    })
}

function createRequests(event) {
    const eventKey = event.pinnacleEventId
    requests = []

    if(event.pinnacleEventId) {
        requests.push(axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT 
        + '/providers/PINNACLE/books/PINNACLE/events/' + event.pinnacleEventId + '/betoffers')
        .then(response => {
            return {key: eventKey, val: response.data}
        }))
    }
    if(event.kambiEvent && event.kambiEvent.id) {
        requests.push(axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT 
        + '/providers/KAMBI/books/UNIBET_BELGIUM/events/' + event.kambiEvent.id + '/betoffers')
        .then(response => {
            return {key: eventKey, val: response.data}
        }))

        requests.push(axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT 
        + '/providers/KAMBI/books/NAPOLEON_GAMES/events/' + event.kambiEvent.id + '/betoffers')
        .then(response => {
            return {key: eventKey, val: response.data}
        }))
    }
    if(event.sbtechEvent && event.sbtechEvent.id) {
        requests.push(axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT 
        + '/providers/SBTECH/books/BETFIRST/events/' + parseInt(event.sbtechEvent.id) + '/betoffers')
        .then(response => {
            return {key: eventKey, val: response.data}
        }))

        requests.push(axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT 
        + '/providers/SBTECH/books/BET777/events/' + parseInt(event.sbtechEvent.id) + '/betoffers')
        .then(response => {
            return {key: eventKey, val: response.data}
        }))
    }
    return requests
}

betoffer.getBetOffers = async () => {
    return Object.values(cache.mget(cache.keys()))
}

betoffer.getBetOffersByEventId = async (eventId) => {
    return cache.mget(eventId)
}

module.exports = betoffer