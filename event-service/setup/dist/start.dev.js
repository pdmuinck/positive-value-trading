"use strict";

var betconstruct = require('../providers/betconstruct/betconstruct');

betconstruct.openWebSocket();

module.exports = function (server) {
  server.listen('3000', function (error) {
    if (error) {
      console.error('ERROR - Unable to start server.');
    } else {
      console.info("INFO - Server started on");
    }
  });
};