const event = require('../services/event')
const betoffer = require('../services/betoffer')

module.exports = function(server) {

    server.get('/bookmakers/:book/events', async (req, resp) => {
        await event.getEvents()
        .then(response => resp.send({provider: 'BETRADAR', book: req.params.book, data: response}))
        .catch(error => resp.status(500).send(error.message))
    })

    server.get('/bookmakers/:book/events/:eventId/betoffers', async(req, resp) => {
        await betoffer.getByEventId(req.params.eventId)
        .then(response => resp.send({provider: 'BETRADAR', book: req.params.book, eventId: req.params.eventId, data: response}))
        .catch(error => resp.status(500).send(error.message))
    })

} 