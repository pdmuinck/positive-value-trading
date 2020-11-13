const axios = require("axios")
const leagues = require('../resources/leagues.json')

const bla = new Date()
const dd = String(bla.getDate()).padStart(2, "0");
const mm = String(bla.getMonth() + 1).padStart(2, "0"); //January is 0!
const yyyy = bla.getFullYear();

const today = [yyyy, mm, dd].join("-")

const requests = {
    "FOOTBALL": "https://meridianbet.be/sails/sport/58",
    "BASKETBALL": "https://meridianbet.be/sails/sport/55",
    "TABLE_TENNIS": "https://meridianbet.be/sails/sport/89",  
    "CS": "https://meridianbet.be/sails/sport/130",
    "DOTA": "https://meridianbet.be/sails/sport/132",
    "LOL": "https://meridianbet.be/sails/sport/134",
    "STARTCRAFT": "https://meridianbet.be/sails/sport/137",
    "RAINBOW_SIX": "https://meridianbet.be/sails/sport/138",
    "TENNIS": "https://meridianbet.be/sails/sport/56",
    "VOLLEYBALL": "https://meridianbet.be/sails/sport/54",
    "HOCKEY": "https://meridianbet.be/sails/sport/59",
    "AMERICAN_FOOTBALL": "https://meridianbet.be/sails/sport/80",
    "AUSSIE_RULES": "https://meridianbet.be/sails/sport/120",
    "BASEBALL": "https://meridianbet.be/sails/sport/63",
    "BOXING": "https://meridianbet.be/sails/sport/76",
    "CRICKET": "https://meridianbet.be/sails/sport/66",
    "GOLF": "https://meridianbet.be/sails/sport/85",
    "MMA": "https://meridianbet.be/sails/sport/87",
    "RUGBY_LEAGUE": "https://meridianbet.be/sails/sport/94",
    "RUGBY_UNION": "https://meridianbet.be/sails/sport/65",
    "SNOOKER": "https://meridianbet.be/sails/sport/69",
} 

const event = {}

event.getParticipants = async (leagueId) => {
    const url = leagues.filter(league => league.id == leagueId)[0].url
    return await axios.get(url).then(response => response.data[0].events.map(event => event.team)).catch(error => null)
}

event.getEvents = async (sports) => {
    if(sports && Array.isArray(sports)) {
        const sportsUpperCase = sports.map(sport => sport.toUpperCase())
        return resolve(Object.entries(requests).filter(pair => sportsUpperCase.includes(pair[0])).map(pair => createRequest(pair[1])))
    } else if(sports) {
        return resolve(Object.entries(requests).filter(pair => sports.toUpperCase() === pair[0]).map(pair => createRequest(pair[1])))
    } else {
        return resolve(Object.values(requests).map(url => createRequest(url)))
    }
}

function createRequest(url) {
    return axios.get(url).then(response => transform(response.data.events.map(events => events.events).flat())).catch(error => null)
}

function transform(events) {
    return events.map(event => {return {id: event.id, participants: event.team}})
}

async function resolve(requests) {
    let events
    await Promise.all(requests).then((values) => {
        events = values
    })
    return events
}

module.exports = event