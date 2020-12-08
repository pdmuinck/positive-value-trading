"use strict";

var mapper = {};

mapper.map = function (participants) {
  var result = {};
  participants.forEach(function (book) {
    book.participants.forEach(function (participant) {
      var provider = book.provider.toUpperCase();
      var mappedParticipant = result[participant.name.toUpperCase()];

      if (!mappedParticipant) {
        result[participant.name.toUpperCase()] = {};
        result[participant.name.toUpperCase()][provider.toLowerCase()] = participant.id;
        mappedParticipant = result[participant.name.toUpperCase()];
      }

      participants.filter(function (other) {
        return other.provider !== book.provider;
      }).forEach(function (otherBook) {
        otherBook.participants.forEach(function (otherParticipant) {
          otherProvider = otherBook.provider.toLowerCase();

          if (otherParticipant.name.toUpperCase() === participant.name.toUpperCase()) {
            mappedParticipant[otherProvider] = otherParticipant.id;
          }
        });
      });
    });
  });
  var ordered = {};
  Object.keys(result).sort().forEach(function (key) {
    ordered[key] = result[key];
  });
  return ordered;
};

module.exports = mapper;