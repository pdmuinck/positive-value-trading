const participants = require('./participants.json')

const eventMapper = {}


eventMapper.map = function(providers) {
    const entries = Object.entries(participants)
    const result = {}
    providers.forEach(provider => {
        provider.events.forEach(event => {
            foundParticipants = []
            if(provider.provider.toUpperCase() === 'KAMBI') {
                event.participants.forEach(participant => {
                    const foundParticipant = entries.filter(entry => entry[1].kambi === participant.id).map(entry => entry[0])
                    if(foundParticipant[0]) {
                        foundParticipants.push(foundParticipant[0])
                    }
                })
            } else if(provider.provider.toUpperCase() === 'SBTECH') {
                event.participants.forEach(participant => {
                    const foundParticipant = entries.filter(entry => entry[1].sbtech === participant.id).map(entry => entry[0])
                    if(foundParticipant[0]) {
                        foundParticipants.push(foundParticipant[0])
                    }
                })
            }
            if(foundParticipants.length === 2) {
                const eventKey = foundParticipants.join(';')
                let mappedEvent = result[eventKey]
                if(!mappedEvent) {
                    if(provider.provider.toUpperCase() === 'KAMBI') {
                        mappedEvent = result[eventKey] = {kambi: event.id}
                    } else if(provider.provider.toUpperCase() === 'SBTECH') {
                        mappedEvent = result[eventKey] = {sbtech: event.id}
                    }
                }
                // search other providers
                providers.filter(otherProvider => otherProvider.provider.toUpperCase() !== provider.provider.toUpperCase()).forEach(otherProvider => {
                    otherProvider.events.forEach(otherEvent => {
                        otherFoundParticipants = []
                        if(otherProvider.provider.toUpperCase() === 'KAMBI') {
                            otherEvent.participants.forEach(participant => {
                                const foundParticipant = entries.filter(entry => entry[1].kambi === participant.id).map(entry => entry[0])
                                if(foundParticipant[0]) {
                                    otherFoundParticipants.push(foundParticipant[0])
                                }
                            })
                        } else if(otherProvider.provider.toUpperCase() === 'SBTECH') {
                            otherEvent.participants.forEach(participant => {
                                const foundParticipant = entries.filter(entry => entry[1].sbtech === participant.id).map(entry => entry[0])
                                if(foundParticipant[0]) {
                                    otherFoundParticipants.push(foundParticipant[0])
                                }
                            })
                        }
                        if(otherFoundParticipants) {
                            const otherEventKey = otherFoundParticipants.join(';')
                            if(otherEventKey === eventKey) {
                                if(otherProvider.provider.toUpperCase() === 'KAMBI') {
                                    mappedEvent.kambi = otherEvent.id
                                } else if(otherProvider.provider.toUpperCase() === 'SBTECH') {
                                    mappedEvent.sbtech = otherEvent.id
                                }
                            }
                        }
                    })
                })

            }
        })
        
    })
    return result

}

module.exports = eventMapper