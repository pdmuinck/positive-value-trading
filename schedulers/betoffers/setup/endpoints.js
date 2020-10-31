const betoffer = require('../services/betoffer')

module.exports = function(server) {

    server.get('/betoffers', async (req, resp) => {
        // gets active events
        await betoffer.getBetOffers()
        .then(response => resp.send(response))
        .catch(error => resp.status(500).send(error.message))
    })


} 