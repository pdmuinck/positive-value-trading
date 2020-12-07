const betconstruct = require('../providers/betconstruct/betconstruct')
const magicbetting = require('../providers/magicbetting/magicbetting')
const starcasino = require('../providers/starcasino/starcasino')
const zetbet = require('../providers/zetbet/zetbet')

module.exports = async function(server) {
  //await zetbet.open()
  server.listen('3000', (error) => {
    betconstruct.openWebSocket()
    magicbetting.open()
      if (error) {
        console.error('ERROR - Unable to start server.')
      } else {
        console.info(`INFO - Server started on`)
      }
    })
} 