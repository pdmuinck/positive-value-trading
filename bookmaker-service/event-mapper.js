const participants = require('./participants.json')

const eventMapper = {}


eventMapper.map = function(providers) {
    const result = {}
    providers.forEach(provider => {
        provider.events.filter(event => event.participants && event.participants.length === 2).forEach(event => {
            const foundParticipants = findParticipants(event, provider.provider.toLowerCase())
            if(foundParticipants.length === 2) {
                const eventKey = foundParticipants.join(';')
                let mappedEvent = result[eventKey]
                if(!mappedEvent) {
                    result[eventKey] = {}
                    result[eventKey][provider.provider.toLowerCase()] = event.id
                    mappedEvent = result[eventKey]
                }
                // search other providers
                providers.filter(otherProvider => otherProvider.provider.toUpperCase() !== provider.provider.toUpperCase()).forEach(otherProvider => {
                    otherProvider.events.filter(event => event.participants && event.participants.length === 2).forEach(otherEvent => {
                        const otherFoundParticipants = findParticipants(otherEvent, otherProvider.provider.toLowerCase())
                        if(otherFoundParticipants) {
                            const otherEventKey = otherFoundParticipants.join(';')
                            if(otherEventKey === eventKey) {
                                mappedEvent[otherProvider.provider.toLowerCase()] = otherEvent.id
                            }
                        }
                    })
                })
            }
        })
    })
    return result

}

function findParticipants(event, provider) {
    const entries = Object.entries(participants)
    foundParticipants = []
    if(provider === 'kambi') {
        const homeId = event.participants.filter(participant => participant.home).map(participant => participant.id)[0]
        const awayId = event.participants.filter(participant => participant.id !== homeId).map(participant => participant.id)[0]        
        let foundParticipant = entries.filter(entry => entry[1][provider] == homeId).map(entry => entry[0])
        if(foundParticipant[0]) {
            foundParticipants.push(foundParticipant[0])
        }
        foundParticipant = entries.filter(entry => entry[1][provider] == awayId).map(entry => entry[0])
        if(foundParticipant[0]) {
            foundParticipants.push(foundParticipant[0])
        }
        return foundParticipants
    } else {
        event.participants.forEach(participant => {
            const foundParticipant = entries.filter(entry => entry[1][provider] == participant.id).map(entry => entry[0])
            if(foundParticipant[0]) {
                foundParticipants.push(foundParticipant[0])
            }
        })
        return foundParticipants
    }

}

module.exports = eventMapper