const orchestrator = require('../services/orchestrator')

module.exports = function(server) {

    server.get('/providers/:provider/books/:book/events/:eventId/betoffers', async (req, resp) => {
        if(!req.params.provider) resp.status(400).send('No odds provider in request.')
        await orchestrator.getBetOffers(req.params.provider, req.params.eventId, req.params.book)
        .then(response => resp.send(response))
        .catch(error => resp.status(404).send(error.message))
        
    })

    server.get('/providers/:provider/books/:book/events', async (req, resp) => {
        await orchestrator.getEvents(req.params.provider, req.params.book, req.query.sport)
        .then(response => resp.send(response))
        .catch(error => resp.status(404).send(error.message))
    })

    server.get('/', async(req, resp) => {
        resp.status(200).send('WORKER INTERFACE')
    })

} 