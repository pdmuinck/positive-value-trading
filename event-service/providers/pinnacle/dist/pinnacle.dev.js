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
var options = {
  headers: {
    'X-API-KEY': 'CmX2KcMrXuFmNg6YFbmTxE0y9CIrOi0R'
  }
};
var requests = {
  'FOOTBALL': 29,
  'BASKETBALL': 4,
  'AMERICAN_FOOTBALL': 15,
  'TENNIS': 33,
  'ESPORTS': 12,
  'MMA': 22,
  'BASEBALL': 3,
  'AUSSIE_RULES': 39,
  'BOXING': 6,
  'CRICKET': 8,
  'GOLF': 17,
  'ICE_HOCKEY': 19,
  'RUGBY_LEAGUE': 26,
  'RUGBY_UNION': 27,
  'SNOOKER': 28,
  'DARTS': 10
};
var event = {};

event.getParticipantsForCompetition = function _callee(book, competition) {
  var id, url;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = leagues.filter(function (league) {
            return league.name === competition.toUpperCase();
          }).map(function (league) {
            return league.id;
          });
          url = 'https://guest.api.arcadia.pinnacle.com/0.1/leagues/' + id + '/matchups';
          _context.next = 4;
          return regeneratorRuntime.awrap(axios.get(url, options).then(function (response) {
            return response.data.filter(function (event) {
              return !event.parentId;
            }).map(function (event) {
              return event.participants.map(function (participant) {
                return {
                  id: participant.name.toUpperCase(),
                  name: participant.name.toUpperCase()
                };
              });
            });
          })["catch"](function (error) {
            return null;
          }));

        case 4:
          return _context.abrupt("return", _context.sent);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

event.getEventsForBookAndSport = function _callee2(book, sport) {
  var events;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!eventCache.get('EVENTS')) {
            _context2.next = 2;
            break;
          }

          return _context2.abrupt("return", eventCache.get('EVENTS'));

        case 2:
          _context2.next = 4;
          return regeneratorRuntime.awrap(axios.get('https://guest.api.arcadia.pinnacle.com/0.1/sports/' + requests[sport.toUpperCase()] + '/matchups', options).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return null;
          }));

        case 4:
          events = _context2.sent;
          eventCache.set('EVENTS', events);
          return _context2.abrupt("return", events);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};

function transform(events) {
  return events.filter(function (event) {
    return event.participants.length === 2;
  }).map(function (event) {
    return {
      id: event.id,
      startTime: event.startTime,
      sport: event.league.sport.name,
      league: event.league.name,
      participants: event.participants.map(function (participant) {
        return participant.name;
      })
    };
  });
}

module.exports = event;