"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var axios = require('axios');

var parser = require('node-html-parser');

var leagues = require('./resources/leagues.ts');

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 60 * 1;
var eventCache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});
var eventDetailCache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});

JSON.safeStringify = function (obj) {
  var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var cache = [];
  var retVal = JSON.stringify(obj, function (key, value) {
    return _typeof(value) === "object" && value !== null ? cache.includes(value) ? undefined // Duplicate reference found, discard key
    : cache.push(value) && value // Store value in our collection
    : value;
  }, indent);
  cache = null;
  return retVal;
};

var zetbet = {};

zetbet.getEventsForBookAndSport = function _callee(book, sport) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!eventDetailCache.keys()) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", Object.values(eventDetailCache.mget(eventDetailCache.keys())));

        case 4:
          return _context.abrupt("return", []);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

function parse(data) {
  var root = parser.parse(data);
  return root.querySelectorAll('a').map(function (htmlElement) {
    return htmlElement.rawAttrs;
  }).filter(function (url) {
    return url.includes('event');
  }).map(function (link) {
    return link.split('\n')[0].split('href=')[1].replace(/"/g, '');
  });
}

function getEventDetails(eventIds) {
  var requests, results;
  return regeneratorRuntime.async(function getEventDetails$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          requests = eventIds.map(function (id) {
            if (!eventDetailCache.get(id)) {
              return axios.get('https://www.zebet.be' + id).then(function (response) {
                return parseEvents(id, response.data);
              })["catch"](function (error) {
                return console.log(error);
              });
            }
          });
          console.log('About to get events: ' + requests.length);
          _context2.next = 4;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            results = values.flat();
            console.log('found zetbet events');
          }));

        case 4:
          return _context2.abrupt("return", results);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function getEventIds() {
  var leagueRequests, eventIds;
  return regeneratorRuntime.async(function getEventIds$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          leagueRequests = leagues.map(function (league) {
            return axios.get('https://www.zebet.be/en/competition/' + league.id).then(function (response) {
              return parse(response.data);
            });
          });
          _context3.next = 3;
          return regeneratorRuntime.awrap(Promise.all(leagueRequests).then(function (values) {
            eventIds = values.flat();
            eventCache.set('EVENTS', eventIds);
          }));

        case 3:
          return _context3.abrupt("return", eventIds);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}

module.exports = zetbet;

function parseEvents(id, data) {
  var root = parser.parse(data);
  var event = {
    id: id,
    participants: JSON.parse(JSON.safeStringify(root.querySelector('title'))).childNodes[0].rawText.split(' - ')[0].split(' / ')
  };
  eventDetailCache.set(id, event);
  return event;
}

function parseBets(data) {
  return JSON.parse(JSON.safeStringify(root.querySelectorAll('.pmq-cote'))); //return JSON.parse(JSON.safeStringify(root.querySelectorAll('a').filter(htmlElement => htmlElement.rawAttrs.includes('betting'))))
}

zetbet.getByIdEuroTierce = function _callee2(id) {
  return regeneratorRuntime.async(function _callee2$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", axios.get('https://sports.eurotierce.be/nl/event/3326165-milan-ac-celtic-glasgow').then(function (response) {
            return parseEvent(response.data);
          }));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};

zetbet.open = function _callee3() {
  var eventIds;
  return regeneratorRuntime.async(function _callee3$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log('Wait for zetbet');
          _context5.next = 3;
          return regeneratorRuntime.awrap(getEventIds());

        case 3:
          eventIds = _context5.sent;
          console.log('zetbet event ids found: ' + eventIds.length);
          _context5.next = 7;
          return regeneratorRuntime.awrap(getEventDetails(eventIds));

        case 7:
          console.log('zetbet events found');

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
};

function parseEvent(data) {
  var root = parser.parse(data);
  return JSON.parse(JSON.safeStringify(root.querySelectorAll('.odds-question'))); // bettype: snc-odds-actor
  // bet product: odds-question-label
  // odds-question
  // price: snc-odds-odd nb-load

  return root.querySelectorAll('.snc-odds-odd');
}