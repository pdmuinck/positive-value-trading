const axios = require('axios')
const betoffers = require('./betoffers.json')

const api = {}

api.getBetOffers = (event, bookmakers) => {
    const foundBetOffers = []
    //return axios.get('http://localhost:3004/betoffers').then(res => res.data)
    if(event.kambiEvent) {
        betoffers.filter(betoffer => betoffer.provider === 'KAMBI' && betoffer.eventId == event.kambiEvent.id).forEach(foundOne => {
            foundBetOffers.push(foundOne)
        })
    } else {
        foundBetOffers.push(
            {book: "NAPOLEON_GAMES", data: null},
            {book: "UNIBET_BELGIUM", data: null} 
        )
    }
    if(event.sbtechEvent) {
        betoffers.filter(betoffer => betoffer.provider === 'SBTECH' && betoffer.eventId == event.sbtechEvent.id).forEach(foundOne => {
            foundBetOffers.push(foundOne)
        })
    } else {
        foundBetOffers.push(
            {book: "BET777", data: null},
            {book: "BETFIRST", data: null} 
        )
    }
    if(event.pinnacleEventId) {
        betoffers.filter(betoffer => betoffer.book === 'PINNACLE' && betoffer.eventId == event.pinnacleEventId).forEach(foundOne => {
            foundBetOffers.push(foundOne)
        })
    } else {
        foundBetOffers.push(
            {book: "PINNACLE", data: null},
        )
    }

    const sortedBetOffers = []
    bookmakers.forEach(book => {
        foundBetOffers.filter(betOffer => betOffer.book === book.id).forEach(offer => {
            sortedBetOffers.push(offer)
        })
    })
    return sortedBetOffers
}

export default api