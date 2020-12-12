const mapper = {}

mapper.map = (participants) => {
    const result = {}
    participants.forEach(book => {
        if(book) {
            book.participants.forEach(participant => {
                let mappedParticipant
                if(participant && participant.name) {
                    const provider = book.provider.toUpperCase()
                    mappedParticipant = result[participant.name.toUpperCase()]
                    if(!mappedParticipant){
                        result[participant.name.toUpperCase()] = {}
                        result[participant.name.toUpperCase()][provider.toLowerCase()] = participant.id
                        mappedParticipant = result[participant.name.toUpperCase()]
                    }
                }
                participants.filter(other => other && other.provider && other.provider !== book.provider).forEach(otherBook => {
                    otherBook.participants.forEach(otherParticipant => {
                        otherProvider = otherBook.provider.toLowerCase()
                        if(otherParticipant && otherParticipant.name &&  participant.name && otherParticipant.name.toUpperCase() === participant.name.toUpperCase()){
                            mappedParticipant[otherProvider] = otherParticipant.id
                        }
                    })
                })
            }) 
        }
    })
    const ordered = {}
    Object.keys(result).sort().forEach(key => {
        ordered[key] = result[key]
    })
    return ordered
} 

module.exports = mapper