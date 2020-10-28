const event = require('../services/event')
const betoffer = require('../services/betoffer')

module.exports = function(server) {

    server.get('/events', async (req, resp) => {
        await event.getEvents()
        .then(response => resp.send(response))
        .catch(error => resp.status(500).send(error.message))
    })

    server.get('/events/:eventId/betoffers', async(req, resp) => {
        await betoffer.getByEventId(req.params.eventId)
        .then(response => resp.send(response))
        .catch(error => resp.status(500).send(error.message))
    })

} 