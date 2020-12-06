"use strict";

var WebSocket = require("ws");

var NodeCache = require('node-cache');

var ttlSeconds = 60 * 1 * 1;
var cache = new NodeCache({
  stdTTL: ttlSeconds,
  checkperiod: ttlSeconds * 0.2,
  useClones: false
});

var CDP = require('chrome-remote-interface');

var chromeLauncher = require('chrome-launcher');

var magicbetting = require("../../../event-service/providers/magicbetting/magicbetting");

function launchChrome() {
  return regeneratorRuntime.async(function launchChrome$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(chromeLauncher.launch({
            chromeFlags: ['--no-first-run', '--headless', '--disable-gpu', '--no-sandbox']
          }));

        case 2:
          return _context.abrupt("return", _context.sent);

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
}

var event = {};

event.getEventsForBookAndSport = function _callee(book, sport) {
  var circusWS;
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          circusWS = new WebSocket(cache.get('API-URL'), null, {
            rejectUnauthorized: false
          });
          circusWS.on('open', function open() {
            // lists the event together with market ids
            //circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/sports/soccer\ndestination:/api/sports/soccer\nlocale:nl\n\n\u0000"]))
            //circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/eventgroups/soccer-live-match-events-grouped-by-type\ndestination:/api/eventgroups/soccer-live-match-events-grouped-by-type\nlocale:nl\n\n\u0000"]))
            circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/eventgroups/soccer-all-match-events-grouped-by-type\ndestination:/api/eventgroups/soccer-all-match-events-grouped-by-type\nlocale:nl\n\n\0"])); //circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/events/3243155496\ndestination:/api/events/3243155496\nlocale:nl\n\n\u0000"]))
            // subscribe to markets
            //circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/markets/3276302953\ndestination:/api/markets/3276302833\nlocale:nl\n\n\u0000"]))
          });
          circusWS.on('message', function incoming(data) {
            if (data.includes('soccer-all-match-events')) {
              var test = data.substring(12);
              var test2 = test.substring(0, test.length - 1);
              var test3 = test2.substring(test2.indexOf('{'));
              var test4 = test3.replace("\\u0000\"", '');
              var s = test4.replace(/\\n/g, "\\n").replace(/\\'/g, "\\'").replace(/\\"/g, '\\"').replace(/\\&/g, "\\&").replace(/\\r/g, "\\r").replace(/\\t/g, "\\t").replace(/\\b/g, "\\b").replace(/\\f/g, "\\f").replace(/\\/g, "");
              s = s.replace(/[\u0000-\u0019]+/g, "");
              cache.set('test', JSON.parse(s));
            }
          });
          return _context2.abrupt("return", cache.get('test'));

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

magicbetting.open = function () {
  console.log('open magicbetting');
};

setInterval(function _callee2() {
  var chrome, protocol, Network, Page;
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(chromeLauncher.killAll());

        case 2:
          _context3.next = 4;
          return regeneratorRuntime.awrap(launchChrome());

        case 4:
          chrome = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(CDP({
            port: chrome.port
          }));

        case 7:
          protocol = _context3.sent;
          Network = protocol.Network, Page = protocol.Page;
          _context3.next = 11;
          return regeneratorRuntime.awrap(Network.webSocketCreated(function (params) {
            if (params.url.includes('magicbetting')) {
              console.log('found api');
              cache.set('API-URL', params.url);
            }
          }));

        case 11:
          _context3.next = 13;
          return regeneratorRuntime.awrap(Network.enable());

        case 13:
          _context3.next = 15;
          return regeneratorRuntime.awrap(Page.enable());

        case 15:
          _context3.next = 17;
          return regeneratorRuntime.awrap(Page.navigate({
            url: 'https://magicbetting.be/home'
          }));

        case 17:
          _context3.next = 19;
          return regeneratorRuntime.awrap(Page.loadEventFired());

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  });
}, 10000);

event.getBetOffersByEventId = function _callee3(eventId) {
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          return _context4.abrupt("return", cache.get(eventId));

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports = event;