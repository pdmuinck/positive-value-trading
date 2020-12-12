const api = require('../api')

module.exports = function(server) {

    server.get('/providers/:provider/bookmakers/:book/sports/:sport/events', async (req, resp) => {
        await api.getEventsByProviderAndBookAndSport(req.params.provider, req.params.book, req.params.sport)
        .then(response => resp.send((response)))
        .catch(error => resp.status(404).send(error.message))
    })

    server.get('/providers/:provider/bookmakers/:book/competitions/:competition/participants', async (req, resp) => {
        await api.getParticipantsForProviderAndBookAndCompetition(req.params.provider, req.params.book, req.params.competition)
        .then(response => resp.send(response))
        .catch(error => {
            console.log(error)
            resp.status(500).send(error.message)
        })
    })

    server.get('/competitions/:competition/participants', async (req, resp) => {
        await api.getParticipantsByCompetition(req.params.competition)
        .then(response => resp.send(response))
        .catch(error => {
            console.log(error)
            resp.status(500).send(error.message)
        })
    })

    server.get('/sports/:sport/events', async (req, resp) => {
        await api.getEventsBySport(req.params.sport)
        .then(response => resp.send(response))
        .catch(error => resp.status(500).send(error.message))
    })

    server.get('/providers/:provider/bookmakers/:book/events/:id/betoffers', async (req, resp) => {
        await api.getBetOffers(req.params.provider, req.params.book, req.params.id)
        .then(response => resp.send(response))
        .catch(error => resp.status(500).send(error.message))
    })
}