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

var leagues = require('./resources/leagues.json');

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

bet90.getParticipantsForCompetition = function _callee(book, competition) {
  var league, body;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          league = leagues.filter(function (league) {
            return league.name === competition.toUpperCase();
          })[0];
          body = {
            leagueId: league.id,
            categoryId: league.categoryId,
            sportId: sports[league.sport]
          };
          _context.next = 4;
          return regeneratorRuntime.awrap(axios.post('https://bet90.be/Sports/SportLeagueGames', body, headers).then(function (response) {
            return parseParticipants(response.data);
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

function parseParticipants(events) {
  var participants = [];
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
    participants.push([{
      id: stat.participantIds.split('team1id="')[1].split('\"\r\n')[0],
      name: team.team1
    }, {
      id: stat.participantIds.split('team2id="')[1].split('\"')[0],
      name: secondTeam.team1
    }]);
  });
  return participants.flat();
}

bet90.getEventsForBookAndSport = function _callee2(book, sport) {
  var requests, results;
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
            return axios.post('https://bet90.be/Sports/SportLeagueGames', {
              leagueId: league.id,
              categoryId: league.categoryId,
              sportId: sports[sport.toUpperCase()]
            }, headers).then(function (response) {
              return transform(response.data, league.name);
            })["catch"](function (error) {
              return console.log(error);
            });
          }).flat();
          _context2.next = 5;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            results = values.flat();
            eventCache.set('EVENTS', results);
          }));

        case 5:
          return _context2.abrupt("return", results);

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
};

function transform(events, league) {
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
      league: league,
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