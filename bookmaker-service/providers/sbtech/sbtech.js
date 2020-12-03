const axios = require('axios')
const bookmakers = require('./bookmakers')
const Token = require('./token')
const leagues = require('./leagues.json')

const sportMap = {
    "FOOTBALL": "1", // soccer
    "BASKETBALL": "2", // basketball
    "AMERICAN_FOOTBALL": "3", // american football
    "TENNIS": "6", // tennis
    "BASEBALL": "7", // baseball
    "ICE_HOCKEY": "8", // ice-hockey
    "VOLLEYBALL": "19", // volleyball
    "BOXING": "20", // boxing
    "TABLE_TENNIS": "26", // table-tennis
    "MMA": "43", // MMA UFC
    "ESPORTS": "64", // esports
    "GOLF": "12", // golf
    "SNOOKER": "13", // snooker
    "CRICKET": "59", // cricket
    "RUGBY_LEAGUE": "11", // rugby league
    "RUGBY_UNION": "35", // rugby union
    "AUSTRALIAN_RULES": "41", // aussie rules
}

const sbtech = {}

sbtech.getBetOffersForBookAndEventId = async(book, eventId) => {
    const token = await Token.getToken(book.toUpperCase(), bookmakers)
    const sbtechPayload = {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[eventId],"marketTypeRequests":[{"marketTypeIds":["1_0", "1_39", "2_0", "2_39", "3_0", "3_39"]}],"pagination":{"top":300,"skip":0}}  
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'locale': 'en'
        }
    }
    const result = await axios.post(bookmakers[book.toUpperCase()].oddsUrl, sbtechPayload, headers).then(res => parse(book.toUpperCase(), res.data.markets.filter(market => market.eventId === eventId))).catch(error => console.log(error))
    return result
}

sbtech.getParticipantsForCompetition = async (book, competition) => {
    const token = await Token.getToken(book, bookmakers)
    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'locale': 'en'
        }
    }
    const body = {"eventState":"Mixed","eventTypes":["Fixture","AggregateFixture"],"ids":[]}
    const leagueId = leagues.filter(league => league.name.toUpperCase() === competition.toUpperCase()).map(league => league.id)
    body.ids = leagueId
    return await axios.post('https://sbapi.sbtech.com/' + bookmakers[book.toUpperCase()].name + '/sportscontent/sportsbook/v1/Events/GetByLeagueId', body, headers)
    .then(response => response.data.events.map(event => event.participants.map(participant => {return {id: participant.id, name: participant.name.toUpperCase()}}))).catch(error => console.log(error))
}

sbtech.getEventsForBookAndSport = async (book, sports) => {
    const token = await Token.getToken(book, bookmakers)
    
    let requests = []

    if(sports && Array.isArray(sports)) {
        sports.forEach(sport => {
            const axiosRequests = createRequest(book, sportMap[sport.toUpperCase()], token)
            axiosRequests.forEach(req => requests.push(req))
        })
    } else if(sports) {
        requests = createRequest(book, sportMap[sports.toUpperCase()], token)
    } else {
        Object.keys(sportMap).forEach(key => {
            requests = createRequest(book, sportMap[key], token)
        })
    }

    let events
    await Promise.all(requests).then((values) => {
        events = values
    })
    return events.flat()
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

    const prices = betOffer.selections.map(selection => {
        return {points: selection.points, betOption: cleanBetOption(selection.outcomeType), odds: selection.trueOdds, open: !selection.isDisabled}
    })

    return {product: product, prices: prices}
}

function createRequest(book, sport, token) {

    const bookmaker = bookmakers[book.toUpperCase()]

    pages = [
        {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[sport],"pagination":{"top":300,"skip":0}},
        {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[sport],"pagination":{"top":300,"skip":300}},
        {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[sport],"pagination":{"top":300,"skip":600}},
        {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[sport],"pagination":{"top":300,"skip":900}},
        {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[sport],"pagination":{"top":300,"skip":1200}},
        {"eventState":"Mixed","eventTypes":["Fixture"],"ids":[sport],"pagination":{"top":300,"skip":1500}},
    ]

    const headers = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'locale': 'en'
        }
    }

    return pages.map(page => {
        return axios.post(bookmaker.dataUrl, page, headers).then(response => transform(response.data.events)).catch(error => console.log(error))
    })

    function transform(events) {
        return events.map(event => {return {id: event.id, participants: event.participants.map(participant => {return {id: participant.id, name: participant.name}})}})
    }
}

module.exports = sbtech