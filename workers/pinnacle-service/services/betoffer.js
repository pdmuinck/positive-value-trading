const axios = require('axios')

const pinnacleOptions = {
    headers: {
        'X-API-KEY': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R'
    }
}

const betOffer = {}

betOffer.getByEventId = async (eventId) => {
    return await axios.get('https://guest.api.arcadia.pinnacle.com/0.1/matchups/' + eventId + '/markets/related/straight', pinnacleOptions).then(response => parse(eventId, response.data)).catch(error => console.log(error))
}

function clean(betOption) {
    if(betOption === 'home'){
        return '1'
    } else if(betOption === 'away') {
        return '2'
    } else if(betOption === 'draw') {
        return 'X'
    } else {
        return betOption
    }
}

function parse(eventId, betOffers) {

    if(betOffers) {

        const mainBetOffers = betOffers.filter(betOffer => betOffer.matchupId == eventId)

        const moneylineFullTimeBetOffers = getBetOfferById(mainBetOffers, 's;0;m')

        if(moneylineFullTimeBetOffers && moneylineFullTimeBetOffers[0]) {
            return getPricesFromBetOffer(moneylineFullTimeBetOffers[0])
        }

        
        /*const specialBetOffers = betOffers.filter(betOffer => subEvents.map(event => event.id).includes(betOffer.matchupId))
        
        specialBetOffers.forEach(betOffer => {
            if(betOffer) {
                const open = betOffer.status ? betOffer.status.toUpperCase() === 'OPEN' ? true : false : false
                const product = subEvents.filter(event => event.id == betOffer.matchupId)[0]
                betOffer.prices.forEach(price => {
                    
                    const betOption = beautifyBetOption(product, product.betOptions.filter(option => option.optionId == price.participantId)[0])
                    values.push({provider: 'PINNACLE', eventId: betOffer.matchupId, product: product.product.description, betOption: betOption, price: toDecimalOdds(price.price), open: open})
                })
            }
        }) */
    }

}

function getBetOfferById(betOffers, id) {

    return betOffers.filter(betOffer => betOffer.key === id)

}

function getPricesFromBetOffer(betOffer) {

    let product
    
    if(betOffer.key === 's;0;m') product = 'moneyline_full_time'

    const prices = []

    const open = betOffer.status ? betOffer.status.toUpperCase() === 'OPEN' ? true : false : false

    const fairPrices = calculateFairPrices(betOffer.prices)

    betOffer.prices.forEach(price => {
        const fairPrice = fairPrices.filter(fairPrice => fairPrice.designation === price.designation)[0]
        prices.push({provider: 'PINNACLE', eventId: betOffer.matchupId, product: product, points: price.points, betOption: clean(price.designation), price: toDecimalOdds(price.price), fairPrice: fairPrice.fairPrice, open: open})
    })

    return prices
}

function toDecimalOdds(americanOdds) {

    if(americanOdds < 0) {
        return ((100 / Math.abs(americanOdds)) + 1).toFixed(2)
    } else {
        return ((americanOdds / 100) + 1).toFixed(2)
    }

}

function calculateFairPrices(prices) {
    const props = prices.map(price => {return {designation: price.designation, prop: 1/toDecimalOdds(price.price)}})
    
    let vig = 0

    props.forEach(prop => {
        vig += prop.prop
    })

    return props.map(prop => {return {designation: prop.designation, fairPrice: (1 / (prop.prop / vig)).toFixed(2)}})
    
    
}

function calculateWeightedFairPrices() {
    const props = prices.map(price => 1/toDecimalOdds(price.price))
    
    const margin = props.reduce((a, b) => a + b, 0) - 1
    
    const numberOfPrices = prices.length
    
    return prices.map(price => {return {designation: price.designation, fairPrice: ((numberOfPrices * toDecimalOdds(price.price)) / (numberOfPrices - (margin * toDecimalOdds(price.price)))).toFixed(2)}})
    
}

module.exports = betOffer