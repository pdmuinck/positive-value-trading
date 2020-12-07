"use strict";

var axios = require('axios');

var bookmakers = require('./bookmakers.json');

var leagues = require('./leagues.json');

var betOfferTypes = require('./betoffer-type.json');

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 1 * 1;
var eventCache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});
var requests = {
  "FOOTBALL": 'https://{host}/offering/v2018/{book}/event/group/1000093190.json?includeParticipants=true&lang=en_GB&market=BE',
  "BASKETBALL": 'https://{host}/offering/v2018/{book}/event/group/1000093204.json?includeParticipants=true&lang=en_GB&market=BE',
  "AMERICAN_FOOTBALL": 'https://{host}/offering/v2018/{book}/event/group/1000093199.json?includeParticipants=true&lang=en_GB&market=BE',
  "TENNIS": 'https://{host}/offering/v2018/{book}/event/group/1000093193.json?includeParticipants=true&lang=en_GB&market=BE',
  "TABLE_TENNIS": 'https://{host}/offering/v2018/{book}/event/group/1000093215.json?includeParticipants=true&lang=en_GB&market=BE',
  "DARTS": 'https://{host}/offering/v2018/{book}/event/group/1000093225.json?includeParticipants=true&lang=en_GB&market=BE',
  "ICE_HOCKEY": 'https://{host}/offering/v2018/{book}/event/group/1000093191.json?includeParticipants=true&lang=en_GB&market=BE',
  "AUSTRALIAN_RULES": 'https://{host}/offering/v2018/{book}/event/group/1000449347.json?includeParticipants=true&lang=en_GB&market=BE',
  "BOXING": 'https://{host}/offering/v2018/{book}/event/group/1000093201.json?includeParticipants=true&lang=en_GB&market=BE',
  "CRICKET": 'https://{host}/offering/v2018/{book}/event/group/1000093178.json?includeParticipants=true&lang=en_GB&market=BE',
  "ESPORTS": 'https://{host}/offering/v2018/{book}/event/group/2000077768.json?includeParticipants=true&lang=en_GB&market=BE',
  "GOLF": 'https://{host}/offering/v2018/{book}/event/group/1000093187.json?includeParticipants=true&lang=en_GB&market=BE',
  "hostBALL": 'https://{host}/offering/v2018/{book}/event/group/1000093211.json?includeParticipants=true&lang=en_GB&market=BE',
  "RUGBY_LEAGUE": 'https://{host}/offering/v2018/{book}/event/group/1000154363.json?includeParticipants=true&lang=en_GB&market=BE',
  "RUGBY_UNION": 'https://{host}/offering/v2018/{book}/event/group/1000093230.json?includeParticipants=true&lang=en_GB&market=BE',
  "SNOOKER": 'https://{host}/offering/v2018/{book}/event/group/1000093176.json?includeParticipants=true&lang=en_GB&market=BE',
  "MMA": 'https://{host}/offering/v2018/{book}/event/group/1000093238.json?includeParticipants=true&lang=en_GB&market=BE',
  "VOLLEYBALL": 'https://{host}/offering/v2018/{book}/event/group/1000093214.json?includeParticipants=true&lang=en_GB&market=BE',
  "WRESTLING": 'https://{host}/offering/v2018/{book}/event/group/2000089034.json?includeParticipants=true&lang=en_GB&market=BE'
};
var kambi = {};

