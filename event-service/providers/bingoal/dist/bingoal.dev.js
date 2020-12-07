"use strict";

var axios = require('axios');

var bingoal = {};
var headers = {
  headers: {
    'Cookie': 'cookieMode=all; _gcl_au=1.1.84849768.1606337643; lastType=1; _fbp=fb.1.1606337643554.1453342623; trac=MKTG_GOOGLE_SEARCH_TEXTAD_DESKTOP_SPORT_BRAND_BENL_2020; _gac_UA-30529581-1=1.1607117374.EAIaIQobChMItI2j36K17QIVFed3Ch2YLA6nEAAYAyAAEgJhHPD_BwE; _gcl_aw=GCL.1607117374.EAIaIQobChMItI2j36K17QIVFed3Ch2YLA6nEAAYAyAAEgJhHPD_BwE; _gac_UA-30529581-7=1.1607117374.EAIaIQobChMItI2j36K17QIVFed3Ch2YLA6nEAAYAyAAEgJhHPD_BwE; _gid=GA1.2.964591256.1607378856; menuArr=m_sc22194%7Cm_SOCCER_BE%7Cm_SOCCER_GB%7Cm_TENNIS%7Cm_CYCLING; _ga_2J0LMSM6JQ=GS1.1.1607383339.7.0.1607383339.60; ust=202012080030598caee2095f6a2d5a2c94e9974910db0f1a612f199d55351a8ff9c83559578906; _ga=GA1.2.1426130866.1606337643; _gat=1; _gat_UA-30529581-7=1; CSPSESSIONID-SP-80-UP-=03t004000000eT8IRtoSMr8C6Z$Lcwr$7vDc2n_EOxGNdmTG30; lastBets=',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
};

bingoal.getEventsForBookAndSport = function _callee(book, sport) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", axios.post('https://www.bingoal.be/A/sport', 'func=sport&k=7596&id=25', headers).then(function (response) {
            return transform(response.data);
          })["catch"](function (error) {
            return console.log(error);
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
};

function transform(events) {
  return events.box[0].cat[0].matches.map(function (event) {
    return {
      id: event.id,
      participants: [{
        id: event.team1,
        name: event.team1
      }, {
        id: event.team2,
        name: event.team2
      }]
    };
  });
}

module.exports = bingoal;