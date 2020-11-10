const axios = require('axios')
const events = require('./events.json')

const api = {}

api.getEvents = (sport) => {
    //return axios.get('http://localhost:3003/events').then(res => res.data)
    return events
}

api.getBookmakers = () => {
    const bookmakers = 
    [
        {id: 'UNIBET_BELGIUM', logo: '/assets/unibet.png', alt: 'unibet_be'}, 
        {id: 'NAPOLEON_GAMES', logo: '/assets/napoleon_games.png', alt: 'napoleon'},
        {id: 'PINNACLE', logo: '/assets/pinnacle.png', alt: 'pinnacle'}, 
        {id: 'BET777', logo: '/assets/bet777.png', alt: 'bet777'}, 
        {id: 'BETFIRST', logo: '/assets/betfirst.png', alt: 'betfirst'}
    ]
    return bookmakers
}

api.getSports = () => {
    const sports = ['SOCCER']
    return sports
}

export default api