const axios = require('axios')
const leagues = {
    "EREDIVISIE": [
        axios.get('http://kambi:3000/leagues/1000094980/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/41372/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/1928/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/125/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}})
    ],
    "JUPILER_PRO_LEAGUE": [
        axios.get('http://kambi:3000/leagues/1000094965/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/40815/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/1817/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/132/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}})
    ]
}

module.exports = leagues