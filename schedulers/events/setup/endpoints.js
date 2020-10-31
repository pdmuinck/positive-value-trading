const event = require('../services/event')

module.exports = function(server) {

    server.get('/events', async (req, resp) => {
        // gets active events
        await event.getEvents()
        .then(response => resp.send(response))
        .catch(error => resp.status(500).send(error.message))
    })

} 