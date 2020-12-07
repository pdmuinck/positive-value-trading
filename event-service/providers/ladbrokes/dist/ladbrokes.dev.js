"use strict";

var axios = require('axios');

var leagues = require('./resources/leagues.json');

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 1 * 1;
var eventCache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});
var sports = {
  "FOOTBALL": 1
};
var ladbrokes = {};
var headers = {
  headers: {
    'x-eb-accept-language': 'en_BE',
    'x-eb-marketid': 5,
    'x-eb-platformid': 2
  }
};

ladbrokes.getEventsForBookAndSport = function _callee(book, sport) {
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
          requests = leagues.map(function (league) {
            return axios.get('https://www.ladbrokes.be/detail-service/sport-schedule/services/meeting/calcio/' + league.id + '?prematch=1&live=0', headers).then(function (response) {
              return parse(response.data.result.dataGroupList);
            })["catch"](function (error) {
              return console.log(error);
            });
          });
          results = [];
          _context.next = 6;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            results = values.flat();
            eventCache.set('EVENTS', results);
          }));

        case 6:
          return _context.abrupt("return", results);

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};

function parse(dataGroupList) {
  var events = [];
  dataGroupList.forEach(function (dataGroup) {
    dataGroup.itemList.forEach(function (item) {
      events.push({
        id: item.eventInfo.aliasUrl,
        participants: [{
          id: item.eventInfo.teamHome.description,
          name: item.eventInfo.teamHome.description
        }, {
          id: item.eventInfo.teamAway.description,
          name: item.eventInfo.teamAway.description
        }]
      });
    });
  });
  return events;
}

module.exports = ladbrokes;