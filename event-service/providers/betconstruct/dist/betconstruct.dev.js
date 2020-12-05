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
websocket = new WebSocket(bookmakers['CIRCUS']);
websocket.on('open', function open() {
  websocket.send(JSON.stringify({
    "Id": "a79a29cf-9b4d-5d29-65e8-dd113c1b0253",
    "TTL": 10,
    "MessageType": 1,
    "Message": "{\"NodeType\":1,\"Identity\":\"502a445b-f50b-4edc-97c9-77d3f49d3592\",\"EncryptionKey\":\"\",\"ClientInformations\":{\"AppName\":\"Front;Registration-Origin: default\",\"ClientType\":\"Responsive\",\"Version\":\"1.0.0\",\"UserAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36\",\"LanguageCode\":\"nl\",\"RoomDomainName\":\"CIRCUS\"}}"
  })); // send football request

  console.log('betconstruct is open');
  websocket.send(JSON.stringify(websocket.send(JSON.stringify({
    "Id": "f523d44b-d825-f9ff-ff02-aa3ae9f0f24b",
    "TTL": 10,
    "MessageType": 1000,
    "Message": "{\"Direction\":1,\"Id\":\"960eed4c-b820-64bb-8592-1114ee3f3d19\",\"Requests\":[{\"Id\":\"53c1e25b-2397-5a49-cbfb-570e9f748f22\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"OnlyShowcaseMarket\\\":true,\\\"IncludeSportList\\\":true,\\\"EventSkip\\\":0,\\\"EventTake\\\":1000,\\\"EventType\\\":0,\\\"PlayerFavoritesLeagueIds\\\":[],\\\"SportId\\\":844,\\\"PeriodicFilter\\\":-1}}\"}],\"Groups\":[]}"
  }))));
});
websocket.on('message', function incoming(data) {
  var bla = JSON.parse(data); // if statement because we receive more messages than data packets

  if (JSON.parse(bla.Message)["$type"] === 'APR.Packets.DataPacket, APR.Packets') {
    var response = JSON.parse(JSON.parse(bla.Message).Requests["$values"][0].Content);
    var events = response.LeagueDataSource.LeagueItems.map(function (league) {
      return league.EventItems;
    }).flat().map(function (event) {
      return {
        id: event.EventId,
        participants: [{
          id: event.Team1Name,
          name: event.Team1Name
        }, {
          id: event.Team2Name,
          name: event.Team2Name
        }]
      };
    });
    cache.set('FOOTBALL', events);
  }
});
var betconstruct = {};

betconstruct.openWebSocket = function () {
  console.log('About to open websocket for betconstruct');
};

betconstruct.getEventsForBookAndSport = function _callee(book, sport) {
  var result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          result = cache.get(sport.toUpperCase());

          if (!result) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", result);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

setInterval(function () {
  websocket.send(JSON.stringify({
    "Id": "f523d44b-d825-f9ff-ff02-aa3ae9f0f24b",
    "TTL": 10,
    "MessageType": 1000,
    "Message": "{\"Direction\":1,\"Id\":\"960eed4c-b820-64bb-8592-1114ee3f3d19\",\"Requests\":[{\"Id\":\"53c1e25b-2397-5a49-cbfb-570e9f748f22\",\"Type\":201,\"Identifier\":\"GetLeaguesDataSourceFromCache\",\"AuthRequired\":false,\"Content\":\"{\\\"Entity\\\":{\\\"Language\\\":\\\"en\\\",\\\"BettingActivity\\\":0,\\\"PageNumber\\\":0,\\\"OnlyShowcaseMarket\\\":true,\\\"IncludeSportList\\\":true,\\\"EventSkip\\\":0,\\\"EventTake\\\":1000,\\\"EventType\\\":0,\\\"PlayerFavoritesLeagueIds\\\":[],\\\"SportId\\\":844,\\\"PeriodicFilter\\\":-1}}\"}],\"Groups\":[]}"
  }));
}, 10000);
module.exports = betconstruct;