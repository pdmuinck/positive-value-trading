const axios = require('axios')

const betoffer = {}

betoffer.getBetOffersForEventId = async (eventId) => {

    const url = 'https://meridianbet.be/sails/events/' + eventId

    const betOffers = await axios.get(url).then(response => response.data.market)
                            .catch(error => console.log(error))
    
    if(betOffers) {
        const moneylineFullTimeBetOffers = findBetOfferById(betOffers, '3999')
        if(moneylineFullTimeBetOffers && moneylineFullTimeBetOffers[0]) {
            return getPricesFromBetOffer(moneylineFullTimeBetOffers[0])
        }
    }
}
function getPricesFromBetOffer( betOffer) {
    let product
    if(betOffer.templateId === '3999') product = 'moneyline_full_time'

    const prices = betOffer.selection.map(outcome => {
        const betOption = outcome.nameTranslations.filter(translation => translation.locale === 'en').map(translation => translation.translation)[0]
        const odds = outcome.price
        const open = outcome.state === 'ACTIVE' ? true : false
        return {betOption: betOption, odds: odds, open: open}
    })

    return {product: product, prices: prices}
}

function findBetOfferById(betOffers, id) {
    return betOffers.filter(betOffer => betOffer.templateId === id)
} 


module.exports = betoffer