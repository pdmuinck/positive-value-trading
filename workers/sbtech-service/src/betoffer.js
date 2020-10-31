  
const axios = require('axios')
const bookmakers = require('./bookmakers')
const Token = require('./token')

const betOffer = {}

const options = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTaXRlSWQiOjI4LCJTZXNzaW9uSWQiOiI4MzE3MDFiZi05OTY5LTQ4MjUtOGY1Yi1mMTJmNDUzMGM5YjIiLCJuYmYiOjE1ODUwMzQ0MTQsImV4cCI6MTU4NTYzOTIxNCwiaWF0IjoxNTg1MDM0NDE0fQ.KM1O5DonDbAjTvCQYXMzVHfBUBO5p2UrFvRK52cazg0'
    }
}

betOffer.getByBookAndEventId = async (book, eventId) => {
    const token = await Token.getToken(book.toUpperCase(), bookmakers)

    const sbtechPayload = {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[eventId],"marketTypeRequests":[{"marketTypeIds":["1_0", "1_39", "2_0", "2_39", "3_0", "3_39"]}],"pagination":{"top":300,"skip":0}}
        
    options.headers['Authorization'] = 'Bearer ' + token

    const result = await axios.post(bookmakers[book.toUpperCase()].oddsUrl, sbtechPayload, options).then(res => parse(book.toUpperCase(), res.data.markets.filter(market => market.eventId === eventId))).catch(error => console.log(error))

    return result

}



function cleanBetOption(outcome) {
    if(outcome === 'Home') return '1'
    if(outcome === 'Away') return '2'
    if(outcome === 'Tie') return 'X'
    return outcome
}

function parse(book, markets) {

    const moneylineFullTimeBetOffers = getBetOfferById(markets, '1_0')

    if(moneylineFullTimeBetOffers && moneylineFullTimeBetOffers[0]) {
        return getPricesFromBetOffer(moneylineFullTimeBetOffers[0], book)
    }
}

function getBetOfferById(betOffers, id) {

    return betOffers.filter(betOffer => betOffer.marketType.id === id)

}

function getPricesFromBetOffer(betOffer, book) {

    let product

    if(betOffer.marketType.id === '1_0') product = 'moneyline_full_time'

    const values = []
    
    betOffer.selections.forEach(selection => {

        values.push({provider: 'SBTECH', book: book, eventId: betOffer.eventId, product: product, points: selection.points, betOption: cleanBetOption(selection.outcomeType), price: selection.trueOdds, open: !selection.isDisabled})

    })

    return values
}

module.exports = betOffer