"use strict";

var axios = require('axios');

var leagues = require('./leagues');

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 1 * 1;
var eventCache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});
var sports = {
  "FOOTBALL": 1,
  "TENNIS": 2,
  "ICE_HOCKEY": 10,
  "BASKETBALL": 12,
  "VOLLEYBALL": 23,
  "AMERICAN_FOOTBALL": 6,
  "AUSSIE_RULES": 43,
  "BASEBALL": 11,
  "BOXING": 7,
  "CRICKET": 70,
  "DARTS": 32,
  "ESPORTS": 91,
  "MMA": 100,
  "RUGBY": 18,
  "SNOOKER": 36
};
var betcenterHeaders = {
  headers: {
    "x-language": 2,
    "x-brand": 7,
    "x-location": 21,
    "x-client-country": 21,
    "Content-Type": "application/json"
  }
};
var betcenter = {};

betcenter.getParticipantsForCompetition = function _callee(book, competition) {
  var league, payload;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          league = leagues.filter(function (league) {
            return league.name === competition.toUpperCase();
          }).map(function (league) {
            return league.id;
          });
          console.log(league);
          payload = {
            "leagueIds": league,
            "gameTypes": [7],
            "jurisdictionId": 30
          };
          return _context.abrupt("return", axios.post('https://oddsservice.betcenter.be/odds/getGames/8', payload, betcenterHeaders).then(function (response) {
            return parseParticipants(response.data);
          })["catch"](function (error) {
            return null;
          }));

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

function parseParticipants(events) {
  return events.games.map(function (event) {
    return event.teams.map(function (team) {
      return {
        id: team.id,
        name: team.name
      };
    });
  });
}

betcenter.getEventsForBookAndSport = function _callee2(book, sport) {
  var requests, events;
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
          requests = leagues.map(function (league) {
            var betcenterPayload = {
              "leagueIds": [league.id],
              "sportId": sports[sport.toUpperCase()],
              "gameTypes": [1, 4],
              "limit": 20000,
              "jurisdictionId": 30
            };
            return axios.post('https://oddsservice.betcenter.be/odds/getGames/8', betcenterPayload, betcenterHeaders).then(function (response) {
              return transform(response.data.games);
            })["catch"](function (error) {
              return null;
            });
          });
          events = [];
          _context2.next = 6;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            events = values.flat();
            eventCache.set('EVENTS', events);
          }));

        case 6:
          return _context2.abrupt("return", events);

        case 7:
        case "end":
          return _context2.stop();
      }
    }
  });
};

function transform(games) {
  return games.map(function (game) {
    return {
      id: game.id,
      participants: game.teams.map(function (team) {
        return {
          id: team.id,
          name: team.name
        };
      })
    };
  });
}

module.exports = betcenter;