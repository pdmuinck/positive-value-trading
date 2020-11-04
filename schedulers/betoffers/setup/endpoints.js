const betoffer = require('../services/betoffer')

module.exports = function(server) {

    server.get('/betoffers', async (req, resp) => {
        await betoffer.getBetOffers()
        .then(response => resp.send(response))
        .catch(error => resp.status(500).send(error.message))
    })

    server.get('/events/:eventId/betoffers', async (req, resp) => {
        await betoffer.getBetOffersByEventId(req.params.eventId)
        .then(response => resp.send(response))
        .catch(error => resp.status(500).send(error.message))
    })


} 