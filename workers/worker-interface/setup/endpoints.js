const orchestrator = require('../services/orchestrator')

module.exports = function(server) {

    server.post('/providers/:provider/events/:eventId/betoffers', async (req, resp) => {
        if(!req.params.provider) resp.status(400).send('No odds provider in request.')
        await orchestrator.sendToProvider(req.params.provider, req.params.eventId, req.body)
        .then(response => resp.send(response))
        .catch(error => resp.status(404).send(error.message))
        
    })

    server.get('/', async(req, resp) => {
        resp.status(200).send('WORKER INTERFACE')
    })

} 