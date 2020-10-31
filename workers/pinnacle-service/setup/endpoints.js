const event = require('../services/event')
const betoffer = require('../services/betoffer')

module.exports = function(server) {

    server.get('/bookmakers/:book/events', async (req, resp) => {
        await event.getEvents(req.params.book, req.query.sport)
        .then(response => resp.send({provider: 'PINNACLE', book: req.params.book, data: response}))
        .catch(error => resp.status(404).send(error.message))
    }),

    server.get('/bookmakers/:book/events/:eventId/betoffers', async (req, resp) => {
        await betoffer.getByEventId(req.params.eventId)
        .then(response => resp.send({provider: 'PINNACLE', book: req.params.book, data: response}))
        .catch(error => resp.status(404).send(error.message))
    })

} 