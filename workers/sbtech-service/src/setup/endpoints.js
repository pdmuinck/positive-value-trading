const event = require('../event')
const betoffer = require('../betoffer')

module.exports = function(server) {

    server.get('/bookmakers/:book/events', async (req, resp) => {
        await event.getEvents(req.params.book, req.query.sport)
        .then(response => resp.send({provider: 'SBTECH', book: req.params.book, events: response.flat()}))
        .catch(error => resp.status(404).send(error.message))
    }),

    server.get('/bookmakers/:book/events/:eventId/betoffers', async (req, resp) => {
        await betoffer.getByBookAndEventId(req.params.book, req.params.eventId)
        .then(response => resp.send({provider: 'SBTECH', book: req.params.book, eventId: req.params.eventId, data: response}))
        .catch(error => resp.status(404).send(error.message))
    }),

    server.get('/', async (req, resp) => {
        resp.status(200).send('The api')
    })

    server.get('/leagues/:league/participants', async(req, resp) => {
        await event.getParticipants(req.params.league)
        .then(response => {
            resp.send(response.flat().filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i))})
        .catch(error => resp.status(500).send(error.message))
    })

} 