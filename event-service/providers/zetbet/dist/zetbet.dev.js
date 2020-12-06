"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var axios = require('axios');

var parser = require('node-html-parser');
/*
axios.get('https://www.zebet.be/en/competition/6674-champions_league').then(response => console.log(parse(response.data)))

function parse(data) {
    const root = parser.parse(data)
    return root.querySelectorAll('a').map(htmlElement => htmlElement.rawAttrs).filter(url => url.includes('event')).map(link => link.split('\n')[0].split('href=')[1].replace(/"/g, ''))
}
*/


JSON.safeStringify = function (obj) {
  var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var cache = [];
  var retVal = JSON.stringify(obj, function (key, value) {
    return _typeof(value) === "object" && value !== null ? cache.includes(value) ? undefined // Duplicate reference found, discard key
    : cache.push(value) && value // Store value in our collection
    : value;
  }, indent);
  cache = null;
  return retVal;
};

var zetbet = {};

zetbet.getById = function _callee(id) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", axios.get('https://www.zebet.be/en/event/wjaz1-fk_krasnodar_rennes').then(function (response) {
            return parseBets(response.data);
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

zetbet.getEventsForBookAndSport = function _callee2(book, sport) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = zetbet;

function parseBets(data) {
  var root = parser.parse(data);
  return JSON.parse(JSON.safeStringify(root.querySelectorAll('.pmq-cote'))); //return JSON.parse(JSON.safeStringify(root.querySelectorAll('a').filter(htmlElement => htmlElement.rawAttrs.includes('betting'))))
}

zetbet.getByIdEuroTierce = function _callee3(id) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          return _context3.abrupt("return", axios.get('https://sports.eurotierce.be/nl/event/3326165-milan-ac-celtic-glasgow').then(function (response) {
            return testparse(response.data);
          }));

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
};

function testparse(data) {
  var root = parser.parse(data);
  return JSON.parse(JSON.safeStringify(root.querySelectorAll('.odds-question'))); // bettype: snc-odds-actor
  // bet product: odds-question-label
  // odds-question
  // price: snc-odds-odd nb-load

  return root.querySelectorAll('.snc-odds-odd');
}