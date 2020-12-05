const bodyparser = require('body-parser')
const cors = require('cors')

module.exports = function(server) {
    server.use(cors())
    server.use(bodyparser.json())
    server.use(bodyparser.urlencoded({extended: false}))
} 