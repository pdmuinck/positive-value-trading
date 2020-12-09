"use strict";

var axios = require('axios');

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 1 * 1;
var eventCache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});

var leagues = require('./resources/leagues');

var betway = {};

betway.getEventsForBookAndSport = function _callee(book, sport) {
  var cacheResult, eventIds;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          cacheResult = eventCache.get(sport.toUpperCase());

          if (!cacheResult) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", cacheResult);

        case 3:
          _context.next = 5;
          return regeneratorRuntime.awrap(getEventIds(sport));

        case 5:
          eventIds = _context.sent;
          return _context.abrupt("return", axios.post('https://sports.betway.be/api/Events/V2/GetEvents', {
            "LanguageId": 1,
            "ClientTypeId": 2,
            "BrandId": 3,
            "JurisdictionId": 3,
            "ClientIntegratorId": 1,
            "ExternalIds": eventIds,
            "MarketCName": "win-draw-win",
            "ScoreboardRequest": {
              "ScoreboardType": 3,
              "IncidentRequest": {}
            }
          }).then(function (response) {
            return parseEvents(response.data.Events);
          })["catch"](function (error) {
            return null;
          }));

        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
};

betway.getParticipantsForCompetition = function _callee2(book, competition) {
  var league;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          league = leagues.filter(function (league) {
            return league.name === competition.toUpperCase();
          })[0];
          return _context2.abrupt("return", eventCache.get(league.id).map(function (event) {
            return event.participants;
          }));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};

function parseEvents(events) {
  console.log('parse events');
  var parsedEvents = events.map(function (event) {
    return {
      id: event.Id,
      leagueId: event.GroupCName,
      participants: [{
        id: event.HomeTeamName,
        name: event.HomeTeamName
      }, {
        id: event.AwayTeamName,
        name: event.AwayTeamName
      }]
    };
  });
  eventCache.set('FOOTBALL', parsedEvents);
  parsedEvents.forEach(function (event) {
    var leagueEvents = eventCache.get(event.leagueId);

    if (leagueEvents) {
      leagueEvents.push(event);
      eventCache.set(event.leagueId, leagueEvents);
    } else {
      eventCache.set(event.leagueId, [event]);
    }
  });
  return parsedEvents;
}

function createRequests(sport) {
  var sports, sportId;
  return regeneratorRuntime.async(function createRequests$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          sports = {
            'FOOTBALL': 'soccer'
          };
          sportId = sports[sport.toUpperCase()];
          return _context3.abrupt("return", axios.post('https://sports.betway.be/api/Events/V2/GetCategoryDetails', {
            "LanguageId": 1,
            "ClientTypeId": 2,
            "BrandId": 3,
            "JurisdictionId": 3,
            "ClientIntegratorId": 1,
            "CategoryCName": sportId
          }).then(function (response) {
            return parseGroups(response.data);
          })["catch"](function (error) {
            return null;
          }));

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function parseGroups(groups) {
  var betwayGroupsUrl = 'https://sports.betway.be/api/Events/V2/GetGroup';
  var eventRequests = [];
  var sport = groups.CategoryCName;
  var subCategories = groups.SubCategories;
  subCategories.forEach(function (subCategory) {
    subCategory.Groups.forEach(function (group) {
      eventRequests.push(axios.post(betwayGroupsUrl, {
        "LanguageId": 1,
        "ClientTypeId": 2,
        "BrandId": 3,
        "JurisdictionId": 3,
        "ClientIntegratorId": 1,
        "CategoryCName": sport,
        "SubCategoryCName": subCategory.SubCategoryCName,
        "GroupCName": group.GroupCName
      }).then(function (response) {
        return response.data;
      })["catch"](function (error) {
        return null;
      }));
    });
  });
  return eventRequests;
}

function getEventIds(sport) {
  var requests, betwayEventIds;
  return regeneratorRuntime.async(function getEventIds$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(createRequests(sport));

        case 2:
          requests = _context4.sent;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            betwayEventIds = values.filter(function (x) {
              return x;
            }).filter(function (value) {
              return value.Categories[0];
            }).map(function (value) {
              return value.Categories[0].Events;
            }).flat();
          }));

        case 5:
          return _context4.abrupt("return", betwayEventIds);

        case 6:
        case "end":
          return _context4.stop();
      }
    }
  });
}

module.exports = betway;