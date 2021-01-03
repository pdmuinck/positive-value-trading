const expect = require('chai').expect
import {kambi} from './test-data'
import {KambiParser} from '../parser'
import {BookMaker, BetType} from "../../domain/betoffer";


describe('Kambi Parser Tests', function() {
    describe('#parse', function() {
        it('should return 1X2 betOffer type for criterion 1001159858', function() {
            const book = 'UNIBET_BE'
            const betOffers = KambiParser.parse(book, kambi)
            const betOffer_1X2 = betOffers.filter(betOffer => betOffer.betType === BetType._1X2.name)[0]
            expect(betOffer_1X2.eventId).to.equal(1006478884)
            expect(betOffer_1X2.betType).to.equal('1X2')
            expect(betOffer_1X2.bookMaker).to.equal(book)
            const betOptions = betOffer_1X2.betOptions
            const betOption_1 = betOptions.filter(betOption => betOption.betOptionName ===  '1')[0]
            const betOption_X = betOptions.filter(betOption => betOption.betOptionName ===  'X')[0]
            const betOption_2 = betOptions.filter(betOption => betOption.betOptionName ===  '2')[0]
            expect(betOption_1.price).to.equal(8.80)
            expect(betOption_X.price).to.equal(4.0)
            expect(betOption_2.price).to.equal(1.47)
        })
    })
})