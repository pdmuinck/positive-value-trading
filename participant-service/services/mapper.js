const mapper = {}

mapper.map = (participants) => {
    const result = {}
    participants.forEach(book => {
        book.participants.forEach(participant => {
            let mappedParticipant = result[participant.name.toUpperCase()]
            if(!mappedParticipant){
                if(book.provider === 'KAMBI') {
                    mappedParticipant = result[participant.name.toUpperCase()] = {kambi: participant.id}
                } else if(book.provider === 'SBTECH') {
                    mappedParticipant = result[participant.name.toUpperCase()] = {sbtech: participant.id}
                } else if(book.provider === 'PINNACLE') {
                    mappedParticipant = result[participant.name.toUpperCase()] = {pinnacle: participant.id}
                } else if(book.provider === 'MERIDIAN') {
                    mappedParticipant = result[participant.name.toUpperCase()] = {meridian: participant.id}
                }
                
            }
            participants.filter(other => other.provider !== book.provider).forEach(otherBook => {
                otherBook.participants.forEach(otherParticipant => {
                    if(otherParticipant.name.toUpperCase() === participant.name.toUpperCase()){
                        if(otherBook.provider === 'SBTECH') {
                            mappedParticipant.sbtech = otherParticipant.id
                        } else if(otherBook.provider === 'PINNACLE') {
                            mappedParticipant.pinnacle = otherParticipant.id
                        } else if(otherBook.provider === 'MERIDIAN') {
                            mappedParticipant.meridian = otherParticipant.id
                        } else if(otherBook.provider === 'KAMBI') {
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