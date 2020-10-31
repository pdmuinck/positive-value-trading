const axios = require('axios')
const CronJob = require('cron').CronJob

const environment = process.env.NODE_ENV
const WORKER_INTERFACE_IP = 'worker-interface'
const WORKER_INTERFACE_PORT = 3009
const EVENT_IP = 'event'
const EVENT_PORT = 3003

const betoffer = {}

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
        // merge gambling products for given event. start simple with 1X2
    })
}

function createRequests(event) {
    requests = []
    if(event.pinnacleEventId) {
        requests.push(axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/PINNACLE/books/PINNACLE/events/' + event.pinnacleEventId + '/betoffers').then(response => response.data))
    }
    if(event.kambiEvent && event.kambiEvent.id) {
        requests.push(axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/KAMBI/books/UNIBET_BELGIUM/events/' + event.kambiEvent.id + '/betoffers').then(response => response.data))
        requests.push(axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/KAMBI/books/NAPOLEON_GAMES/events/' + event.kambiEvent.id + '/betoffers').then(response => response.data))
    }
    if(event.sbtechEvent && event.sbtechEvent.id) {
        requests.push(axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/SBTECH/books/BETFIRST/events/' + parseInt(event.sbtechEvent.id) + '/betoffers').then(response => response.data))
        requests.push(axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/SBTECH/books/BET777/events/' + parseInt(event.sbtechEvent.id) + '/betoffers').then(response => response.data))
    }
    return requests
}

betOffer.getBetOffers = async () => {
    // return cache
}

module.exports = betOffer