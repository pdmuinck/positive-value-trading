"use strict";

var betconstruct = require('../providers/betconstruct/betconstruct');

var magicbetting = require('../providers/magicbetting/magicbetting');

var starcasino = require('../providers/starcasino/starcasino');

var zetbet = require('../providers/zetbet/zetbet');

module.exports = function _callee(server) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //await zetbet.open()
          server.listen('3000', function (error) {
            betconstruct.openWebSocket();
            magicbetting.open();
            starcasino.openWebSocket();

            if (error) {
              console.error('ERROR - Unable to start server.');
            } else {
              console.info("INFO - Server started on");
            }
          });

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};