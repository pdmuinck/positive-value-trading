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
    const requests = [
        //spain
        axios.post('https://bet90.be/Sports/SportLeagueGames', {leagueId:117, categoryId:32, sportId:sports[sport.toUpperCase()]}, headers).then(response => transform(response.data)).catch(error => console.log(error)),
        axios.post('https://bet90.be/Sports/SportLeagueGames', {leagueId:276, categoryId:32, sportId:sports[sport.toUpperCase()]}, headers).then(response => transform(response.data)).catch(error => console.log(error)),
        // germany
        axios.post('https://bet90.be/Sports/SportLeagueGames', {leagueId:30, categoryId:19, sportId:sports[sport.toUpperCase()]}, headers).then(response => transform(response.data)).catch(error => console.log(error)),
        axios.post('https://bet90.be/Sports/SportLeagueGames', {leagueId:75, categoryId:19, sportId:sports[sport.toUpperCase()]}, headers).then(response => transform(response.data)).catch(error => console.log(error)),
        
        // england
        axios.post('https://bet90.be/Sports/SportLeagueGames', {leagueId:56, categoryId:34, sportId:sports[sport.toUpperCase()]}, headers).then(response => transform(response.data)).catch(error => console.log(error)),
        axios.post('https://bet90.be/Sports/SportLeagueGames', {leagueId:173, categoryId:34, sportId:sports[sport.toUpperCase()]}, headers).then(response => transform(response.data)).catch(error => console.log(error)),
        axios.post('https://bet90.be/Sports/SportLeagueGames', {leagueId:321, categoryId:34, sportId:sports[sport.toUpperCase()]}, headers).then(response => transform(response.data)).catch(error => console.log(error)),
        axios.post('https://bet90.be/Sports/SportLeagueGames', {leagueId:338, categoryId:34, sportId:sports[sport.toUpperCase()]}, headers).then(response => transform(response.data)).catch(error => console.log(error)),
        //serie a
        axios.post('https://bet90.be/Sports/SportLeagueGames', {leagueId:401, categoryId:4, sportId:sports[sport.toUpperCase()]}, headers).then(response => transform(response.data)).catch(error => console.log(error)),
        // france
        axios.post('https://bet90.be/Sports/SportLeagueGames', {leagueId:119, categoryId:62, sportId:sports[sport.toUpperCase()]}, headers).then(response => transform(response.data)).catch(error => console.log(error)),
        // netherlands
        axios.post('https://bet90.be/Sports/SportLeagueGames', {leagueId:307, categoryId:79, sportId:sports[sport.toUpperCase()]}, headers).then(response => transform(response.data)).catch(error => console.log(error)),
        // belgium
        axios.post('https://bet90.be/Sports/SportLeagueGames', {leagueId:457, categoryId:20, sportId:sports[sport.toUpperCase()]}, headers).then(response => transform(response.data)).catch(error => console.log(error)),
    ]

    let results

    await Promise.all(requests).then(values => {
        results = values.flat()
    })

    return results
    
}

function transform(events) {
    const parsedEvents = []
    const firstTeams = parser.parse(events).querySelectorAll('.first-team').map(team => {return {id: team.parentNode.id, team1: team.childNodes[1].childNodes[0].rawText}})
    const secondTeams = parser.parse(events).querySelectorAll('.second-team').map(team => {return {id: team.parentNode.id, team1: team.childNodes[1].childNodes[0].rawText}})
    const stats = parser.parse(events).querySelectorAll('.hg_nx_btn_stats').map(stat => {return {id: stat.parentNode.parentNode.parentNode.id, participantIds: stat.rawAttrs}})
    firstTeams.forEach(team => {
        const secondTeam = secondTeams.filter(secondTeam => secondTeam.id === team.id)[0]
        const stat = stats.filter(stat => stat.id === team.id)[0]
        parsedEvents.push({id: team.id, participants: [{id: stat.participantIds.split('team1id="')[1].split('\"\r\n')[0], name: team.team1}, {id: stat.participantIds.split('team2id="')[1].split('\"')[0], name: secondTeam.team1}]})
    })
    return parsedEvents
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