const event = require('../test')

module.exports = function(server) {

    server.get('/events', async (req, resp) => {
        await event.getById('indexLinks')
        .then(response => resp.send({provider: 'ZETBET', events: response}))
        .catch(error => resp.status(404).send(error.message))
    }),

    server.get('/bookmakers/:book/events/:eventId/betoffers', async (req, resp) => {
        await betoffer.getByEventId(req.params.eventId)
        .then(response => resp.send({provider: 'PINNACLE', book: req.params.book, eventId: req.params.eventId, betOffers: response}))
        .catch(error => resp.status(404).send(error.message))
    }),

    server.get('/leagues/:league/participants', async (req, resp) => {
        await event.getParticipants(req.params.league)
        //.then(response => resp.send(response.flat().filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)))
        .then(response => resp.send(response.flat().filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)))
        .catch(error => resp.status(404).send(error.message))
    })

} 