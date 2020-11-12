const axios = require('axios')
const CronJob = require('cron').CronJob
const NodeCache = require('node-cache')
const participants = require('../resources/participants')

const environment = process.env.NODE_ENV
const WORKER_INTERFACE_IP = 'worker-interface'
const WORKER_INTERFACE_PORT = 3009
const ttlSeconds = 60 * 1 * 1

const cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false })


const requests = [

    axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/KAMBI/books/UNIBET_BELGIUM/events?sport=FOOTBALL').then(response => response.data).catch(error => console.log(error)),
    axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/SBTECH/books/BETFIRST/events?sport=FOOTBALL').then(response => response.data).catch(error => console.log(error)),
    axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/PINNACLE/books/PINNACLE/events?sport=FOOTBALL').then(response => response.data).catch(error => console.log(error)),
    axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/MERIDIANBET/books/MERIDIAN/events?sport=FOOTBALL').then(response => response.data).catch(error => console.log(error)),
]

const event = {}

let events = []

event.job = new CronJob('*/10 * * * * *', () => {
    Promise.all(requests).then(providers => {
        merge(providers)
    })
}, null, true)

async function merge(providers) {
    const currentDate = new Date()
    const mergedEvents = []
    const pinnacleEvents = providers.filter(provider => provider.provider === 'PINNACLE').map(provider => provider.events).flat()
    const kambiEvents = providers.filter(provider => provider.provider === 'KAMBI').map(provider => provider.events).flat()
    const sbtechEvents = providers.filter(provider => provider.provider === 'SBTECH').map(provider => provider.events).flat()

    pinnacleEvents.forEach(pinnacleEvent => {

        // const pinnacleSubEvents = pinnacleEvents.filter(event => event.parent && event.parent.id === pinnacleEvent.id).map(event => {return {id: event.id, product: event.special, betOptions: event.participants.map(participant => {return {optionId: participant.id, label: participant.name}}).flat()}}).flat()

        const participantMapping = getParticipantsMapping(pinnacleEvent.participants)

        if(participantMapping && participantMapping.length > 0) {

            const kambiParticipants = participantMapping.map(mapping => mapping.kambi)
            const sbtechParticipants = participantMapping.map(mapping => mapping.sbtech)
            const meridianbetParticipants = participantMapping.map(mapping => mapping.meridianbet)
            const altenarParticipants = participantMapping.map(mapping => mapping.altenar)
            const bwinParticipants = participantMapping.map(mapping => mapping.bwin)
            const betwayParticipants = participantMapping.map(mapping => mapping.betway)
            const betcenterParticipants = participantMapping.map(mapping => mapping.betcenter)

            const kambiEvent = findEvent(kambiParticipants, kambiEvents)
            const sbtechEvent = findEvent(sbtechParticipants, sbtechEvents)
            
            const meridianbetEvent = findEvent(meridianbetParticipants, providers.filter(response => response.provider === 'MERIDIANBET').map(response => response.events).flat())
            const altenarEvent = findEvent(altenarParticipants, providers.filter(response => response.provider === 'ALTENAR').map(response => response.events).flat())
            const bwinEvent = findEvent(bwinParticipants, providers.filter(response => response.provider === 'BWIN').map(response => response.events).flat())
            const betwayEvent = findEvent(betwayParticipants, providers.filter(response => response.provider === 'BETWAY').map(response => response.events).flat())
            const betcenterEvent = findEvent(betcenterParticipants, providers.filter(response => response.provider === 'BETCENTER').map(response => response.events).flat())

            const startDate = pinnacleEvent.startTime.split('T')[0]
            const startTime = pinnacleEvent.startTime.split('T')[1].slice(0, 5)
            const participants = pinnacleEvent.participants
            const eventKey = [startDate, startTime, participants[0], participants[1]].join(';')
            mergedEvents.push({
                key: eventKey,
                val: {
                    startDate: startDate,
                    startTime: startTime,
                    participants: participants,
                    eventIds: [
                        {book: 'UNIBET_BELGIUM', provider: 'KAMBI', eventId: kambiEvent ? kambiEvent.id : null},
                        {book: 'NAPOLEON_GAMES', provider: 'KAMBI', eventId: kambiEvent ? kambiEvent.id : null},
                        {book: 'BETFIRST', provider: 'SBTECH', eventId: sbtechEvent ? sbtechEvent.id : null},
                        {book: 'BET777', provider: 'SBTECH', eventId: sbtechEvent ? sbtechEvent.id : null},
                        {book: 'PINNACLE', provider: 'PINNACLE', eventId: pinnacleEvent.id},
                        {book: 'MERIDIAN', provider: 'MERIDIAN', eventId: meridianbetEvent ?   meridianbetEvent.id : null}
                    ]
                }
            })
        }
    })

    cache.flushAll()

    console.log('found events: ' + mergedEvents.length)

    cache.mset(mergedEvents)

}

function findEvent(participants, events) {

    for(let i = 0; i < events.length; i++) {
        const event = events[i]
        
        const participantIds = event.participants.map(participant => participant.id)

        if(participants[0] == participantIds[0] && participants[1] == participantIds[1]) {
            return event
        }
    }
}

function getParticipantsMapping(pinnacleParticipants) {
    const map = []
    pinnacleParticipants.forEach(participant => {
        const mappedParticipant = participants[participant]
        if(mappedParticipant) map.push(mappedParticipant)
    })
    return map
}

event.getEvents = async () => {
    return Object.values(cache.mget(cache.keys()))
}


module.exports = event