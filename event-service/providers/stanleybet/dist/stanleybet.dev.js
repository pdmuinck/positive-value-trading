"use strict";

var axios = require('axios');

var leagues = require('./resources/leagues.json');

var getEventsUrl = 'https://sportsbook.stanleybet.be/XSport/dwr/call/plaincall/IF_GetAvvenimenti.getEventi.dwr';
var getSingleEventUrl = 'https://sportsbook.stanleybet.be/XSport/dwr/call/plaincall/IF_GetAvvenimentoSingolo.getEvento.dwr';
var headers = {
  headers: {
    'Content-Type': 'text/plain'
  }
};
var stanleybet = {};

stanleybet.getEventsForBookAndSport = function _callee(book, sport) {
  var requests, results;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          requests = leagues.map(function (league) {
            var body = 'callCount=1\nnextReverseAjaxIndex=0\nc0-scriptName=IF_GetAvvenimenti\nc0-methodName=getEventi\nc0-id=0\nc0-param0=number:6\nc0-param1=string:\nc0-param2=string:\nc0-param3=number:1\nc0-param4=number:' + league.id + '\nc0-param5=boolean:false\nc0-param6=string:STANLEYBET\nc0-param7=number:0\nc0-param8=number:0\nc0-param9=string:nl\nbatchId=8\ninstanceId=0\npage=%2FXSport%2Fpages%2Fprematch.jsp%3Fsystem_code%3DSTANLEYBET%26language%3Dnl%26token%3D%26ip%3D\nscriptSessionId=jUP0TgbNU12ga86ZyrjLTrS8NRSwl721Uon/AVY2Uon-upTglJydk\n';
            return axios.post(getEventsUrl, body, headers).then(function (response) {
              return transform(response.data, league.id);
            })["catch"](function (error) {
              return console.log(error);
            });
          });
          _context.next = 3;
          return regeneratorRuntime.awrap(Promise.all(requests).then(function (values) {
            results = values.flat();
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

function transform(eventData, realLeagueId) {
  var events = eventData.split('alias').filter(function (event) {
    return event.includes('avv:');
  });
  return events.map(function (event) {
    var test = event.split('avv:')[1];
    var eventId = test.split(',')[0];
    var descriptionPart = test.split('"desc_avv":')[1];
    var participants = descriptionPart.split(',')[0].split(' - ').map(function (participant) {
      return participant.replace(/\"/g, '').trim();
    });
    var leagueId = descriptionPart.split('pal:')[1].split(',')[0];
    return {
      id: eventId,
      participants: participants.map(function (participant) {
        return {
          id: participant,
          name: participant
        };
      }),
      leagueId: leagueId,
      realLeagueId: realLeagueId
    };
  });
}

var bodySingleEvent = "callCount=1\nnextReverseAjaxIndex=0\nc0-scriptName=IF_GetAvvenimentoSingolo\nc0-methodName=getEvento\nc0-id=0\nc0-param0=string:1\nc0-param1=string:280\nc0-param2=string:30481\nc0-param3=string:2549\nc0-param4=string:STANLEYBET\nc0-param5=number:0\nc0-param6=number:0\nc0-param7=string:nl\nc0-param8=boolean:true\nbatchId=781\ninstanceId=0\npage=%2FXSport%2Fpages%2Flive_match.jsp%3Ftoken%3Dsample_token%26ip%3D127.0.0.1%26system_code%3DSTANLEYBET%26id_pvr%3D%26language%3Dnl%26operator%3Dfalse%26cashier%3Dfalse%26prenotatore%3Dfalse%26hide_switcher_bar%3Dfalse\nscriptSessionId=NzRgVIcEnGbOpnSsd4bO~wYbxnp!hnUVqon/MCl8ron-ome$1g3hu\n"; // avv (param3) + pal (param2) to get details

module.exports = stanleybet;