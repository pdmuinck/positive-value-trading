const axios = require("axios")

const bla = new Date()
const dd = String(bla.getDate()).padStart(2, "0");
const mm = String(bla.getMonth() + 1).padStart(2, "0"); //January is 0!
const yyyy = bla.getFullYear();

const today = [yyyy, mm, dd].join("-")

const requests = {
    
    "FOOTBALL": "https://meridianbet.be/sails/sidebar-sport/58/" + today,
    
    "BASKETBALL": "https://meridianbet.be/sails/sidebar-sport/55/" + today,
    
    "TABLE_TENNIS": "https://meridianbet.be/sails/sidebar-sport/89/" + today,
    
    "CS": "https://meridianbet.be/sails/sidebar-sport/130/" + today,
    
    "DOTA": "https://meridianbet.be/sails/sidebar-sport/132/" + today,
    
    "LOL": "https://meridianbet.be/sails/sidebar-sport/134/" + today,
    
    "STARTCRAFT": "https://meridianbet.be/sails/sidebar-sport/137/" + today,
    
    "RAINBOW_SIX": "https://meridianbet.be/sails/sidebar-sport/138/" + today,
    
    "TENNIS": "https://meridianbet.be/sails/sidebar-sport/56/" + today,
    
    "VOLLEYBALL": "https://meridianbet.be/sails/sidebar-sport/54/" + today,
    
    "HOCKEY": "https://meridianbet.be/sails/sidebar-sport/59/" + today,
    
    "AMERICAN_FOOTBALL": "https://meridianbet.be/sails/sidebar-sport/80/" + today,
    
    "AUSSIE_RULES": "https://meridianbet.be/sails/sidebar-sport/120/" + today,
    
    "BASEBALL": "https://meridianbet.be/sails/sidebar-sport/63/" + today,
    
    "BOXING": "https://meridianbet.be/sails/sidebar-sport/76/" + today,
    
    "CRICKET": "https://meridianbet.be/sails/sidebar-sport/66/" + today,
    
    "GOLF": "https://meridianbet.be/sails/sidebar-sport/85/" + today,
    
    "MMA": "https://meridianbet.be/sails/sidebar-sport/87/" + today,
    
    "RUGBY_LEAGUE": "https://meridianbet.be/sails/sidebar-sport/94/" + today,
    "RUGBY_UNION": "https://meridianbet.be/sails/sidebar-sport/65/" + today,
    
    "SNOOKER": "https://meridianbet.be/sails/sidebar-sport/69/" + today,
} 

const event = {}

event.getEvents = async (book, sports) => {

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
    return axios.get(url).then(response => transform(response.data.regions.map(region => region.leagues).flat().map(league => league.events).flat())).catch(error => null)
}

function transform(events) {
    return events.map(event => {return {id: event.id, participants: event.team.map(team => {return {id: team.id, name: team.name}})}})
}

async function resolve(requests) {
    let events
    await Promise.all(requests).then((values) => {
        events = values
    })
    return events
}

module.exports = event