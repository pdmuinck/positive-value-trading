"use strict";

var api = require('../api');

module.exports = function (server) {
  server.get('/providers/:provider/bookmakers/:book/sports/:sport/events', function _callee(req, resp) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(api.getEventsByProviderAndBookAndSport(req.params.provider, req.params.book, req.params.sport).then(function (response) {
              return resp.send(response);
            })["catch"](function (error) {
              return resp.status(404).send(error.message);
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    });
  });
  server.get('/providers/:provider/bookmakers/:book/competitions/:competition/participants', function _callee2(req, resp) {
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(api.getParticipantsForProviderAndBookAndCompetition(req.params.provider, req.params.book, req.params.competition).then(function (response) {
              return resp.send(response);
            })["catch"](function (error) {
              console.log(error);
              resp.status(500).send(error.message);
            }));

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  server.get('/competitions/:competition/participants', function _callee3(req, resp) {
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(api.getParticipantsByCompetition(req.params.competition).then(function (response) {
              return resp.send(response);
            })["catch"](function (error) {
              console.log(error);
              resp.status(500).send(error.message);
            }));

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
  server.get('/sports/:sport/events', function _callee4(req, resp) {
    return regeneratorRuntime.async(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return regeneratorRuntime.awrap(api.getEventsBySport(req.params.sport).then(function (response) {
              return resp.send(response);
            })["catch"](function (error) {
              return resp.status(500).send(error.message);
            }));

          case 2:
          case "end":
            return _context4.stop();
        }
      }
    });
  });
  server.get('/providers/:provider/bookmakers/:book/events/:id/betoffers', function _callee5(req, resp) {
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return regeneratorRuntime.awrap(api.getBetOffers(req.params.provider, req.params.book, req.params.id).then(function (response) {
              return resp.send(response);
            })["catch"](function (error) {
              return resp.status(500).send(error.message);
            }));

          case 2:
          case "end":
            return _context5.stop();
        }
      }
    });
  });
};