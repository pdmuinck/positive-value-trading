"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var axios = require('axios');

var parser = require('node-html-parser');

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 1 * 1;
var eventCache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});
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
          requests = [//spain
          axios.post('https://bet90.be/Sports/SportLeagueGames', {
            leagueId: 117,
            categoryId: 32,
            sportId: sports[sport.toUpperCase()]
          }, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }), axios.post('https://bet90.be/Sports/SportLeagueGames', {
            leagueId: 276,
            categoryId: 32,
            sportId: sports[sport.toUpperCase()]
          }, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }), // germany
          axios.post('https://bet90.be/Sports/SportLeagueGames', {
            leagueId: 30,
            categoryId: 19,
            sportId: sports[sport.toUpperCase()]
          }, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }), axios.post('https://bet90.be/Sports/SportLeagueGames', {
            leagueId: 75,
            categoryId: 19,
            sportId: sports[sport.toUpperCase()]
          }, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }), // england
          axios.post('https://bet90.be/Sports/SportLeagueGames', {
            leagueId: 56,
            categoryId: 34,
            sportId: sports[sport.toUpperCase()]
          }, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }), axios.post('https://bet90.be/Sports/SportLeagueGames', {
            leagueId: 173,
            categoryId: 34,
            sportId: sports[sport.toUpperCase()]
          }, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }), axios.post('https://bet90.be/Sports/SportLeagueGames', {
            leagueId: 321,
            categoryId: 34,
            sportId: sports[sport.toUpperCase()]
          }, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }), axios.post('https://bet90.be/Sports/SportLeagueGames', {
            leagueId: 338,
            categoryId: 34,
            sportId: sports[sport.toUpperCase()]
          }, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }), //serie a
          axios.post('https://bet90.be/Sports/SportLeagueGames', {
            leagueId: 401,
            categoryId: 4,
            sportId: sports[sport.toUpperCase()]
          }, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }), // france
          axios.post('https://bet90.be/Sports/SportLeagueGames', {
            leagueId: 119,
            categoryId: 62,
            sportId: sports[sport.toUpperCase()]
          }, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }), // netherlands
          axios.post('https://bet90.be/Sports/SportLeagueGames', {
            leagueId: 307,
            categoryId: 79,
            sportId: sports[sport.toUpperCase()]
          }, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }), // belgium
          axios.post('https://bet90.be/Sports/SportLeagueGames', {
            leagueId: 457,
            categoryId: 20,
            sportId: sports[sport.toUpperCase()]
          }, headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          })];
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
    })[0];
    var stat = stats.filter(function (stat) {
      return stat.id === team.id;
    })[0];
    parsedEvents.push({
      id: team.id,
      participants: [{
        id: stat.participantIds.split('team1id="')[1].split('\"\r\n')[0],
        name: team.team1
      }, {
        id: stat.participantIds.split('team2id="')[1].split('\"')[0],
        name: secondTeam.team1
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