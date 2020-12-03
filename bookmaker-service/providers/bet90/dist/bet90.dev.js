"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var axios = require('axios');

var parser = require('node-html-parser');

var headers = {
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8'
  }
};
var sports = {
  "FOOTBALL": 1
};
bet90 = {};

bet90.getEventsForBookAndSport = function _callee(book, sport) {
  var payload;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          payload = {
            leagueId: 117,
            categoryId: 32,
            sportId: sports[sport.toUpperCase()]
          };
          return _context.abrupt("return", axios.post('https://bet90.be/Sports/SportLeagueGames', payload, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

function transform(events) {
  var parsedEvents = [];
  var firstTeams = parser.parse(events).querySelectorAll('.first-team').map(function (team) {
    return {
      id: team.parentNode.id,
      team1: team.childNodes[1].childNodes[0].rawText
    };
  });
  var secondTeams = parser.parse(events).querySelectorAll('.second-team').map(function (team) {
    return {
      id: team.parentNode.id,
      team1: team.childNodes[1].childNodes[0].rawText
    };
  });
  var stats = parser.parse(events).querySelectorAll('.hg_nx_btn_stats').map(function (stat) {
    return {
      id: stat.parentNode.parentNode.parentNode.id,
      participantIds: stat.rawAttrs
    };
  });
  firstTeams.forEach(function (team) {
    var secondTeam = secondTeams.filter(function (secondTeam) {
      return secondTeam.id === team.id;
    });
    var stat = stats.filter(function (stat) {
      return stat.id === team.id;
    });
    parsedEvents.push({
      id: team.id,
      participants: [{
        name: team.team1
      }, {
        name: secondTeam
      }]
    });
  });
  return parsedEvents;
}

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

module.exports = bet90;