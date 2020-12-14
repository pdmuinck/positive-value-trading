"use strict";

var axios = require("axios");

var leagues = require('./resources/leagues.json');

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 1 * 1;
var eventCache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});
var bla = new Date();
var dd = String(bla.getDate()).padStart(2, "0");
var mm = String(bla.getMonth() + 1).padStart(2, "0"); //January is 0!

var yyyy = bla.getFullYear();
var today = [yyyy, mm, dd].join("-");
var requests = {
  "FOOTBALL": "https://meridianbet.be/sails/sport/58",
  "BASKETBALL": "https://meridianbet.be/sails/sport/55",
  "TABLE_TENNIS": "https://meridianbet.be/sails/sport/89",
  "CS": "https://meridianbet.be/sails/sport/130",
  "DOTA": "https://meridianbet.be/sails/sport/132",
  "LOL": "https://meridianbet.be/sails/sport/134",
  "STARTCRAFT": "https://meridianbet.be/sails/sport/137",
  "RAINBOW_SIX": "https://meridianbet.be/sails/sport/138",
  "TENNIS": "https://meridianbet.be/sails/sport/56",
  "VOLLEYBALL": "https://meridianbet.be/sails/sport/54",
  "HOCKEY": "https://meridianbet.be/sails/sport/59",
  "AMERICAN_FOOTBALL": "https://meridianbet.be/sails/sport/80",
  "AUSSIE_RULES": "https://meridianbet.be/sails/sport/120",
  "BASEBALL": "https://meridianbet.be/sails/sport/63",
  "BOXING": "https://meridianbet.be/sails/sport/76",
  "CRICKET": "https://meridianbet.be/sails/sport/66",
  "GOLF": "https://meridianbet.be/sails/sport/85",
  "MMA": "https://meridianbet.be/sails/sport/87",
  "RUGBY_LEAGUE": "https://meridianbet.be/sails/sport/94",
  "RUGBY_UNION": "https://meridianbet.be/sails/sport/65",
  "SNOOKER": "https://meridianbet.be/sails/sport/69"
};
var event = {};

event.getParticipantsForCompetition = function _callee(book, competition) {
  var url;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          url = leagues.filter(function (league) {
            return league.name === competition.toUpperCase();
          })[0].url;
          _context.next = 3;
          return regeneratorRuntime.awrap(axios.get(url).then(function (response) {
            return response.data[0].events.map(function (event) {
              return event.team;
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
          return regeneratorRuntime.awrap(resolve(Object.entries(requests).filter(function (pair) {
            return sport.toUpperCase() === pair[0];
          }).map(function (pair) {
            return createRequest(pair[1]);
          })));

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

function createRequest(url) {
  return axios.get(url).then(function (response) {
    return transform(response.data.events.map(function (events) {
      return events.events;
    }).flat());
  })["catch"](function (error) {
    return null;
  });
}

function transform(events) {
  return events.map(function (event) {
    return {
      id: event.id,
      league: leagues.filter(function (league) {
        return league.id === event.leagueId;
      }).map(function (league) {
        return league.name;
      })[0],
      participants: event.team
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