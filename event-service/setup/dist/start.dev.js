"use strict";

var betconstruct = require('../providers/betconstruct/betconstruct');

var magicbetting = require('../providers/magicbetting/magicbetting');

var starcasino = require('../providers/starcasino/starcasino');

var zetbet = require('../providers/zetbet/zetbet');

betconstruct.openWebSocket();
magicbetting.open();
zetbet.open();

module.exports = function (server) {
  server.listen('3000', function (error) {
    if (error) {
      console.error('ERROR - Unable to start server.');
    } else {
      console.info("INFO - Server started on");
    }
  });
};