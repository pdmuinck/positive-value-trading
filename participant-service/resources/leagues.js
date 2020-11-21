const axios = require('axios')
const leagues = {
    "EREDIVISIE": [
        axios.get('http://kambi:3000/leagues/1000094980/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/41372/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/1928/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/125/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/6931/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "JUPILER_PRO_LEAGUE": [
        axios.get('http://kambi:3000/leagues/1000094965/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/40815/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/1817/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/132/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/6898/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "SERIE_A": [
        axios.get('http://kambi:3000/leagues/1000095001/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/40030/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/2436/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/95/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/7134/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "SERIE_B": [
        axios.get('http://kambi:3000/leagues/1000095002/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/42884/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/2438/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/96/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/7125/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "PREMIER_LEAGUE": [
        axios.get('http://kambi:3000/leagues/1000095590/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/40253/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/1980/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/80/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/6823/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "CHAMPIONSHIP": [
        axios.get('http://kambi:3000/leagues/1000095045/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/40817/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/1977/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/122/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/6825/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "LEAGUE_ONE": [
        axios.get('http://kambi:3000/leagues/1000280417/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/40822/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/1957/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/123/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/6826/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "LEAGUE_TWO": [
        axios.get('http://kambi:3000/leagues/1000280418/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/40823/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/1958/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/124/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/6827/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "LA_LIGA": [
        axios.get('http://kambi:3000/leagues/1000095049/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/40031/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/2196/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/92/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/6938/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "LA_LIGA_2": [
        axios.get('http://kambi:3000/leagues/1000094708/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/44411/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/2432/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/93/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/6939/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "LIGUE_1": [
        axios.get('http://kambi:3000/leagues/1000094991/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/40032/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/2036/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/87/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/6855/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "LIGUE_2": [
        axios.get('http://kambi:3000/leagues/1000094568/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/52971/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/2037/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/117/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/6857/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "BUNDESLIGA_1": [
        axios.get('http://kambi:3000/leagues/1000345237/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/40481/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/1842/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/107/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/6843/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ],
    "BUNDESLIGA_2": [
        axios.get('http://kambi:3000/leagues/1000094993/participants').then(response => {return {provider: 'KAMBI', participants: response.data}}),
        axios.get('http://sbtech:3001/leagues/40820/participants').then(response => {return {provider: 'SBTECH', participants: response.data}}),
        axios.get('http://pinnacle:3005/leagues/1843/participants').then(response => {return {provider: 'PINNACLE', participants: response.data}}),
        axios.get('http://meridian:3006/leagues/108/participants').then(response => {return {provider: 'MERIDIAN', participants: response.data}}),
        axios.get('http://betcenter:3007/leagues/6845/participants').then(response => {return {provider: 'BETCENTER', participants: response.data}}),
    ]
}

module.exports = leagues