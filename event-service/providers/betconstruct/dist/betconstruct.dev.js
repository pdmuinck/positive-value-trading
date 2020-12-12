"use strict";

var bookmakers = require('./bookmakers');

var WebSocket = require("ws");

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 1 * 1;
var cache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});

var leagues = require('./resources/leagues.json');

var sports = require('./resources/sports');

websocket = new WebSocket(bookmakers['CIRCUS']);
websocket.on('open', function open() {
  websocket.send(JSON.stringify({
    "Id": "a79a29cf-9b4d-5d29-65e8-dd113c1b0253",
    "TTL": 10,
    "MessageType": 1,
    "Message": "{\"NodeType\":1,\"Identity\":\"502a445b-f50b-4edc-97c9-77d3f49d3592\",\"EncryptionKey\":\"\",\"ClientInformations\":{\"AppName\":\"Front;Registration-Origin: default\",\"ClientType\":\"Responsive\",\"Version\":\"1.0.0\",\"UserAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36\",\"LanguageCode\":\"nl\",\"RoomDomainName\":\"CIRCUS\"}}"
  })); // send football request

  console.log('betconstruct is open');
  var leagueIds = leagues.map(function (league) {
    return league.id;
  }).flat().join(',');
  websocket.send(JSON.stringify({
    "Id": "36701684-e389-bdbc-ea1d-804acb40e169",
    "TTL": 10,
    "MessageType": 1000,
    "Message": "{\"Direction\":1,\"Id\":\"ef6b43a6-3f69-da7f-b962-644100e612ed\",\"Requests\":[{\"Id\":\"ba7ecb09-731f-87eb-0f46-a38a8d8efc3e\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"OnlyShowcaseMarket\\\":true,\\\"IncludeSportList\\\":true,\\\"EventSkip\\\":0,\\\"EventTake\\\":1000,\\\"EventType\\\":0,\\\"RequestString\\\":\\\"LeagueIds=" + leagueIds + "&OnlyMarketGroup=Main\\\"}}\"}],\"Groups\":[]}"
  }));
});
websocket.on('message', function incoming(data) {
  var bla = JSON.parse(data); // if statement because we receive more messages than data packets

  if (JSON.parse(bla.Message)["$type"] === 'APR.Packets.DataPacket, APR.Packets') {
    var response = JSON.parse(JSON.parse(bla.Message).Requests["$values"][0].Content);

    var _leagues = response.LeagueDataSource.LeagueItems.map(function (league) {
      return {
        sportId: league.SportId,
        events: league.EventItems.map(function (event) {
          return {
            id: event.EventId,
            leagueId: event.LeagueId,
            league: _leagues.filter(function (league) {
              return league.id === event.leagueId;
            }).map(function (league) {
              return league.name;
            })[0],
            participants: [{
              id: event.Team1Name,
              name: event.Team1Name
            }, {
              id: event.Team2Name,
              name: event.Team2Name
            }]
          };
        })
      };
    }).flat();

    _leagues.forEach(function (league) {
      return league.events.forEach(function (event) {
        return event["sportId"] = league.sportId;
      });
    });

    var events = _leagues.map(function (league) {
      return league.events;
    }).flat();

    events.forEach(function (event) {
      var sportEvents = cache.get(event.sportId);
      var leagueEvents = cache.get(event.leagueId);

      if (leagueEvents) {
        leagueEvents.push(event);
        cache.set(event.leagueId, leagueEvents);
      } else {
        cache.set(event.leagueId, [event]);
      }

      if (sportEvents) {
        sportEvents.push(event);
        cache.set(event.sportId, sportEvents);
      } else {
        if (!event.sportId) console.log(event);
        cache.set(event.sportId, [event]);
      }
    });
  }
});
var betconstruct = {};

betconstruct.openWebSocket = function () {
  console.log('About to open websocket for betconstruct');
};

betconstruct.getEventsForBookAndSport = function _callee(book, sport) {
  var id, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = sports[sport.toUpperCase()];
          result = cache.get(id);

          if (!result) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", result);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

betconstruct.getParticipantsForCompetition = function _callee2(book, competition) {
  var league, cacheResult;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          league = leagues.filter(function (league) {
            return league.name === competition;
          })[0];
          cacheResult = cache.get(league.id);
          return _context2.abrupt("return", cacheResult ? cacheResult.map(function (event) {
            return event.participants;
          }).flat() : []);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

setInterval(function () {
  var leagueIds = leagues.map(function (league) {
    return league.id;
  }).flat().join(',');
  websocket.send(JSON.stringify({
    "Id": "36701684-e389-bdbc-ea1d-804acb40e169",
    "TTL": 10,
    "MessageType": 1000,
    "Message": "{\"Direction\":1,\"Id\":\"ef6b43a6-3f69-da7f-b962-644100e612ed\",\"Requests\":[{\"Id\":\"ba7ecb09-731f-87eb-0f46-a38a8d8efc3e\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"OnlyShowcaseMarket\\\":true,\\\"IncludeSportList\\\":true,\\\"EventSkip\\\":0,\\\"EventTake\\\":1000,\\\"EventType\\\":0,\\\"RequestString\\\":\\\"LeagueIds=" + leagueIds + "&OnlyMarketGroup=Main\\\"}}\"}],\"Groups\":[]}"
  }));
}, 60000);
module.exports = betconstruct;