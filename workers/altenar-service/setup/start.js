module.exports = function(server) {
    server.listen('3007', (error) => {
        if (error) {
          console.error('ERROR - Unable to start server.')
        } else {
          console.info(`INFO - Server started on`)
        }
      })
} 