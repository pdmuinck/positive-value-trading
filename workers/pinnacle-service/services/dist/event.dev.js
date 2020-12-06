"use strict";

var axios = require('axios');

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

event.getEvents = function _callee2(book, sports) {
  var sportsUpperCase;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!(sports && Array.isArray(sports))) {
            _context2.next = 5;
            break;
          }

          sportsUpperCase = sports.map(function (sport) {
            return sport.toUpperCase();
          });
          return _context2.abrupt("return", resolve(Object.entries(requests).filter(function (pair) {
            return sportsUpperCase.includes(pair[0]);
          }).map(function (pair) {
            return createRequest(pair[1].id);
          })));

        case 5:
          if (!sports) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", resolve(Object.entries(requests).filter(function (pair) {
            return sports.toUpperCase() === pair[0];
          }).map(function (pair) {
            return createRequest(pair[1].id);
          })));

        case 9:
          return _context2.abrupt("return", resolve(Object.values(requests).map(function (id) {
            return createRequest(id.id);
          })));

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
};

function createRequest(id) {
  return axios.get('https://guest.api.arcadia.pinnacle.com/0.1/sports/' + id + '/matchups', options).then(function (response) {
    return transform(response.data);
  })["catch"](function (error) {
    return null;
  });
}

function transform(events) {
  return events.map(function (event) {
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

function resolve(requests) {
  var events;
  return regeneratorRuntime.async(function resolve$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            events = values;
          }));

        case 2:
          return _context3.abrupt("return", events);

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
}

module.exports = event;