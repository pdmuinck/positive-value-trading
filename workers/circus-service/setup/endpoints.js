const event = require('../services/event')
const betoffer = require('../services/betoffer')

module.exports = function(server) {

    server.get('/events', async (req, resp) => {
        await event.getBySport(req.query.sport)
        .then(response => resp.send({provider: 'CIRCUS', book: 'CIRCUS', events: response}))
        .catch(error => resp.status(404).send(error.message))
    }),

    server.get('/events/:eventId/betoffers', async (req, resp) => {
        await event.getBetOffersByEventId(req.params.eventId)
        .then(response => resp.send({provider: 'CIRCUS', book: 'CIRCUS', eventId: req.params.eventId, betOffers: response}))
        .catch(error => resp.status(404).send(error.message))
    })

    server.get('/leagues/:league/participants', async (req, resp) => {
        await event.getParticipants(req.params.league)
        .then(response => {
            resp.send(response.flat().filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i))})
        .catch(error => resp.status(500).send(error.message))
    })
}