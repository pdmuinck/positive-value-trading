"use strict";

var axios = require('axios');

var leagues = require('./resources/leagues.json');

var sports = {
  "FOOTBALL": 1
};
var scooore = {};

scooore.getEventsForBookAndSport = function _callee(book, sport) {
  var requests, results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          requests = leagues.map(function (league) {
            return axios.get('https://www.e-lotto.be/cache/evenueMarketGroupLimited/NL/' + league.id + '.1-0.json').then(function (response) {
              return transform(response.data.markets);
            })["catch"](function (error) {
              return null;
            });
          });
          _context.next = 3;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            results = values.flat();
          }));

        case 3:
          return _context.abrupt("return", results);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

function transform(events) {
  return events.map(function (event) {
    return {
      id: event.idfoevent,
      participants: [{
        id: event.participantname_home,
        name: event.participantname_home
      }, {
        id: event.participantname_away,
        name: event.participantname_away
      }]
    };
  });
}

module.exports = scooore;