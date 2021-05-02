"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var betoffer_1 = require("../domain/betoffer");
var config_1 = require("../client/config");
var expect = require('chai').expect;
describe('SportEvent Test', function () {
    it("register betoffer", function () {
        var participant_club = config_1.jupilerProLeagueParticipants[0];
        var participant_anderlecht = config_1.jupilerProLeagueParticipants[1];
        var today = new Date();
        var eventBookmakerIds = [
            new betoffer_1.BookmakerId(betoffer_1.Bookmaker.UNIBET_BELGIUM, "1006478884", betoffer_1.IdType.EVENT),
            new betoffer_1.BookmakerId(betoffer_1.Bookmaker.PINNACLE, "1239809328", betoffer_1.IdType.EVENT)
        ];
        var ubbe_1X2_1 = new betoffer_1.BetOffer(betoffer_1.BetType._1X2, '1006478884', betoffer_1.Bookmaker.UNIBET_BELGIUM, '1', 8.80, NaN);
        var betOfferKey = [ubbe_1X2_1.betType, ubbe_1X2_1.betOptionName, ubbe_1X2_1.line].join(';');
        var sportEvent = new betoffer_1.SportEvent(today, betoffer_1.CompetitionName.JUPILER_PRO_LEAGUE, betoffer_1.SportName.FOOTBALL, eventBookmakerIds, {}, {}, [participant_club, participant_anderlecht]);
        var expected = new betoffer_1.BetOfferRegistered(ubbe_1X2_1);
        var betOfferRegistered = sportEvent.registerBetOffer(ubbe_1X2_1);
        expect(JSON.stringify(betOfferRegistered)).to.equal(JSON.stringify(expected));
        var result = sportEvent.betOffers[betOfferKey][betoffer_1.Bookmaker.UNIBET_BELGIUM];
        expect(JSON.stringify(result)).is.equal(JSON.stringify(ubbe_1X2_1));
    });
    it('should find value bets', function () {
        var participant_club = config_1.jupilerProLeagueParticipants[0];
        var participant_anderlecht = config_1.jupilerProLeagueParticipants[1];
        var today = new Date();
        var eventBookmakerIds = [
            new betoffer_1.BookmakerId(betoffer_1.Bookmaker.UNIBET_BELGIUM, "1006478884", betoffer_1.IdType.EVENT),
            new betoffer_1.BookmakerId(betoffer_1.Bookmaker.PINNACLE, "1239809328", betoffer_1.IdType.EVENT)
        ];
        var betOffers = [
            new betoffer_1.BetOffer(betoffer_1.BetType._1X2, '1006478884', betoffer_1.Bookmaker.UNIBET_BELGIUM, '1', 2.20, NaN),
            new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, '1006478884', betoffer_1.Bookmaker.UNIBET_BELGIUM, 'OVER', 3.00, 2.5),
            new betoffer_1.BetOffer(betoffer_1.BetType._1X2, '1239809328', betoffer_1.Bookmaker.PINNACLE, '1', 2.0, NaN, 1.9),
            new betoffer_1.BetOffer(betoffer_1.BetType.OVER_UNDER, '1239809328', betoffer_1.Bookmaker.PINNACLE, 'OVER', 2.2, 2.5, 2.1)
        ];
        var sportEvent = new betoffer_1.SportEvent(today, betoffer_1.CompetitionName.JUPILER_PRO_LEAGUE, betoffer_1.SportName.FOOTBALL, eventBookmakerIds, {}, {}, [participant_club, participant_anderlecht]);
        betOffers.forEach(function (betOffer) { return sportEvent.registerBetOffer(betOffer); });
        var valueBets = sportEvent.detectValueBets();
        console.log(valueBets);
        expect(valueBets.length).to.equal(2);
        valueBets.forEach(function (valueBet) {
            expect(valueBet.value).is.greaterThan(0);
            expect(valueBet.betOffer.bookMaker).is.equal(betoffer_1.Bookmaker.UNIBET_BELGIUM);
        });
    });
});
