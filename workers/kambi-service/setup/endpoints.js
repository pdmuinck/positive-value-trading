const event = require('../services/event')
const betoffer = require('../services/betoffer')

module.exports = function(server) {

    server.get('/bookmakers/:book/events', async (req, resp) => {
        await event.getEvents(req.params.book, req.query.sport)
        .then(response => resp.send({provider: 'KAMBI', book: req.params.book, events: response.flat()}))
        .catch(error => resp.status(404).send(error.message))
    }),

    server.get('/bookmakers/:book/events/:eventId/betoffers', async (req, resp) => {
        await betoffer.getBetOffersByBookMakerAndEventIdandBetOfferType(req.params.book, req.params.eventId, req.query.type)
        .then(response => resp.send({provider: 'KAMBI', book: req.params.book, eventId: req.params.eventId, betOffers: response}))
        .catch(error => resp.status(404).send(error.message))
    })

    server.get('/groups/:group/participants', async (req, resp) => {
        await event.getParticipantByGroup(req.params.group)
        .then(response => {
            resp.send(response.flat().filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i))})
        .catch(error => resp.status(500).send(error.message))
    })

    server.get('/groups', async (req, resp) => {
        await event.getGroups()
        .then(response => resp.send(response))
        .catch(error => resp.status(500).send(error.message))
    })



}