"use strict";

var axios = require('axios');

var sports = {
  "FOOTBALL": 1
};
var event = {};

event.getParticipants = function _callee(league) {
  var payload;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          payload = {
            "leagueIds": [parseInt(league)],
            "gameTypes": [7],
            "jurisdictionId": 30
          };
          return _context.abrupt("return", axios.post('https://oddsservice.betcenter.be/odds/getGames/8', payload, betcenterHeaders).then(function (response) {
            return parseParticipants(response.data);
          })["catch"](function (error) {
            return null;
          }));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

function parseParticipants(events) {
  return events.games.map(function (event) {
    return event.teams.map(function (team) {
      return {
        id: team.id,
        name: team.name
      };
    });
  });
}

var headers = {
  headers: {
    'Cookie': 'cookieMode=all; _gcl_au=1.1.84849768.1606337643; lastType=1; _fbp=fb.1.1606337643554.1453342623; ust=20201129232952136320a3100ffc241f3c08e46aa5e528269e82271f21b97da0d739a719b613b5; trac=MKTG_GOOGLE_SEARCH_TEXTAD_DESKTOP_SPORT_BRAND_BENL_2020; _gcl_aw=GCL.1606689159.EAIaIQobChMImf_Awueo7QIVULLVCh02IgXREAAYASAAEgJ8OfD_BwE; _gac_UA-30529581-1=1.1606689159.EAIaIQobChMImf_Awueo7QIVULLVCh02IgXREAAYASAAEgJ8OfD_BwE; _gid=GA1.2.237244911.1606689159; _gat=1; _gac_UA-30529581-7=1.1606689159.EAIaIQobChMImf_Awueo7QIVULLVCh02IgXREAAYASAAEgJ8OfD_BwE; _gat_UA-30529581-7=1; CSPSESSIONID-SP-80-UP-=01w003000000DDzZw8ZSUsKgsJVUWQ2HdntAqb2iA1dFyreQj0; _ga_2J0LMSM6JQ=GS1.1.1606689197.3.0.1606689197.60; _ga=GA1.2.1426130866.1606337643; lastBets=; spoMenu=',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
};

event.getEvents = function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(axios.post('https://www.bingoal.be/A/sport', 'func=sport&k=3756&id=35', headers).then(function (response) {
            return response.data;
          })["catch"](function (error) {
            return console.log(error);
          }));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // func=detail&id=35--4016


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
        }],
        betOffers: item.betGroupList.map(function (betGroup) {
          return betGroup.oddGroupList.map(function (oddGroup) {
            return {
              id: oddGroup.oddGroupDescription,
              prices: oddGroup.oddList.map(function (odd) {
                return {
                  betOffer: odd.oddDescription,
                  price: odd.oddValue / 100
                };
              })
            };
          });
        }).flat()
      });
    });
  });
  return events;
}

module.exports = event;