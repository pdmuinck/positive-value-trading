const expect = require('chai').expect
import {kambi, sbtech} from './test-data'
import {KambiParser, SbtechParser} from '../parser'
import {BetType} from "../../domain/betoffer";


describe('Kambi Parser Tests', function() {
    describe('#parse', function() {
        it('should parse betoffers', function() {
            const book = 'UNIBET_BE'
            const betOffers = KambiParser.parse(book, kambi)
            const betOffers_1X2 = betOffers.filter(betOffer => betOffer.betType === BetType._1X2.name)
            assert1X2(betOffers_1X2, 8.80, 4.0, 1.47, 1006478884, book)
            assertTotalGoals(betOffers, BetType.OVER_UNDER_TOTAL_GOALS, 2.12, 1.72, 2.5, 2.5,
                'OVER', 'UNDER', 1006478884, book)
            assertTotalGoals(betOffers, BetType.HANDICAP_GOALS, 1.93, 1.89, 0.5, -0.5,
                '1', '2', 1007031368, book)
        })
    })
})

describe('SBTECH parser tests', function() {
    it('should parse betoffers', function() {
        const book = 'BETFIRST'
        const betOffers = SbtechParser.parse(book, sbtech)
        assert1X2(betOffers, 1.86956522, 3.8, 4.75, '19522273', book)
        assertTotalGoals(betOffers, BetType.OVER_UNDER_TOTAL_GOALS, 2.17357752, 1.70343413, 2.5, 2.5,
            'OVER', 'UNDER', '21112532', book)
    })
})

function assert1X2(betOffers, expectedPrice1, expectedPriceX, expectedPrice2, eventId, bookMaker) {
    const betOffers_1X2 = betOffers.filter(betOffer => betOffer.betType === BetType._1X2.name)
    expect(betOffers_1X2.length).to.equal(BetType._1X2.betOptions)
    const betOption_1 = betOffers_1X2.filter(betOffer => betOffer.betOptionName ===  '1')[0]
    const betOption_X = betOffers_1X2.filter(betOffer => betOffer.betOptionName ===  'X')[0]
    const betOption_2 = betOffers_1X2.filter(betOffer => betOffer.betOptionName ===  '2')[0]
    expect(betOption_1.price).to.equal(expectedPrice1)
    expect(betOption_X.price).to.equal(expectedPriceX)
    expect(betOption_2.price).to.equal(expectedPrice2)
    expect(betOption_2.line).to.be.NaN
    expect(betOption_1.line).to.be.NaN
    expect(betOption_X.line).to.be.NaN
    expect(betOption_2.eventId).to.equal(eventId)
    expect(betOption_1.eventId).to.equal(eventId)
    expect(betOption_X.eventId).to.equal(eventId)
    expect(betOption_2.bookMaker).to.equal(bookMaker)
    expect(betOption_1.bookMaker).to.equal(bookMaker)
    expect(betOption_X.bookMaker).to.equal(bookMaker)
}

function assertTotalGoals(betOffers, betType, expectedPrice1, expectedPrice2, line1, line2, label1, label2,
                          eventId, book){
    const betOffersFiltered = betOffers.filter(betOffer => betOffer.betType === betType.name)
    expect(betOffersFiltered.length).to.equal(betType.betOptions)
    const betOption_1 = betOffersFiltered.filter(betOffer => betOffer.betOptionName ===  label1)[0]
    const betOption_2 = betOffersFiltered.filter(betOffer => betOffer.betOptionName ===  label2)[0]
    expect(betOption_1.price).to.equal(expectedPrice1)
    expect(betOption_2.price).to.equal(expectedPrice2)
    expect(betOption_1.line).to.equal(line1)
    expect(betOption_2.line).to.equal(line2)
    expect(betOption_1.bookMaker).to.equal(book)
    expect(betOption_2.bookMaker).to.equal(book)
    expect(betOption_1.eventId).to.equal(eventId)
    expect(betOption_2.eventId).to.equal(eventId)
}