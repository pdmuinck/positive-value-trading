const axios = require('axios')

const sports = {
    "FOOTBALL": 1,
    "TENNIS": 2,
    "ICE_HOCKEY": 10,
    "BASKETBALL": 12,
    "VOLLEYBALL": 23,
    "AMERICAN_FOOTBALL": 6,
    "AUSSIE_RULES": 43,
    "BASEBALL": 11,
    "BOXING": 7,
    "CRICKET": 70,
    "DARTS": 32,
    "ESPORTS": 91,
    "MMA": 100,
    "RUGBY": 18,
    "SNOOKER": 36
}

const betcenterHeaders = {
    headers: {
        "Accept": "application/json, text/plain, */*",
        "x-language": 2,
        "x-brand": 7,
        "x-location": 21,
        "x-client-country": 21,
        "Content-Type":"application/json"
    }
}

const betcenter = {}

betcenter.getEventsForBookAndSport = async(book, sport) => {
    const betcenterPayload = {"sportId":sports[sport.toUpperCase()],"gameTypes":[1, 4],"limit":20000,"jurisdictionId":30}
    return axios.post('https://oddsservice.betcenter.be/odds/getGames/8', betcenterPayload, betcenterHeaders).then(response => transform(response.data.games)).catch(error => null)
}

function transform(games) {
    return games.map(game => {return {id: game.id, participants: game.teams.map(team => {return {id: team.id, name: team.name}})}})
}

module.exports = betcenter