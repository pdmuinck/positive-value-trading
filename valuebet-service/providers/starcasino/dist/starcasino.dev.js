"use strict";

var WebSocket = require("ws");

var NodeCache = require('node-cache');

var leagues = require('./resources/leagues.ts');

var ttlSeconds = 60 * 1 * 1;
var cache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});
var starWS = new WebSocket("wss://eu-swarm-ws-re.bcapps.net/");
starWS.on('open', function open() {
  console.log('open');
  starWS.send(JSON.stringify({
    "command": "request_session",
    "params": {
      "language": "eng",
      "site_id": "385",
      "release_date": "15/09/2020-16:48"
    },
    "rid": "16062033821871"
  }));
});
starWS.on('message', function incoming(data) {
  var bla = JSON.parse(data);
  var leagueId = bla.rid;
  var league = leagues.filter(function (league) {
    return league.id === leagueId;
  }).map(function (league) {
    return league.name;
  })[0];
  var leagueEvents = cache.get(leagueId);

  if (bla.data.data) {
    var events = bla.data.data.game;
    Object.entries(events).forEach(function (entry) {
      var rawEvent = entry[1];
      var event = {
        id: rawEvent.id,
        league: league,
        participants: [{
          id: rawEvent.team1_id,
          name: rawEvent.team1_name
        }, {
          id: rawEvent.team2_id,
          name: rawEvent.team2_name
        }]
      };
      cache.set(entry[0], event);

      if (leagueEvents) {
        leagueEvents.push(event);
        cache.set(leagueId, leagueEvents);
      } else {
        cache.set(leagueId, [event]);
      }
    });
  }
});
setInterval(function () {
  leagues.forEach(function (league) {
    starWS.send(JSON.stringify({
      "command": "get",
      "params": {
        "source": "betting",
        "what": {
          "game": ["id", "team1_id", "team2_id", "team1_name", "team2_name"]
        },
        "where": {
          "game": {},
          "sport": {
            "id": 1
          },
          "region": {},
          "competition": {
            "id": league.id
          }
        },
        "subscribe": false
      },
      "rid": league.id
    }));
  }); //starWS.send(JSON.stringify({"command":"get","params":{"source":"betting","what":{"game":["id","show_type","markets_count","start_ts","is_live","is_blocked","is_neutral_venue","team1_id","team2_id","game_number","text_info","is_stat_available","type","info","team1_name","team2_name","tv_info","stats","add_info_name"],"market":["id","col_count","type","name_template","sequence","point_sequence","express_id","cashout","display_key","display_sub_key","group_id","name","group_name","order","extra_info","group_order"],"event":["order","id","type_1","type","type_id","original_order","name","price","nonrunner","ew_allowed","sp_enabled","extra_info","base","home_value","away_value","display_column"]},"where":{"game":{},"sport":{"id":1},"region":{},"competition":{"id":566}},"subscribe":false},"rid":"160621315266616"}))
}, 10000);
var starcasino = {};

starcasino.openWebSocket = function () {
  console.log('About to open websocket for starcasino');
};

starcasino.getEventsForBookAndSport = function _callee(sport) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", Object.values(cache.mget(cache.keys())));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

starcasino.getParticipantsForCompetition = function _callee2(book, competition) {
  var league, cacheResult;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          league = leagues.filter(function (league) {
            return league.name === competition.toUpperCase();
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

module.exports = starcasino;