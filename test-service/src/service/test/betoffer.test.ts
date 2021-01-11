import {
    BetOffer, BetOfferRegistered,
    BetType,
    BookMaker,
    Participant,
    Sport,
    SportCompetition,
    SportEvent, ValueBetFoundEvent
} from "../../domain/betoffer";

const expect = require('chai').expect

describe('SportEvent Test', function() {
    it("register betoffer", function() {
        const participant_club = new Participant('CLUB_BRUGGE')
        const participant_anderlecht = new Participant('ANDERLECHT')
        const today = new Date()
        const eventMap = {'UNIBET_BELGIUM': '123', 'PINNACLE': '12345'}

        const ubbe_1X2_1: BetOffer = new BetOffer(BetType._1X2, '123', BookMaker.UNIBET_BELGIUM,
            '1', 8.80, NaN)

        const betOfferKey = [ubbe_1X2_1.betType, ubbe_1X2_1.betOptionName, ubbe_1X2_1.line].join(';')

        const sportEvent = new SportEvent(today, SportCompetition.JUPILER_PRO_LEAGUE, Sport.FOOTBALL, eventMap,
            {}, {}, [participant_club, participant_anderlecht])

        const expected = new BetOfferRegistered(ubbe_1X2_1)
        const betOfferRegistered = sportEvent.registerBetOffer(ubbe_1X2_1)

        expect(JSON.stringify(betOfferRegistered)).to.equal(JSON.stringify(expected))
        const result = sportEvent.betOffers[betOfferKey][BookMaker.UNIBET_BELGIUM]
        expect(JSON.stringify(result)).is.equal(JSON.stringify(ubbe_1X2_1))
    })

    it('should find value bets', function() {
        const participant_club = new Participant('CLUB_BRUGGE')
        const participant_anderlecht = new Participant('ANDERLECHT')
        const today = new Date()
        const eventMap = {'UNIBET_BELGIUM': '123', 'PINNACLE': '12345'}

        const betOffers = [
            new BetOffer(BetType._1X2, '123', BookMaker.UNIBET_BELGIUM,
                '1', 2.20, NaN),
            new BetOffer(BetType.OVER_UNDER, '123', BookMaker.UNIBET_BELGIUM,
                'OVER', 3.00, 2.5),
            new BetOffer(BetType._1X2, '12345', BookMaker.PINNACLE,
                '1', 2.0, NaN, 1.9),
            new BetOffer(BetType.OVER_UNDER, '12345', BookMaker.PINNACLE,
                'OVER', 2.2, 2.5, 2.1)
        ]

        const sportEvent = new SportEvent(today, SportCompetition.JUPILER_PRO_LEAGUE, Sport.FOOTBALL, eventMap,
            {}, {}, [participant_club, participant_anderlecht])

        betOffers.forEach(betOffer => sportEvent.registerBetOffer(betOffer))

        const valueBets: ValueBetFoundEvent[] = sportEvent.detectValueBets()
        console.log(valueBets)
        expect(valueBets.length).to.equal(2)
        valueBets.forEach(valueBet => {
            expect(valueBet.value).is.greaterThan(0)
            expect(valueBet.betOffer.bookMaker).is.equal(BookMaker.UNIBET_BELGIUM)
        })
    })
})