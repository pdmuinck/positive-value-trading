const axios = require('axios')
const bookmakers = require('./bookmakers')
const Token = require('./token')

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

const event = {}

event.getEvents = async (book, sports) => {
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
    return events
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
        return axios.post(bookmaker.dataUrl, page, headers).then(response => {return {provider: 'SBTECH', book: book, page: page.pagination, events: response.data.events}}).catch(error => console.log(error))
    })
}

module.exports = event