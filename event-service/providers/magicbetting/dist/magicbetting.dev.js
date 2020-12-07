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

var magicbetting = {};
var websocket;

magicbetting.open = function () {
  console.log('open magicbetting');
  findApi();
};

magicbetting.getEventsForBookAndSport = function _callee(sport) {
  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!cache.get('EVENTS')) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return", Object.values(cache.mget(cache.get('EVENTS'))));

        case 4:
          return _context2.abrupt("return", []);

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
};

setInterval(function _callee2() {
  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          if (!cache.get('EVENTS')) {
            findApi();
          }

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
}, 10000);

function findApi() {
  var chrome, protocol, Network, Page;
  return regeneratorRuntime.async(function findApi$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(chromeLauncher.killAll());

        case 2:
          _context4.next = 4;
          return regeneratorRuntime.awrap(launchChrome());

        case 4:
          chrome = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(CDP({
            port: chrome.port
          }));

        case 7:
          protocol = _context4.sent;
          Network = protocol.Network, Page = protocol.Page;
          _context4.next = 11;
          return regeneratorRuntime.awrap(Network.webSocketCreated(function (params) {
            if (params.url.includes('magicbetting')) {
              websocket = new WebSocket(params.url, null, {
                rejectUnauthorized: false
              });
              websocket.on('open', function open() {
                websocket.send(JSON.stringify(["SUBSCRIBE\nid:/api/eventgroups/soccer-all-match-events-grouped-by-type\ndestination:/api/eventgroups/soccer-all-match-events-grouped-by-type\nlocale:nl\n\n\0"])); // subscribe to markets
                //circusWS.send(JSON.stringify(["SUBSCRIBE\nid:/api/markets/3276302953\ndestination:/api/markets/3276302833\nlocale:nl\n\n\u0000"]))
              });
              websocket.on('message', function incoming(data) {
                if (data.includes('soccer-all-match-events')) {
                  var test = data.substring(12);
                  var test2 = test.substring(0, test.length - 1);
                  var test3 = test2.substring(test2.indexOf('{'));
                  var test4 = test3.replace("\\u0000\"", '');
                  var s = test4.replace(/\\n/g, "\\n").replace(/\\'/g, "\\'").replace(/\\"/g, '\\"').replace(/\\&/g, "\\&").replace(/\\r/g, "\\r").replace(/\\t/g, "\\t").replace(/\\b/g, "\\b").replace(/\\f/g, "\\f").replace(/\\/g, "");
                  s = s.replace(/[\u0000-\u0019]+/g, "");

                  if (JSON.parse(s).groups) {
                    var events = JSON.parse(s).groups.map(function (group) {
                      return group.events.map(function (event) {
                        return event.id;
                      });
                    }).flat();
                    events.forEach(function (event) {
                      return websocket.send(JSON.stringify(["SUBSCRIBE\nid:/api/events/" + event + "\ndestination:/api/events/" + event + "\nlocale:nl\n\n\0"]));
                    });
                    console.log('magicbetting events found: ' + events.length);
                    cache.set('EVENTS', events);
                  }
                } else {
                  var _test = data.substring(12);

                  var _test2 = _test.substring(0, _test.length - 1);

                  var _test3 = _test2.substring(_test2.indexOf('{'));

                  var _test4 = _test3.replace("\\u0000\"", '');

                  var _s = _test4.replace(/\\n/g, "\\n").replace(/\\'/g, "\\'").replace(/\\"/g, '\\"').replace(/\\&/g, "\\&").replace(/\\r/g, "\\r").replace(/\\t/g, "\\t").replace(/\\b/g, "\\b").replace(/\\f/g, "\\f").replace(/\\/g, "");

                  _s = _s.replace(/[\u0000-\u0019]+/g, "");

                  try {
                    var event = JSON.parse(_s);

                    if (!cache.get(event.id)) {
                      cache.set(event.id, {
                        id: event.id,
                        participants: event.participants
                      });
                    }
                  } catch (e) {}
                }
              });
            }
          }));

        case 11:
          _context4.next = 13;
          return regeneratorRuntime.awrap(Network.enable());

        case 13:
          _context4.next = 15;
          return regeneratorRuntime.awrap(Page.enable());

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(Page.navigate({
            url: 'https://magicbetting.be/home'
          }));

        case 17:
          _context4.next = 19;
          return regeneratorRuntime.awrap(Page.loadEventFired());

        case 19:
        case "end":
          return _context4.stop();
      }
    }
  });
}

magicbetting.getBetOffersByEventId = function _callee3(eventId) {
  return regeneratorRuntime.async(function _callee3$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          return _context5.abrupt("return", cache.get(eventId));

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports = magicbetting;