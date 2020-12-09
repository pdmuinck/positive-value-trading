"use strict";

var axios = require('axios');

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 1 * 1;
var eventCache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});

var leagues = require('./resources/leagues.json');

var altenar = {};
var sports = {
  "FOOTBALL": 1
};

altenar.getEventsForBookAndSport = function _callee(book, sport) {
  var events;
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
          _context.next = 4;
          return regeneratorRuntime.awrap(axios.get('https://sb1capi-altenar.biahosted.com/Sportsbook/GetEvents?timezoneOffset=-120&langId=1&skinName=' + book + '&configId=1&culture=en&countryCode=BE&deviceType=Mobile&numformat=en&sportids={sportId}&categoryids=0&group=AllEvents&period=periodall&withLive=true&outrightsDisplay=none&couponType=0&startDate=2020-04-11T08%3A28%3A00.000Z&endDate=2200-04-18T08%3A28%3A00.000Z'.replace('{sportId}', sports[sport.toUpperCase()])).then(function (response) {
            return parse(response.data.Result.Items[0].Events);
          })["catch"](function (error) {
            return null;
          }));

        case 4:
          events = _context.sent;
          eventCache.set('EVENTS', events);
          return _context.abrupt("return", events);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};

altenar.getParticipantsForCompetition = function _callee2(book, competition) {
  var league, url;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          league = leagues.filter(function (league) {
            return league.name === competition.toUpperCase();
          })[0];
          url = 'https://sb1capi-altenar.biahosted.com/Sportsbook/GetEvents?timezoneOffset=-60&langId=1&skinName=goldenpalace&configId=1&culture=en-GB&deviceType=Mobile&numformat=en&sportids=0&categoryids=0&champids=' + league.id + '&group=AllEvents&period=periodall&withLive=false&outrightsDisplay=none&couponType=0&startDate=2020-04-11T08%3A28%3A00.000Z&endDate=2200-04-18T08%3A27%3A00.000Z';
          _context2.next = 4;
          return regeneratorRuntime.awrap(axios.get(url).then(function (response) {
            return parseParticipants(response.data.Result.Items[0].Events);
          })["catch"](function (error) {
            return console.log(error);
          }));

        case 4:
          return _context2.abrupt("return", _context2.sent);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

function parseParticipants(events) {
  return events.map(function (event) {
    return event.Competitors.map(function (competitor) {
      return {
        id: competitor.Name.toUpperCase(),
        name: competitor.Name.toUpperCase()
      };
    });
  });
}

function parse(events) {
  return events.map(function (event) {
    return {
      id: event.Id,
      participants: event.Competitors.map(function (competitor) {
        return {
          id: competitor.Name.toUpperCase(),
          name: competitor.Name.toUpperCase()
        };
      })
    };
  });
}

module.exports = altenar;