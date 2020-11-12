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

async function fire(eventGroup) {
    if(eventGroup.eventKey) {
        const requests = eventGroup.eventIds.filter(event => event.eventId)
        .map(event => axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT 
        + '/providers/' + event.provider + '/books/' + event.book + '/events/' + event.eventId + '/betoffers')
        .then(response => response.data))

        Promise.all(requests).then(values => {
            cache.set(eventGroup.eventKey, values)
        })
    }
}

betoffer.getBetOffers = async () => {
    return cache.mget(cache.keys())
}

betoffer.getBetOffersByEventId = async (eventId) => {
    return cache.mget(eventId)
}

module.exports = betoffer