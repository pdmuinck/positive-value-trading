const axios = require('axios')
const bookmakers = require('../resources/bookmakers.json')
const betofferTypes = require('../resources/betoffer-type.json')

const betoffer = {}

betoffer.getBetOffersByBookMakerAndEventIdandBetOfferType = async (book, eventId, type) => {

    const bookmakerInfo = Object.entries(bookmakers).filter(pair => pair[0] === book.toUpperCase()).map(pair => pair[1])[0]

    if(!bookmakerInfo) throw new Error('Book not found: ' + book)

    let url = 'https://{host}/offering/v2018/{book}'.replace('{host}', bookmakerInfo.host).replace('{book}', bookmakerInfo.code)  + '/betoffer/event/' + eventId + '.json'

    if(type) {
        url += '?type=' + betofferTypes[type]
    }

    const betOffers = await axios.get(url).then(response => response.data.betOffers)
                            .catch(error => console.log(error))
    
    if(betOffers) {

        const moneylineFullTimeBetOffers = findBetOfferById(betOffers, 1001159858)

        if(moneylineFullTimeBetOffers && moneylineFullTimeBetOffers[0]) {
            return getPricesFromBetOffer(book, moneylineFullTimeBetOffers[0])
        }
    }
}
function getPricesFromBetOffer(book, betOffer) {
    const values = []
    let product
    if(betOffer.criterion.id === 1001159858) product = 'moneyline_full_time'

    const prices = betOffer.outcomes.map(outcome => {
        let betOption = outcome.englishLabel
        const odds = outcome.odds / 1000
        const open = outcome.status === 'OPEN' ? true : false
        return {betOption: betOption, odds: odds, open: open}
    })
    return {product: product, prices: prices}
}

function findBetOfferById(betOffers, id) {
    return betOffers.filter(betOffer => betOffer.criterion.id === id)
} 


module.exports = betoffer