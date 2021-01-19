import {
    BetOffer, BetOfferRegistered,
    BetType,
    Bookmaker, BookmakerId, CompetitionName, IdType,
    Participant,
    Sport,
    SportEvent, SportName, ValueBetFoundEvent
} from "../../domain/betoffer";
import {jupilerProLeagueParticipants} from "../../client/config";

const expect = require('chai').expect

describe('SportEvent Test', function() {
    it("register betoffer", function() {
        const participant_club = jupilerProLeagueParticipants[0]
        const participant_anderlecht = jupilerProLeagueParticipants[1]
        const today = new Date()
        const eventBookmakerIds = [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1006478884", IdType.EVENT),
            new BookmakerId(Bookmaker.PINNACLE, "1239809328", IdType.EVENT)
        ]

        const ubbe_1X2_1: BetOffer = new BetOffer(BetType._1X2, '1006478884', Bookmaker.UNIBET_BELGIUM,
            '1', 8.80, NaN)

        const betOfferKey = [ubbe_1X2_1.betType, ubbe_1X2_1.betOptionName, ubbe_1X2_1.line].join(';')

        const sportEvent = new SportEvent(today, CompetitionName.JUPILER_PRO_LEAGUE, SportName.FOOTBALL, eventBookmakerIds,
            {}, {}, [participant_club, participant_anderlecht])

        const expected = new BetOfferRegistered(ubbe_1X2_1)
        const betOfferRegistered = sportEvent.registerBetOffer(ubbe_1X2_1)

        expect(JSON.stringify(betOfferRegistered)).to.equal(JSON.stringify(expected))
        const result = sportEvent.betOffers[betOfferKey][Bookmaker.UNIBET_BELGIUM]
        expect(JSON.stringify(result)).is.equal(JSON.stringify(ubbe_1X2_1))
    })

    it('should find value bets', function() {
        const participant_club = jupilerProLeagueParticipants[0]
        const participant_anderlecht = jupilerProLeagueParticipants[1]
        const today = new Date()
        const eventBookmakerIds = [
            new BookmakerId(Bookmaker.UNIBET_BELGIUM, "1006478884", IdType.EVENT),
            new BookmakerId(Bookmaker.PINNACLE, "1239809328", IdType.EVENT)
        ]

        const betOffers = [
            new BetOffer(BetType._1X2, '1006478884', Bookmaker.UNIBET_BELGIUM,
                '1', 2.20, NaN),
            new BetOffer(BetType.OVER_UNDER, '1006478884', Bookmaker.UNIBET_BELGIUM,
                'OVER', 3.00, 2.5),
            new BetOffer(BetType._1X2, '1239809328', Bookmaker.PINNACLE,
                '1', 2.0, NaN, 1.9),
            new BetOffer(BetType.OVER_UNDER, '1239809328', Bookmaker.PINNACLE,
                'OVER', 2.2, 2.5, 2.1)
        ]

        const sportEvent = new SportEvent(today, CompetitionName.JUPILER_PRO_LEAGUE, SportName.FOOTBALL, eventBookmakerIds,
            {}, {}, [participant_club, participant_anderlecht])

        betOffers.forEach(betOffer => sportEvent.registerBetOffer(betOffer))

        const valueBets: ValueBetFoundEvent[] = sportEvent.detectValueBets()
        console.log(valueBets)
        expect(valueBets.length).to.equal(2)
        valueBets.forEach(valueBet => {
            expect(valueBet.value).is.greaterThan(0)
            expect(valueBet.betOffer.bookMaker).is.equal(Bookmaker.UNIBET_BELGIUM)
        })
    })
})