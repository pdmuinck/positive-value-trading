const betconstruct = require('../providers/betconstruct/betconstruct')
const magicbetting = require('../providers/magicbetting/magicbetting')
const starcasino = require('../providers/starcasino/starcasino')
const zetbet = require('../providers/zetbet/zetbet')

betconstruct.openWebSocket()
magicbetting.open()
zetbet.open()

module.exports = function(server) {
    server.listen('3000', (error) => {
        if (error) {
          console.error('ERROR - Unable to start server.')
        } else {
          console.info(`INFO - Server started on`)
        }
      })
} 