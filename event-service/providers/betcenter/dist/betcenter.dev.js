"use strict";

var axios = require('axios');

var leagues = require('./leagues');

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

betcenter.getEventsForBookAndSport = function _callee(book, sport) {
  var requests, events;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
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
          _context.next = 4;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            events = values.flat();
          }));

        case 4:
          return _context.abrupt("return", events);

        case 5:
        case "end":
          return _context.stop();
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