const axios = require('axios')
const parser = require('node-html-parser')

const headers = {
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8',
    }
}

const sports = {
    "FOOTBALL": 1
}



bet90 = {}

bet90.getEventsForBookAndSport = async (book, sport) => {
    const payload = {leagueId:117, categoryId:32, sportId:sports[sport.toUpperCase()]}
    return axios.post('https://bet90.be/Sports/SportLeagueGames', payload, headers).then(response => transform(response.data)).catch(error => console.log(error))
    
}

function transform(events) {
    const test = parser.parse(events).querySelectorAll('.first-team').map(event => event.parentNode.id)
    console.log(test)
    
    return JSON.parse(JSON.safeStringify(parser.parse(events).querySelectorAll('.first-team')))
}

JSON.safeStringify = (obj, indent = 2) => {
    let cache = [];
    const retVal = JSON.stringify(
      obj,
      (key, value) =>
        typeof value === "object" && value !== null
          ? cache.includes(value)
            ? undefined // Duplicate reference found, discard key
            : cache.push(value) && value // Store value in our collection
          : value,
      indent
    );
    cache = null;
    return retVal;
  }




module.exports = bet90