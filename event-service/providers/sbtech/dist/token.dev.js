"use strict";

var axios = require('axios');

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 60 * 30;
var tokenCache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});
var token = {};

function getToken(book, bookmakers) {
  var token, requests, bookmaker, apiV2, _token;

  return regeneratorRuntime.async(function getToken$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = tokenCache.get(book.toUpperCase());

          if (token) {
            _context.next = 17;
            break;
          }

          requests = [];
          bookmaker = bookmakers[book.toUpperCase()];
          apiV2 = false;
          if (bookmaker.tokenUrl.includes('v2')) apiV2 = true;

          if (apiV2) {
            requests.push(axios.get(bookmaker.tokenUrl).then(function (res) {
              return res.data.token;
            })["catch"](function (error) {
              return null;
            }));
          } else {
            requests.push(axios.get(bookmaker.tokenUrl).then(function (res) {
              return res.data.split('ApiAccessToken = \'')[1].replace('\'', '');
            })["catch"](function (error) {
              return null;
            }));
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            _token = values[0];
          }));

        case 9:
          if (!_token) {
            _context.next = 14;
            break;
          }

          tokenCache.set(book.toUpperCase(), _token);
          return _context.abrupt("return", _token);

        case 14:
          getToken(book, bookmakers);

        case 15:
          _context.next = 18;
          break;

        case 17:
          return _context.abrupt("return", token);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
}

token.getToken = function _callee(book, bookmakers) {
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          return _context2.abrupt("return", getToken(book, bookmakers));

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = token;