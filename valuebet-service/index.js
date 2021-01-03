
const endpoints = require('./setup/endpoints')
const middlewares = require('./setup/middlewares')
const start = require('./setup/start')

process.on('warning', e =

const server = express()

middlewares(server)

endpoints(server)

start(server)