const mapper = {}

mapper.map = (participants) => {
    const result = {}
    participants.forEach(book => {
        book.participants.forEach(participant => {
            const provider = book.provider.toUpperCase()
            let mappedParticipant = result[participant.name.toUpperCase()]
            if(!mappedParticipant){
                if(provider === 'KAMBI') {
                    mappedParticipant = result[participant.name.toUpperCase()] = {kambi: participant.id}
                } else if(provider === 'SBTECH') {
                    mappedParticipant = result[participant.name.toUpperCase()] = {sbtech: participant.id}
                } else if(provider === 'PINNACLE') {
                    mappedParticipant = result[participant.name.toUpperCase()] = {pinnacle: participant.id}
                } else if(provider === 'MERIDIAN') {
                    mappedParticipant = result[participant.name.toUpperCase()] = {meridian: participant.id}
                }
                
            }
            participants.filter(other => other.provider !== book.provider).forEach(otherBook => {
                otherBook.participants.forEach(otherParticipant => {
                    otherProvider = otherBook.provider.toUpperCase()
                    if(otherParticipant.name.toUpperCase() === participant.name.toUpperCase()){
                        if(otherProvider === 'SBTECH') {
                            mappedParticipant.sbtech = otherParticipant.id
                        } else if(otherProvider === 'PINNACLE') {
                            mappedParticipant.pinnacle = otherParticipant.id
                        } else if(otherProvider === 'MERIDIAN') {
                            mappedParticipant.meridian = otherParticipant.id
                        } else if(otherProvider === 'KAMBI') {
                            mappedParticipant.kambi = otherParticipant.id
                        }
                    }
                })
            })
        }) 
    })
    const ordered = {}
    Object.keys(result).sort().forEach(key => {
        ordered[key] = result[key]
    })
    return ordered
} 

module.exports = mapper