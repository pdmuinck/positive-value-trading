"use strict";

var mapper = require('./mapper');

var eventMapper = require('./event-mapper');

var api = {};

api.getEventsBySport = function _callee(sport) {
  var requests, results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          requests = [getEventsByProviderAndBookAndSport('kambi', 'unibet_belgium', sport), getEventsByProviderAndBookAndSport('sbtech', 'betfirst', sport), getEventsByProviderAndBookAndSport('altenar', 'goldenpalace', sport), getEventsByProviderAndBookAndSport('bet90', 'bet90', sport), getEventsByProviderAndBookAndSport('betcenter', 'betcenter', sport)];
          _context.next = 3;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            results = eventMapper.map(values);
          }));

        case 3:
          return _context.abrupt("return", results);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

api.getBetOffers = function _callee2(provider, book, eventId) {
  var providerApi;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          providerApi = require('./providers/' + provider + '/' + provider + '.js');
          return _context2.abrupt("return", providerApi.getBetOffersForBookAndEventId(book, eventId));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};

api.getEventsByProviderAndBookAndSport = function _callee3(provider, book, sport) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", getEventsByProviderAndBookAndSport(provider, book, sport));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
};

api.getParticipantsForProviderAndBookAndCompetition = function _callee4(provider, book, competition) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", getParticipantsForProviderAndBookAndCompetition(provider, book, competition));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};

api.getParticipantsByCompetition = function _callee5(competition) {
  var requests, results;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          requests = [getParticipantsForProviderAndBookAndCompetition('kambi', 'unibet_belgium', competition), getParticipantsForProviderAndBookAndCompetition('sbtech', 'betfirst', competition)];
          _context5.next = 3;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            results = mapper.map(values);
          }));

        case 3:
          return _context5.abrupt("return", results);

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
};

function getParticipantsForProviderAndBookAndCompetition(provider, book, competition) {
  var providerApi;
  return regeneratorRuntime.async(function getParticipantsForProviderAndBookAndCompetition$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          providerApi = require('./providers/' + provider + '/' + provider + '.js');
          _context6.next = 3;
          return regeneratorRuntime.awrap(providerApi.getParticipantsForCompetition(book, competition));

        case 3:
          participants = _context6.sent;
          return _context6.abrupt("return", {
            provider: provider,
            book: book,
            competition: competition,
            participants: participants.flat().filter(function (v, i, a) {
              return a.findIndex(function (t) {
                return t.id === v.id;
              }) === i;
            })
          });

        case 5:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function getEventsByProviderAndBookAndSport(provider, book, sport) {
  var providerApi, events;
  return regeneratorRuntime.async(function getEventsByProviderAndBookAndSport$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          providerApi = require('./providers/' + provider + '/' + provider + '.js');
          _context7.next = 3;
          return regeneratorRuntime.awrap(providerApi.getEventsForBookAndSport(book, sport));

        case 3:
          events = _context7.sent;
          return _context7.abrupt("return", {
            provider: provider,
            book: book,
            events: events
          });

        case 5:
        case "end":
          return _context7.stop();
      }
    }
  });
}

module.exports = api;