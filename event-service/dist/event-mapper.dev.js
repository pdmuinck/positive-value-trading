"use strict";

var participants = require('./participants.json');

var eventMapper = {};

eventMapper.map = function (providers) {
  var result = {};
  providers.forEach(function (provider) {
    if (provider.events) {
      provider.events.filter(function (event) {
        return event.participants && event.participants.length === 2;
      }).forEach(function (event) {
        var foundParticipants = findParticipants(event, provider.provider.toLowerCase());

        if (foundParticipants.length === 2) {
          var eventKey = foundParticipants.join(';');
          var mappedEvent = result[eventKey];

          if (!mappedEvent) {
            result[eventKey] = {};
            result[eventKey][provider.provider.toLowerCase()] = event.id;
            mappedEvent = result[eventKey];
          } // search other providers


          providers.filter(function (otherProvider) {
            return otherProvider.provider.toUpperCase() !== provider.provider.toUpperCase();
          }).forEach(function (otherProvider) {
            if (otherProvider.events) {
              otherProvider.events.filter(function (event) {
                return event.participants && event.participants.length === 2;
              }).forEach(function (otherEvent) {
                var otherFoundParticipants = findParticipants(otherEvent, otherProvider.provider.toLowerCase());

                if (otherFoundParticipants) {
                  var otherEventKey = otherFoundParticipants.join(';');

                  if (otherEventKey === eventKey) {
                    mappedEvent[otherProvider.provider.toLowerCase()] = otherEvent.id;
                  }
                }
              });
            }
          });
        }
      });
    }
  });
  return result;
};

function findParticipants(event, provider) {
  var entries = Object.entries(participants);
  foundParticipants = [];

  if (provider === 'kambi') {
    var homeId = event.participants.filter(function (participant) {
      return participant.home;
    }).map(function (participant) {
      return participant.id;
    })[0];
    var awayId = event.participants.filter(function (participant) {
      return participant.id !== homeId;
    }).map(function (participant) {
      return participant.id;
    })[0];
    var foundParticipant = entries.filter(function (entry) {
      return entry[1][provider] == homeId;
    }).map(function (entry) {
      return entry[0];
    });

    if (foundParticipant[0]) {
      foundParticipants.push(foundParticipant[0]);
    }

    foundParticipant = entries.filter(function (entry) {
      return entry[1][provider] == awayId;
    }).map(function (entry) {
      return entry[0];
    });

    if (foundParticipant[0]) {
      foundParticipants.push(foundParticipant[0]);
    }

    return foundParticipants;
  } else {
    event.participants.forEach(function (participant) {
      var foundParticipant = entries.filter(function (entry) {
        return entry[1][provider] == participant.id;
      }).map(function (entry) {
        return entry[0];
      });

      if (foundParticipant[0]) {
        foundParticipants.push(foundParticipant[0]);
      }
    });
    return foundParticipants;
  }
}

module.exports = eventMapper;