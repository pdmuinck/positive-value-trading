const participant = require('../services/participant')

module.exports = function(server) {

    server.get('/leagues/:league/participants', async (req, resp) => {
        await participant.getByLeague(req.params.league)
        .then(response => resp.send(response))
        .catch(error => resp.status(500).send(error.message))
    }),

    server.get('/leagues/:league/participants/dev', async(req, resp) => {
        await participant.getByLeagueDev(req.params.league)
        .then(response => resp.send(response))
        .catch(error => resp.status(500).send(error.message))
    })



}