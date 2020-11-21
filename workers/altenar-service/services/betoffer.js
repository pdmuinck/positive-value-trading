const axios = require('axios')

const betoffer = {}

const betcenterHeaders = {
    headers: {
        "Connection": "keep-alive",
        "Accept": "application/json, text/plain, */*",
        "x-language": 2,
        "x-brand": 7,
        "x-location": 21,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
        "x-client-country": 21,
        "Content-Type":"application/json",
        "Origin": "https://www.betcenter.be",
        "Accept-Language": "en-US,en;q=0.9"
    }
}

const productMapping = {
    "Who will win the match?": "MONEYLINE_FULL_TIME",
    "1st Halftime": "MONEYLINE_HALF_TIME",
    "Over + / Under - 05": "OVER_UNDER_0.5",
    "1st Half Over + / Under - 05": "OVER_UNDER_0.5_HALF_TIME",
    "Over + / Under - 15": "OVER_UNDER_1.5",
    "1st Half Over + / Under - 15": "OVER_UNDER_1.5_HALF_TIME",
    "Over + / Under - 25": "OVER_UNDER_2.5",
    "1st Half Over + / Under - 25": "OVER_UNDER_2.5_HALF_TIME",
    "Over + / Under - 35": "OVER_UNDER_3.5",
    "1st Half Over + / Under - 35": "OVER_UNDER_3.5_HALF_TIME",
    "Over + / Under - 45": "OVER_UNDER_4.5",
    "1st Half Over + / Under - 45": "OVER_UNDER_4.5_HALF_TIME",
    "Over + / Under - 55": "OVER_UNDER_5.5",
    "Over + / Under - 65": "OVER_UNDER_6.5",
    "Handicap 0:1": "HANDICAP_0_1",
    "H1 Handicap 0:1": "HANDICAP_0_1_HALF_TIME",
    "Handicap 0:2": "HANDICAP_0_2",
    "H1 Handicap 0:2": "HANDICAP_0_2_HALF_TIME",
    "Handicap 0:3": "HANDICAP_0_3",
    "Handicap 1:0": "HANDICAP_1_0",
    "H1 Handicap 1:0": "HANDICAP_1_0_HALF_TIME",
    "Handicap 2:0": "HANDICAP_2_0",
    "H1 Handicap 2:0": "HANDICAP_2_0_HALF_TIME",
    "Handicap 3:0": "HANDICAP_3_0",
    "Double Chance": "DOUBLE_CHANCE",
    "H1 Double chance": "DOUBLE_CHANCE_HALF_TIME",
    "Goals in game": "TOTAL_GOALS",
    "Total goals Team 1": "TOTAL_GOALS_1",
    "Total goals Team 2": "TOTAL_GOALS_2"
}

betoffer.findByEventId =  async (eventId) => {
    const betcenterPayload = {"gameIds":[parseInt(eventId)],"gameTypes":[1, 4],"limit":20000,"jurisdictionId":30}
    return axios.post('https://oddsservice.betcenter.be/odds/getGames/8', betcenterPayload, betcenterHeaders).then(response => parse(response.data.games[0].markets)).catch(error => null)
}

function parse(betOffers) {
    const tips = []
    Object.entries(productMapping).forEach(product => {
        const prices = betOffers.filter(betOffer => betOffer.text.replace(',', '').replace('.', '') === product[0]).map(betOffer => betOffer.tips).flat().map(tip => {return {betOption: tip.text.toUpperCase(), odds: tip.odds/100}})
        tips.push({product: product[1], prices: prices})
    })
    return tips
}


module.exports = betoffer