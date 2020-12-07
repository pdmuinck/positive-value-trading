"use strict";

var axios = require('axios');

var bookmakers = require('./bookmakers');

var Token = require('./token');

var leagues = require('./leagues.json');

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 1 * 1;
var eventCache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});
var sportMap = {
  "FOOTBALL": "1",
  // soccer
  "BASKETBALL": "2",
  // basketball
  "AMERICAN_FOOTBALL": "3",
  // american football
  "TENNIS": "6",
  // tennis
  "BASEBALL": "7",
  // baseball
  "ICE_HOCKEY": "8",
  // ice-hockey
  "VOLLEYBALL": "19",
  // volleyball
  "BOXING": "20",
  // boxing
  "TABLE_TENNIS": "26",
  // table-tennis
  "MMA": "43",
  // MMA UFC
  "ESPORTS": "64",
  // esports
  "GOLF": "12",
  // golf
  "SNOOKER": "13",
  // snooker
  "CRICKET": "59",
  // cricket
  "RUGBY_LEAGUE": "11",
  // rugby league
  "RUGBY_UNION": "35",
  // rugby union
  "AUSTRALIAN_RULES": "41" // aussie rules

};
var sbtech = {};

sbtech.getBetOffersForBookAndEventId = function _callee(book, eventId) {
  var token, sbtechPayload, headers, result;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(Token.getToken(book.toUpperCase(), bookmakers));

        case 2:
          token = _context.sent;
          sbtechPayload = {
            "eventState": "Mixed",
            "eventTypes": ["Fixture"],
            "ids": [eventId],
            "marketTypeRequests": [{
              "marketTypeIds": ["1_0", "1_39", "2_0", "2_39", "3_0", "3_39"]
            }],
            "pagination": {
              "top": 300,
              "skip": 0
            }
          };
          headers = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'locale': 'en'
            }
          };
          _context.next = 7;
          return regeneratorRuntime.awrap(axios.post(bookmakers[book.toUpperCase()].oddsUrl, sbtechPayload, headers).then(function (res) {
            return parse(book.toUpperCase(), res.data.markets.filter(function (market) {
              return market.eventId === eventId;
            }));
          })["catch"](function (error) {
            return console.log(error);
          }));

        case 7:
          result = _context.sent;
          if (result) eventCache.set('EVENTS', result);
          return _context.abrupt("return", result);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
};

sbtech.getParticipantsForCompetition = function _callee2(book, competition) {
  var token, headers, body, leagueId;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(Token.getToken(book, bookmakers));

        case 2:
          token = _context2.sent;
          headers = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token,
              'locale': 'en'
            }
          };
          body = {
            "eventState": "Mixed",
            "eventTypes": ["Fixture", "AggregateFixture"],
            "ids": []
          };
          leagueId = leagues.filter(function (league) {
            return league.name.toUpperCase() === competition.toUpperCase();
          }).map(function (league) {
            return league.id;
          });
          body.ids = leagueId;
          _context2.next = 9;
          return regeneratorRuntime.awrap(axios.post('https://sbapi.sbtech.com/' + bookmakers[book.toUpperCase()].name + '/sportscontent/sportsbook/v1/Events/GetByLeagueId', body, headers).then(function (response) {
            return response.data.events.map(function (event) {
              return event.participants.map(function (participant) {
                return {
                  id: participant.id,
                  name: participant.name.toUpperCase()
                };
              });
            });
          })["catch"](function (error) {
            return console.log(error);
          }));

        case 9:
          return _context2.abrupt("return", _context2.sent);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
};

sbtech.getEventsForBookAndSport = function _callee3(book, sports) {
  var token, requests, events;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (eventCache.get('EVENTS')) {
            _context3.next = 12;
            break;
          }

          _context3.next = 3;
          return regeneratorRuntime.awrap(Token.getToken(book, bookmakers));

        case 3:
          token = _context3.sent;

          if (token) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return");

        case 6:
          requests = createRequest(book, sportMap[sports.toUpperCase()], token);
          _context3.next = 9;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            events = values.flat();
            eventCache.set('EVENTS', events);
          }));

        case 9:
          return _context3.abrupt("return", events);

        case 12:
          return _context3.abrupt("return", eventCache.get('EVENTS'));

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  });
};

function cleanBetOption(outcome) {
  if (outcome === 'Home') return '1';
  if (outcome === 'Away') return '2';
  if (outcome === 'Tie') return 'X';
  return outcome;
}

function parse(book, markets) {
  var moneylineFullTimeBetOffers = getBetOfferById(markets, '1_0');

  if (moneylineFullTimeBetOffers && moneylineFullTimeBetOffers[0]) {
    return getPricesFromBetOffer(moneylineFullTimeBetOffers[0], book);
  }
}

function getBetOfferById(betOffers, id) {
  return betOffers.filter(function (betOffer) {
    return betOffer.marketType.id === id;
  });
}

function getPricesFromBetOffer(betOffer, book) {
  var product;
  if (betOffer.marketType.id === '1_0') product = 'moneyline_full_time';
  var prices = betOffer.selections.map(function (selection) {
    return {
      points: selection.points,
      betOption: cleanBetOption(selection.outcomeType),
      odds: selection.trueOdds,
      open: !selection.isDisabled
    };
  });
  return {
    product: product,
    prices: prices
  };
}

function createRequest(book, sport, token) {
  var bookmaker = bookmakers[book.toUpperCase()];
  pages = [{
    "eventState": "Mixed",
    "eventTypes": ["Fixture"],
    "ids": [sport],
    "pagination": {
      "top": 300,
      "skip": 0
    }
  }, {
    "eventState": "Mixed",
    "eventTypes": ["Fixture"],
    "ids": [sport],
    "pagination": {
      "top": 300,
      "skip": 300
    }
  }, {
    "eventState": "Mixed",
    "eventTypes": ["Fixture"],
    "ids": [sport],
    "pagination": {
      "top": 300,
      "skip": 600
    }
  }, {
    "eventState": "Mixed",
    "eventTypes": ["Fixture"],
    "ids": [sport],
    "pagination": {
      "top": 300,
      "skip": 900
    }
  }, {
    "eventState": "Mixed",
    "eventTypes": ["Fixture"],
    "ids": [sport],
    "pagination": {
      "top": 300,
      "skip": 1200
    }
  }, {
    "eventState": "Mixed",
    "eventTypes": ["Fixture"],
    "ids": [sport],
    "pagination": {
      "top": 300,
      "skip": 1500
    }
  }];
  var headers = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      'locale': 'en'
    }
  };
  return pages.map(function (page) {
    return axios.post(bookmaker.dataUrl, page, headers).then(function (response) {
      return transform(response.data.events);
    })["catch"](function (error) {
      return console.log(error);
    });
  });

  function transform(events) {
    return events.map(function (event) {
      return {
        id: event.id,
        participants: event.participants.map(function (participant) {
          return {
            id: participant.id,
            name: participant.name
          };
        })
      };
    });
  }
}

module.exports = sbtech;