const event = require('../services/event')

module.exports = function(server) {

    server.get('/events', async (req, resp) => {
        // gets active events
        await event.getEvents()
        .then(response => resp.send(response))
        .catch(error => resp.status(500).send(error.message))
    })

    server.get('/bookmakers', async(req, resp) => {
        resp.send([
            {id: 'UNIBET_BELGIUM', logo: '/assets/unibet.png', alt: 'unibet_be'}, 
            {id: 'NAPOLEON_GAMES', logo: '/assets/napoleon_games.png', alt: 'napoleon'},
            {id: 'PINNACLE', logo: '/assets/pinnacle.png', alt: 'pinnacle'}, 
            {id: 'BET777', logo: '/assets/bet777.png', alt: 'bet777'}, 
            {id: 'BETFIRST', logo: '/assets/betfirst.png', alt: 'betfirst'}
        ])
    })

} 