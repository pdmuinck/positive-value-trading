const mapper = {}

mapper.map = (participants) => {
    const result = {}
    participants.forEach(book => {
        book.participants.forEach(participant => {
            const provider = book.provider.toUpperCase()
            let mappedParticipant = result[participant.name.toUpperCase()]
            if(!mappedParticipant){
                result[participant.name.toUpperCase()] = {}
                result[participant.name.toUpperCase()][provider.toLowerCase()] = participant.id
                mappedParticipant = result[participant.name.toUpperCase()]
            }
            participants.filter(other => other.provider !== book.provider).forEach(otherBook => {
                otherBook.participants.forEach(otherParticipant => {
                    otherProvider = otherBook.provider.toLowerCase()
                    if(otherParticipant.name.toUpperCase() === participant.name.toUpperCase()){
                        mappedParticipant[otherProvider] = otherParticipant.id
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