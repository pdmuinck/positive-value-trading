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
    axios.get('http://' + WORKER_INTERFACE_IP + ':' + WORKER_INTERFACE_PORT + '/providers/MERIDIANBET/books/MERIDIANBET/events?sport=FOOTBALL').then(response => response.data).catch(error => console.log(error)),
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
    const pinnacleEvents = providers.filter(provider => provider.provider === 'PINNACLE').map(provider => provider.events)
    const kambiEvents = providers.filter(provider => provider.provider === 'KAMBI').map(provider => provider.events)
    const sbtechEvents = providers.filter(provider => provider.provider === 'SBTECH').map(provider => provider.data).flat().map(event => event.events).flat()

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

            const kambiEvent = findEvent('KAMBI', kambiParticipants, kambiEvents)
            const sbtechEvent = findEvent('SBTECH', sbtechParticipants, sbtechEvents)
            
            const meridianbetEvent = findEvent('MERIDIANBET', meridianbetParticipants, providers.filter(response => response.provider === 'MERIDIANBET').map(response => response.events).flat())
            const altenarEvent = findEvent('ALTENAR', altenarParticipants, providers.filter(response => response.provider === 'ALTENAR').map(response => response.events).flat())
            const bwinEvent = findEvent('BWIN', bwinParticipants, providers.filter(response => response.provider === 'BWIN').map(response => response.events).flat())
            const betwayEvent = findEvent('BETWAY', betwayParticipants, providers.filter(response => response.provider === 'BETWAY').map(response => response.events).flat())
            const betcenterEvent = findEvent('BETCENTER', betcenterParticipants, providers.filter(response => response.provider === 'BETCENTER').map(response => response.events).flat())

            const startDate = pinnacleEvent.startTime.split('T')[0]
            const startTime = pinnacleEvent.startTime.split('T')[1].slice(0, 5)
            const participants = pinnacleEvent.participants.map(participant => participant.name).flat()
            const eventKey = [startDate, startTime, participants[0], participants[1]].join(';')
            mergedEvents.push({
                key: eventKey,
                val: {
                    participants: participants,
                    league: pinnacleEvent.league.name,
                    sport: pinnacleEvent.league.sport.name, 
                    startDate: startDate,
                    startTime: startTime,
                    current_date: currentDate,
                    timeBeforeStart: new Date(pinnacleEvent.startTime) - currentDate,
                    pinnacleEventId: pinnacleEvent.id,
                    //pinnacleSubEvents: pinnacleSubEvents.map(event => event.special),
                    kambiEvent: kambiEvent ? {id: kambiEvent.id, participants: kambiEvent.participants.map(participant => {return {id: participant.participantId, home: participant.home}})} : null,
                    sbtechEvent: sbtechEvent ? {id: sbtechEvent.id, tokens: providers.filter(response => response.provider === 'SBTECH')[0].tokens} : null,
                    altenarEventId: altenarEvent ? altenarEvent.Id : null,
                    meridianbetEventId: meridianbetEvent ? meridianbetEvent.id : null,
                    bwinEventId: bwinEvent ? bwinEvent.id : null,
                    betwayEventId: betwayEvent ? betwayEvent.Id : null,
                    betcenterEventId: betcenterEvent ? betcenterEvent.id : null,
                    sportradarEventId: betcenterEvent ? betcenterEvent.statisticsId : null
                }
            })
        }
    })

    cache.flushAll()

    console.log('found events: ' + mergedEvents.filter(event => event.val.participants.length === 2).length)

    cache.mset(mergedEvents.filter(event => event.val.participants.length === 2))

}

function findEvent(provider, participants, events) {

    for(let i = 0; i < events.length; i++) {
        const event = events[i]
        
        let participantIds

        if(provider === 'ALTENAR') {
            participantIds = event.Competitors.map(participant => participant.Name)
        } else if(provider === 'KAMBI' || provider === 'BWIN') {
            participantIds = event.participants.map(participant => participant.participantId)
        } else if(provider === 'SBTECH') {
            participantIds = event.participants.map(participant => participant.id)
        } else if(provider === 'MERIDIANBET') {
            participantIds = event.team.map(team => team.id)
        } else if(provider === 'BETWAY') {
            participantIds = [event.HomeTeamName, event.AwayTeamName]
        } else if(provider === 'BETCENTER') {
            participantIds = event.teams.map(team => team.id)
        }

        if(participants[0] == participantIds[0] && participants[1] == participantIds[1]) {
            return event
        }
    }
}

function getParticipantsMapping(pinnacleParticipants) {
    participantMap = []
    pinnacleParticipants.forEach(participant => {
        const mapping = participants[participant.name]
        if(mapping) {
            participantMap.push(participants[participant.name])
        } else {
            //console.log(participant.name)
        }
    })
    return participantMap
}

event.getEvents = async () => {
    return Object.values(cache.mget(cache.keys()))
}


module.exports = event