kambi.getBetOffersForBookAndEventId = function _callee(book, eventId) {
  var bookmakerInfo, url, betOffers, moneylineFullTimeBetOffers;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          bookmakerInfo = Object.entries(bookmakers).filter(function (pair) {
            return pair[0] === book.toUpperCase();
          }).map(function (pair) {
            return pair[1];
          })[0];

          if (bookmakerInfo) {
            _context.next = 3;
            break;
          }

          throw new Error('Book not found: ' + book);

        case 3:
          url = 'https://{host}/offering/v2018/{book}'.replace('{host}', bookmakerInfo.host).replace('{book}', bookmakerInfo.code) + '/betoffer/event/' + eventId + '.json';
          /*
          if(type) {
              url += '?type=' + betOfferTypes[type]
          }
          */

          _context.next = 6;
          return regeneratorRuntime.awrap(axios.get(url).then(function (response) {
            return response.data.betOffers;
          })["catch"](function (error) {
            return console.log(error);
          }));

        case 6:
          betOffers = _context.sent;

          if (!betOffers) {
            _context.next = 11;
            break;
          }

          moneylineFullTimeBetOffers = findBetOfferById(betOffers, 1001159858);

          if (!(moneylineFullTimeBetOffers && moneylineFullTimeBetOffers[0])) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", getPricesFromBetOffer(moneylineFullTimeBetOffers[0]));

        case 11:
        case "end":
          return _context.stop();
      }
    }
  });
};

kambi.getParticipantsForCompetition = function _callee2(book, competition) {
  var groupId;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          groupId = leagues.filter(function (league) {
            return league.name.toUpperCase() === competition;
          }).map(function (league) {
            return league.id;
          });
          _context2.next = 3;
          return regeneratorRuntime.awrap(axios('https://eu-offering.kambicdn.org/offering/v2018/ubbe/event/group/' + groupId + '.json?includeParticipants=true').then(function (response) {
            return response.data.events.filter(function (event) {
              return event.tags.includes('MATCH');
            }).map(function (event) {
              return event.participants.map(function (participant) {
                return {
                  id: participant.participantId,
                  name: participant.name.toUpperCase()
                };
              });
            });
          })["catch"](function (error) {
            return null;
          }));

        case 3:
          return _context2.abrupt("return", _context2.sent);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

kambi.getEventsForBookAndSport = function _callee3(book, sports) {
  var bookmakerInfo, calls, events;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (eventCache.get('EVENTS')) {
            _context3.next = 10;
            break;
          }

          bookmakerInfo = Object.entries(bookmakers).filter(function (pair) {
            return pair[0] === book.toUpperCase();
          }).map(function (pair) {
            return pair[1];
          })[0];

          if (bookmakerInfo) {
            _context3.next = 4;
            break;
          }

          throw new Error('Book not found: ' + book);

        case 4:
          calls = Object.values(requests).map(function (url) {
            return createRequest(url, bookmakerInfo);
          });
          _context3.next = 7;
          return regeneratorRuntime.awrap(Promise.all(calls).then(function (values) {
            events = values.flat();
            eventCache.set('EVENTS', events);
          }));

        case 7:
          return _context3.abrupt("return", events);

        case 10:
          return _context3.abrupt("return", eventCache.get('EVENTS'));

        case 11:
        case "end":
          return _context3.stop();
      }
    }
  });
};

function getPricesFromBetOffer(betOffer) {
  var product;
  if (betOffer.criterion.id === 1001159858) product = 'moneyline_full_time';
  var prices = betOffer.outcomes.map(function (outcome) {
    var betOption = outcome.englishLabel;
    var odds = outcome.odds / 1000;
    var open = outcome.status === 'OPEN' ? true : false;
    return {
      betOption: betOption,
      odds: odds,
      open: open
    };
  });
  return {
    product: product,
    prices: prices
  };
}

function findBetOfferById(betOffers, id) {
  return betOffers.filter(function (betOffer) {
    return betOffer.criterion.id === id;
  });
}

function createRequest(url, bookmakerInfo) {
  return axios.get(url.replace('{book}', bookmakerInfo.code).replace('{host}', bookmakerInfo.host)).then(function (response) {
    return transform(response.data.events);
  })["catch"](function (error) {
    return null;
  });
}

function transform(events) {
  return events.map(function (event) {
    return {
      id: event.id,
      participants: event.participants.map(function (participant) {
        return {
          id: participant.participantId,
          home: participant.home,
          name: participant.name
        };
      })
    };
  });
}

module.exports = kambi;