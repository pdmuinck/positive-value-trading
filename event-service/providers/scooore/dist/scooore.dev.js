"use strict";

var axios = require('axios');

var leagues = require('./resources/leagues.json');

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 1 * 1;
var eventCache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});
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
          if (!eventCache.get('EVENTS')) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", eventCache.get('EVENTS'));

        case 2:
          requests = leagues.map(function (league) {
            return axios.get('https://www.e-lotto.be/cache/evenueMarketGroupLimited/NL/' + league.id + '.1-0.json').then(function (response) {
              return transform(response.data.markets);
            })["catch"](function (error) {
              return null;
            });
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            results = values.flat();
            eventCache.set('EVENTS', results);
          }));

        case 5:
          return _context.abrupt("return", results);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

scooore.getParticipantsForCompetition = function _callee2(book, competition) {
  var league;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          league = leagues.filter(function (league) {
            return league.name === competition.toUpperCase();
          })[0];
          console.log(league);
          return _context2.abrupt("return", axios.get('https://www.e-lotto.be/cache/evenueMarketGroupLimited/NL/' + league.id + '.1-0.json').then(function (response) {
            return parseParticipants(response.data.markets);
          })["catch"](function (error) {
            return null;
          }));

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

function parseParticipants(events) {
  var parsedEvents = transform(events);
  return parsedEvents.map(function (event) {
    return event.participants;
  });
}

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