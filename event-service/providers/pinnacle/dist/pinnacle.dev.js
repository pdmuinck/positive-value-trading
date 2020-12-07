"use strict";

var axios = require('axios');

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
  'FOOTBALL': {
    id: 29
  },
  'BASKETBALL': {
    id: 4
  },
  'AMERICAN_FOOTBALL': {
    id: 15
  },
  'TENNIS': {
    id: 33
  },
  'ESPORTS': {
    id: 12
  },
  'MMA': {
    id: 22
  },
  'BASEBALL': {
    id: 3
  },
  'AUSSIE_RULES': {
    id: 39
  },
  'BOXING': {
    id: 6
  },
  'CRICKET': {
    id: 8
  },
  'GOLF': {
    id: 17
  },
  'ICE_HOCKEY': {
    id: 19
  },
  'RUGBY_LEAGUE': {
    id: 26
  },
  'RUGBY_UNION': {
    id: 27
  },
  'SNOOKER': {
    id: 28
  },
  'DARTS': {
    id: 10
  }
};
var event = {};

event.getParticipants = function _callee(league) {
  var url;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          url = 'https://guest.api.arcadia.pinnacle.com/0.1/leagues/' + league + '/matchups';
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.get(url, options).then(function (response) {
            return response.data.map(function (event) {
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

        case 3:
          return _context.abrupt("return", _context.sent);

        case 4:
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
          return regeneratorRuntime.awrap(axios.get('https://guest.api.arcadia.pinnacle.com/0.1/sports/' + requests[sport.toUpperCase()].id + '/matchups', options).then(function (response) {
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